import isObject from "is-object";
import * as React from "react";
import { atom, useRecoilCallback, useSetRecoilState } from "recoil";
import { FILE_VERSION, IS_ELECTRON, msg, PROGRAM_IDENTIFIER } from "../../config";
import { _camera } from "../../state/camera";
import { _lines } from "../../state/lines";
import { _saveLocation } from "../../state/save";
import { Line, Position } from "../../types/types";

const fs = IS_ELECTRON ? require("fs").promises : null;
const remote = IS_ELECTRON ? require('@electron/remote') : null;

export interface SaveObject {
    meta: {
        p: typeof PROGRAM_IDENTIFIER,
        v: typeof FILE_VERSION,
        d: number,
    },
    data: {
        camera: Position;
        lines: Line[];
    }
}

interface SaveLoadFunctions {
    save: (location: string, data: SaveObject) => Promise<void>,
    load: (location: string) => Promise<SaveObject>,
    duplicateCurrent: () => Promise<void>,
    saveCurrent: () => Promise<void>,
    loadCurrent: () => Promise<void>,
    resetCurrent: () => void
}

export const _saveLoad = atom<null | SaveLoadFunctions>({
    key: "saveLoad",
    default: null
});

const SaveLoad = () => {

    const setSaveLoad = useSetRecoilState(_saveLoad);

    const getSaveObject = useRecoilCallback(({ snapshot }) => async (): Promise<SaveObject> => {
        return {
            meta: {
                v: FILE_VERSION,
                p: PROGRAM_IDENTIFIER,
                d: new Date().getTime()
            },
            data: {
                lines: await snapshot.getPromise(_lines),
                camera: await snapshot.getPromise(_camera)
            }
        }
    })

    const save: SaveLoadFunctions["save"] = async (location, data) => {
        if (fs && remote) {
            try {
                await fs.writeFile(location, JSON.stringify(data));
            } catch (err) {
                throw new Error(msg.save.couldntWriteFile);
            }
            return;
        }
        throw new Error(msg.save.savingNotSupported);
    }

    const load: SaveLoadFunctions["load"] = async (location) => {
        if (fs && remote) {
            const raw = await fs.readFile(location, "utf-8").catch(() => {
                throw new Error(msg.load.couldntReadFile);
            });

            const data: unknown = (function parseJson() {
                try {
                    return JSON.parse(raw);
                } catch (err) {
                    throw new Error(msg.load.couldntParseJson);
                }
            })();

            const verify = (val: unknown): val is SaveObject => {
                if (!isObject(val)) {
                    return false
                }

                if (
                    !isObject(val.meta) ||
                    !isObject(val.data)
                ) {
                    return false;
                }

                return (
                    "v" in val.meta &&
                    val.meta.p === PROGRAM_IDENTIFIER &&
                    "lines" in val.data &&
                    "camera" in val.data
                );
            }

            if (verify(data)) {
                if (data.meta.v !== FILE_VERSION) {
                    throw new Error(msg.load.fileDifferentVersion);
                }

                return data;
            } else {
                throw new Error(msg.load.jsonWrongFormatted)
            }
        }
        throw new Error(msg.load.loadingNotSupported);
    }

    const saveCurrent: SaveLoadFunctions["saveCurrent"] = useRecoilCallback(({ snapshot, set }) => async () => {
        if (remote) {
            const filepath = await snapshot.getPromise(_saveLocation);

            if (filepath) {
                await save(filepath, await getSaveObject());
            } else {
                const result = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                    defaultPath: "new.math"
                });

                if (!result.canceled) {
                    await save(result.filePath, await getSaveObject());
                    set(_saveLocation, result.filePath);
                }
            }
            return;
        }
        throw new Error(msg.save.savingNotSupported)
    });

    const duplicateCurrent: SaveLoadFunctions["duplicateCurrent"] = useRecoilCallback(({ snapshot, set }) => async () => {
        if (remote) {

            const result = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
                defaultPath: "new.math"
            });

            if (!result.canceled) {
                await save(result.filePath, await getSaveObject());
            }
            return;
        }
        throw new Error(msg.save.savingNotSupported)
    });

    const loadCurrent: SaveLoadFunctions["loadCurrent"] = useRecoilCallback(({ snapshot, set }) => async (loc?: string) => {
        if (remote) {
            const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openFile'],
            });

            if (!result.canceled && result.filePaths.length) {
                const location = loc ?? result.filePaths[0];
                const { data } = await load(location);

                set(_saveLocation, location);
                set(_camera, data.camera);
                set(_lines, data.lines);
            }
            return;
        }
        throw new Error(msg.save.savingNotSupported)
    });

    const resetCurrent: SaveLoadFunctions["resetCurrent"] = useRecoilCallback(({ set }) => () => {
        set(_camera, { x: 0, y: 0 });
        set(_lines, []);
        set(_saveLocation, null);
    });

    React.useEffect(() => {

        setSaveLoad({
            save,
            load,
            loadCurrent,
            saveCurrent,
            duplicateCurrent,
            resetCurrent
        });

    }, [])

    return <></>
}

export default SaveLoad;