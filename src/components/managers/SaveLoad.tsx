import isObject from "is-object";
import * as React from "react";
import { atom, useRecoilCallback, useSetRecoilState } from "recoil";
import { FILE_VERSION, IS_ELECTRON, msg, PROGRAM_IDENTIFIER } from "../../config";
import { _camera } from "../../state/camera";
import { _shapes } from "../../state/shapes";
import { _saveLocation } from "../../state/save";
import { PathShape, Position, Shapes } from "../../types/types";

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
        shapes: Shapes[];
    }
}

interface SaveLoadFunctions {
    save: (location: string, data: SaveObject) => Promise<void>,
    load: (location: string) => Promise<SaveObject>,
    duplicateCurrent: () => Promise<void>,
    saveCurrent: () => Promise<void>,
    loadCurrent: (loc?: string) => Promise<void>,
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
                shapes: await snapshot.getPromise(_shapes),
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
                    val.meta.p === PROGRAM_IDENTIFIER
                );
            }
            

            if (verify(data)) {
                return convertSaveVersion(data);
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
            if(loc) {
                const { data } = await load(loc);

                set(_saveLocation, loc);
                set(_camera, data.camera);
                set(_shapes, data.shapes);
                return;
            }

            const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openFile'],
            });

            if (!result.canceled && result.filePaths.length) {
                const location = result.filePaths[0];
                const { data } = await load(location);

                set(_saveLocation, location);
                set(_camera, data.camera);
                set(_shapes, data.shapes);
            }
            return;
        }
        throw new Error(msg.save.savingNotSupported)
    });

    const resetCurrent: SaveLoadFunctions["resetCurrent"] = useRecoilCallback(({ set }) => () => {
        set(_camera, { x: 0, y: 0 });
        set(_shapes, []);
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

function convertSaveVersion(old: any) {
    
    if(old.meta.v === "0.0.0") {
        const newValue = JSON.parse(JSON.stringify(old));

        const lines = JSON.parse(JSON.stringify(newValue.data.lines));

        delete newValue.data.lines;

        newValue.data.shapes = lines.map((v): PathShape => {

            return {
                type: "path",
                meta: {
                    color: "#333"
                },
                boundingBox: v.boundingBox,
                positions: v.positions
            }

        });
        
        newValue.meta.v = "0.0.1";

        return newValue;
    }

    if(old.meta.v === FILE_VERSION) {
        return old;
    }

    throw new Error("Can't convert");
}

export default SaveLoad;