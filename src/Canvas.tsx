import * as React from "react";
import { useRecoilValue } from "recoil";
import { _electronManager } from "./ElectronManager";
import useResize from "./hooks/useResize";
import { _camera } from "./state/camera";
import { _lines, _currentLine } from "./state/lines";
import { _mode } from "./state/mode";
import { _mouse, _oldMouse } from "./state/mouse";
import { Line } from "./types";
import { rect } from "./utils";


function Canvas() {

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [windowWidth, windowHeight] = useResize();
    const camera = useRecoilValue(_camera);
    const currentLine = useRecoilValue(_currentLine);
    const allLines = useRecoilValue(_lines);
    const mode = useRecoilValue(_mode);

    // Draw function to draw the canvas
    const draw = (ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        // Start by drawing the grid lines in the background
        const gridSize = 40; // The size of a grid tile
        ctx.strokeStyle = "#4444";

        const gridOffset = {
            x: camera.x % gridSize,
            y: camera.y % gridSize
        }

        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width + gridSize; i += gridSize) {
            ctx.beginPath()
            ctx.moveTo(i + gridOffset.x, 0);
            ctx.lineTo(i + gridOffset.x, canvas.height);
            ctx.stroke();
        }

        for (let i = 0; i < canvas.height + gridSize; i += gridSize) {
            ctx.beginPath()
            ctx.moveTo(0, i + gridOffset.y);
            ctx.lineTo(canvas.width, i + gridOffset.y);
            ctx.stroke();
        }

        const drawLine = (line: Line) => {
            const inside = rect({
                top: 0,
                left: 0,
                right: canvas.width,
                bottom: canvas.height
            }).rect.isInside(line.boundingBox, camera);

            if(!inside) {
                return;
            }

            if (line.positions.length) {
                ctx.beginPath();
                ctx.moveTo(
                    line.positions[0].x + camera.x,
                    line.positions[0].y + camera.y,
                );
                for (const position of line.positions) {
                    ctx.lineTo(
                        position.x + camera.x,
                        position.y + camera.y,
                    );
                }

                ctx.lineWidth = 2;
                ctx.strokeStyle = "#111";
                ctx.stroke();
            }
        }

        if (currentLine) {
            drawLine(currentLine);
        }

        for (const line of allLines) {
            drawLine(line);
        }


    }


    // Get the context from the canvas ref
    React.useEffect(() => {
        const canvas = canvasRef.current;


        if (canvas) {
            if (canvas.height !== windowHeight || canvas.width !== windowWidth) {
                canvas.height = windowHeight;
                canvas.width = windowWidth;
            }
            const context = canvas.getContext('2d')

            if (context) {
                draw(context);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        windowWidth,
        windowWidth,
        camera,
        currentLine,
        allLines
    ]);


    return <>
        <canvas ref={canvasRef}></canvas>
    </>

}

export default Canvas;