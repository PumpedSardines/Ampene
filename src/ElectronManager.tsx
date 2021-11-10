import * as React from "react";
import { atom, useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { _camera } from "./state/camera";
import { Line, Position } from "./types";
import { _lines } from "./state/lines";
import { _saveLocation } from "./state/save";
import { _mode } from "./state/mode";
import { FILE_VERSION } from "./config";

const { dialog, getCurrentWindow } = require('@electron/remote');
const { BrowserWindow } = require('electron')
const ipcRenderer = require('electron').ipcRenderer;
const path = require("path");

const fs = require("fs").promises;

export interface SaveObject {
    v: string,
    camera: Position;
    lines: Line[];
}

export interface UndoObject {
    lines: Line[];
}

export async function save(filepath: string, data: SaveObject) {
    return await fs.writeFile(filepath, JSON.stringify(data));
}

export async function load(filepath: string): Promise<SaveObject> {
    try {
        return JSON.parse(await fs.readFile(filepath, "utf-8"));
    } catch (err) {
        throw new Error("This file seems to be corrupted");
    }
}



export const _electronManager = atom<null | ElectronManager>({
    key: "electronmanager",
    default: null
});

export const _undoStackCursor = atom<number>({
    key: "undoCursor",
    default: 0,
});

export const _undoStack = atom<UndoObject[]>({
    default: [],
    key: "undo"
});

interface ElectronManager {
    getCurrentSave: () => Promise<SaveObject>
    saveIntoCurrent: () => Promise<void>,
    saveFromDialog: () => Promise<void>,
    loadFromDialog: () => Promise<void>,
    pushUndoStack: (optLines?: Line[]) => Promise<void>
    undo: () => Promise<void>,
    redo: () => Promise<void>,
}

function ElectronManager() {
    const setElectronManager = useSetRecoilState(_electronManager);
    const setMode = useSetRecoilState(_mode);

    const pushUndoStack = useRecoilCallback(({ snapshot, set }) => async (optLines?: Line[]) => {
        const undoStack = await snapshot.getPromise(_undoStack);
        const undoCursor = await snapshot.getPromise(_undoStackCursor);


        const newUndoStack: UndoObject[] = JSON.parse(JSON.stringify(undoStack));

        const data = {
            camera: await snapshot.getPromise(_camera),
            lines: optLines ?? await snapshot.getPromise(_lines),
        };

        if (undoCursor === 0) {
            newUndoStack.unshift(data);
        } else {
            newUndoStack.splice(0, undoCursor)
            set(_undoStackCursor, 0);
            newUndoStack.unshift(data);


        }

        if (newUndoStack.length > 32) {
            newUndoStack.splice(newUndoStack.length - 32, 32);
        }

        console.log(newUndoStack, undoCursor);
        set(_undoStack, newUndoStack);

    });

    const reset = useRecoilCallback(({ set }) => () => {
        set(_undoStackCursor, 0);
        set(_undoStack, []);
        set(_saveLocation, null);
        set(_camera, { x: 0, y: 0 });
        set(_lines, []);
    });

    const undo = useRecoilCallback(({ snapshot, set }) => async () => {
        const undoCursor = await snapshot.getPromise(_undoStackCursor);
        const undoStack = await snapshot.getPromise(_undoStack);

        let newCursor = undoCursor;

        if (undoCursor < undoStack.length - 1) {
            newCursor++;

            const { lines } = undoStack[newCursor];

            set(_undoStackCursor, newCursor);
            set(_lines, lines);
        }
    });

    const redo = useRecoilCallback(({ snapshot, set }) => async () => {
        const undoCursor = await snapshot.getPromise(_undoStackCursor);
        const undoStack = await snapshot.getPromise(_undoStack);


        if (undoCursor > 0) {
            const newCursor = undoCursor - 1;



            const { lines } = undoStack[newCursor];

            set(_undoStackCursor, newCursor);
            set(_lines, lines);
        }
    });

    const getCurrentSave = useRecoilCallback(({ snapshot }) => async (): Promise<SaveObject> => {
        return {
            v: FILE_VERSION,
            camera: await snapshot.getPromise(_camera),
            lines: await snapshot.getPromise(_lines),
        }
    });

    const saveIntoCurrent = useRecoilCallback(({ set, snapshot }) => async () => {
        const filepath = await snapshot.getPromise(_saveLocation);

        if (filepath) {
            save(filepath, await getCurrentSave());
        } else {
            saveFromDialog();
        }
    });

    const saveFromDialog = useRecoilCallback(({ set, snapshot }) => async () => {
        const result = await dialog.showSaveDialog(getCurrentWindow(), {
            defaultPath: "new.math"
        });

        if (!result.canceled) {
            save(result.filePath, await getCurrentSave());
            set(_saveLocation, result.filePath);
        }
    });

    const duplicateFromDialog = useRecoilCallback(({ set, snapshot }) => async () => {
        const result = await dialog.showSaveDialog(getCurrentWindow(), {
            defaultPath: "new.math"
        });

        if (!result.canceled) {
            save(result.filePath, await getCurrentSave());
        }
    });

    const loadFromPath = useRecoilCallback(({set}) => async (location: string) => {
        const data = await load(location);

        if (!("v" in data)) {
            throw new Error("This file seems to be corrupted");
        }

        if (FILE_VERSION !== data.v) {
            throw new Error("This file is not supported by this version of the program");
        }

        const { camera, lines } = data;

        set(_saveLocation, location);
        set(_camera, camera);
        set(_lines, lines);

        set(_undoStack, []);
        set(_undoStackCursor, 0);

        await pushUndoStack();
    });

    const loadFromDialog = useRecoilCallback(({ set }) => async () => {
        try {
            const result = await dialog.showOpenDialog(getCurrentWindow(), {
                properties: ['openFile'],
            });

            if (!result.canceled && result.filePaths.length) {
                const location = result.filePaths[0];

                await loadFromPath(location);
            }
        } catch (err) {
            await dialog.showMessageBox(getCurrentWindow(), {
                type: "error",
                message: (err as Error).message
            });
        }
    });

    React.useEffect(() => {
        setElectronManager({
            getCurrentSave,
            saveIntoCurrent,
            saveFromDialog,
            loadFromDialog,
            pushUndoStack,
            undo,
            redo,
        });

    }, []);


    React.useEffect(() => {

        const getFile = ((): string | null => {
            try {
                const tmpPath = "/tmp/inficanvas-openwith";
                const fs = require("fs");
                const fileExists = fs.existsSync(tmpPath);
                if (fileExists) {
                    const data = JSON.parse(fs.readFileSync(tmpPath)).path;
                    //fs.unlinkSync(tmpPath);
                    return data;
                }
            } catch (err) {
                console.error(err);
            }
            return null;
        })();

        if(getFile) {
            loadFromPath(getFile);
        }

        ipcRenderer.on('new-data', async () => {
            reset();
        });

        ipcRenderer.on('store-data', () => {
            saveIntoCurrent();
        });

        ipcRenderer.on('duplicate-data', () => {
            duplicateFromDialog();
        });

        ipcRenderer.on('load-data', async () => {
            loadFromDialog();
        });

        ipcRenderer.on('undo', async () => {
            undo();
        });

        ipcRenderer.on('redo', async () => {
            redo();
        });

        ipcRenderer.on("set-mode", async (event, data) => {
            setMode(data);
        });

    }, []);

    return <></>
}

export default ElectronManager;