import * as React from "react";
import { atom, useRecoilCallback, useSetRecoilState } from "recoil";
import { _camera } from "../../state/camera";
import { _shapes } from "../../state/shapes";
import { Shapes } from "../../types/types";

export interface UndoObject {
    shapes: Shapes[];
}

export const _undoStackCursor = atom<number>({
    key: "undoCursor",
    default: 0,
});

export const _undoStack = atom<UndoObject[]>({
    default: [],
    key: "undo"
});

interface UndoRedoFunctions {
    pushUndoStack: (optData?: Partial<UndoObject>) => Promise<void>,
    undo: () => Promise<void>,
    redo: () => Promise<void>,
}

export const _undoRedo = atom<null | UndoRedoFunctions>({
    key: "undoRedo",
    default: null
});

const UndoRedo = () => {
    const setUndoRedo = useSetRecoilState(_undoRedo);

    const pushUndoStack: UndoRedoFunctions["pushUndoStack"] = useRecoilCallback(({ snapshot, set }) => async (optData?: Partial<UndoObject>) => {
        const undoStack = await snapshot.getPromise(_undoStack);
        const undoCursor = await snapshot.getPromise(_undoStackCursor);


        const newUndoStack: UndoObject[] = JSON.parse(JSON.stringify(undoStack));

        const data: UndoObject = {
            shapes: optData?.shapes ?? await snapshot.getPromise(_shapes),
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

        set(_undoStack, newUndoStack);

    });

    const undo: UndoRedoFunctions["undo"] = useRecoilCallback(({ snapshot, set }) => async () => {
        const undoCursor = await snapshot.getPromise(_undoStackCursor);
        const undoStack = await snapshot.getPromise(_undoStack);

        let newCursor = undoCursor;

        if (undoCursor < undoStack.length - 1) {
            newCursor++;

            const { shapes } = undoStack[newCursor];

            set(_undoStackCursor, newCursor);
            set(_shapes, shapes);
        }
    });

    const redo: UndoRedoFunctions["redo"] = useRecoilCallback(({ snapshot, set }) => async () => {
        const undoCursor = await snapshot.getPromise(_undoStackCursor);
        const undoStack = await snapshot.getPromise(_undoStack);


        if (undoCursor > 0) {
            const newCursor = undoCursor - 1;



            const { shapes } = undoStack[newCursor];

            set(_undoStackCursor, newCursor);
            set(_shapes, shapes);
        }
    });

    React.useEffect(() => {
        setUndoRedo({
            pushUndoStack,
            undo,
            redo
        });
    }, []);

    return <></>
}

export default UndoRedo;