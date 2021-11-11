/*
    Handles communication with the main electron process
*/
import * as React from "react"
import { useRecoilValue } from "recoil";
import { IS_ELECTRON } from "../../config";
import { _saveLoad } from "./SaveLoad";
import { _undoRedo } from "./UndoRedo";

const electron = IS_ELECTRON ? require("electron") : null;

const MainProcessCommunication = () => {
    const saveLoad = useRecoilValue(_saveLoad);
    const undoRedo = useRecoilValue(_undoRedo);

    // Save and load useEffect
    // Handles every request from the menu
    React.useEffect(() => {

        if (!electron || !saveLoad) {
            return;
        }

        const { ipcRenderer } = electron;

        ipcRenderer.on('new-data', async () => {
            saveLoad.resetCurrent();
        });

        ipcRenderer.on('store-data', () => {
            saveLoad.saveCurrent();
        });

        ipcRenderer.on('duplicate-data', () => {
            saveLoad.duplicateCurrent();
        });

        ipcRenderer.on('load-data', async () => {
            saveLoad.loadCurrent();
        });

        // Open with code to handle opening a file with the program
        const getFile = ((): string | null => {
            try {
                const tmpPath = "/tmp/ampene-openwith";
                const fs = require("fs");
                const fileExists = fs.existsSync(tmpPath);
                if (fileExists) {
                    const data = JSON.parse(fs.readFileSync(tmpPath)).path;
                    fs.unlinkSync(tmpPath);
                    return data;
                }
            } catch (err) {
            }
            return null;
        })();

        if(getFile) {
            saveLoad.loadCurrent(getFile)
        }

    }, [saveLoad]);

    // Undo / Redo functions
    React.useEffect(() => {
        if (!electron || !undoRedo) {
            return;
        }
        const { ipcRenderer } = electron;

        ipcRenderer.on('undo', () => {
            undoRedo.undo();
        });

        ipcRenderer.on('redo', async () => {
            undoRedo.redo();
        });
    }, [undoRedo]);

    return <></>;
}

export default MainProcessCommunication;