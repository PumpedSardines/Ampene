import * as React from "react";
import { atom, useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { _electronManager } from "./ElectronManager";
import { _camera } from "./state/camera";
import { _currentLine, _lines } from "./state/lines";
import { _mode } from "./state/mode";
import { _mouse, _oldMouse } from "./state/mouse";
import { Line, Mouse } from "./types";
import { rect } from "./utils";



function Logic() {

    const mouse = useRecoilValue(_mouse);
    const [oldMouse, setOldMouse] = useRecoilState(_oldMouse);
    const [camera, setCamera] = useRecoilState(_camera);
    const mode = useRecoilValue(_mode);
    const [currentLine, setCurrentLine] = useRecoilState(_currentLine);
    const electronManager = useRecoilValue(_electronManager);
    const [lines, setLines] = useRecoilState(_lines);


    const addLine = useRecoilCallback(({ snapshot, set }) => async (line: Line) => {

        const allLines = await snapshot.getPromise(_lines);

        set(_lines, [...allLines, line]);

    });

    React.useEffect(() => {

        if (!electronManager) {
            return;
        }

        if (mouse.down && oldMouse?.down) {

            const changeX = mouse.x - oldMouse.x;
            const changeY = mouse.y - oldMouse.y;

            if (mode === "move") {
                setCamera({
                    x: camera.x + changeX,
                    y: camera.y + changeY,
                });
            } else if (mode === "draw") {
                if (!currentLine) {
                    setCurrentLine({
                        boundingBox: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        },
                        positions: []
                    });
                } else {
                    const position = {
                        x: mouse.x - camera.x,
                        y: mouse.y - camera.y
                    };

                    const boundingBox = (() => {

                        if (currentLine.positions.length === 0) {
                            return {
                                top: position.y,
                                bottom: position.y,
                                left: position.x,
                                right: position.x
                            }
                        }

                        const cbb = currentLine.boundingBox;

                        return {
                            top: Math.min(cbb.top, position.y),
                            bottom: Math.max(cbb.bottom, position.y),
                            left: Math.min(cbb.left, position.x),
                            right: Math.max(cbb.right, position.x),
                        }

                    })();

                    setCurrentLine({
                        boundingBox,
                        positions: [
                            ...currentLine.positions,
                            position
                        ]
                    });
                }
            } else if (mode === "erase") {

                const boxSize = 7;
                const mouseRect = {
                    top: mouse.y - boxSize,
                    bottom: mouse.y + boxSize,
                    left: mouse.x - boxSize,
                    right: mouse.x + boxSize,
                };

                const indexes: number[] = []
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const bb = rect(line.boundingBox, camera);
                    if (bb.rect.overlap(mouseRect)) {
                        console.log("WHOO");
                        for (const position of line.positions) {
                            if (rect(mouseRect).position.isInside(position, camera)) {
                                indexes.push(i);
                                break;
                            }
                        }
                    }
                }

                const newLines = JSON.parse(JSON.stringify(lines));

                for (const index of indexes) {
                    newLines.splice(index, 1);
                }

                if (indexes.length) {
                    setLines(newLines);
                    electronManager.pushUndoStack(newLines);
                }

            }

        } else {
            if (currentLine) {
                addLine(currentLine)
                    .then(v => {
                        setCurrentLine(null);
                        electronManager.pushUndoStack();
                    });
            }
        }

        setOldMouse(mouse);

    }, [mouse]);


    return <></>;

}

export default Logic;