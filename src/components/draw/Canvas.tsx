import * as React from "react";
import { useRecoilValue } from "recoil";
import { rectangle } from "../../functions/rectangle/rectangle";
import useResize from "../../hooks/useResize";
import { _camera } from "../../state/camera";
import { _darkTheme } from "../../state/design";
import { _showBoundingBox } from "../../state/dev";
import { _currentShape, _shapes } from "../../state/shapes";
import { Circle, CircleShape, Path, PathShape, RectangleShape } from "../../types/types";


function Canvas() {

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [windowWidth, windowHeight] = useResize();
    const camera = useRecoilValue(_camera);
    const currentShape = useRecoilValue(_currentShape);
    const shapes = useRecoilValue(_shapes);
    const showBoundingBox = useRecoilValue(_showBoundingBox);
    const darkTheme = useRecoilValue(_darkTheme);

    // Draw function to draw the canvas
    const draw = (ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);

        if (darkTheme) {
            ctx.fillStyle = "#555";
        } else {
            ctx.fillStyle = "#ffffff";
        }

        ctx.fill();


        // Start by drawing the grid lines in the background
        const gridSize = 40; // The size of a grid tile
        if (darkTheme) {
            ctx.strokeStyle = "#ccc4";
        } else {
            ctx.strokeStyle = "#4444";
        }

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

        // Draw every path
        const drawPath = (path: PathShape) => {
            if (path.positions.length) {
                ctx.beginPath();
                ctx.moveTo(
                    path.positions[0].x + camera.x,
                    path.positions[0].y + camera.y,
                );
                for (const position of path.positions) {
                    ctx.lineTo(
                        position.x + camera.x,
                        position.y + camera.y,
                    );
                }

                ctx.lineWidth = 2;
                ctx.strokeStyle = path.meta.color;
                ctx.stroke();
            }
        }

        // Draw every path
        const drawCircle = (circle: CircleShape) => {
            ctx.beginPath();
            ctx.arc(circle.origin.x + camera.x, circle.origin.y + camera.y, circle.radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = circle.meta.color;
            ctx.stroke();
        }

        const drawRectangle = (rectangle: RectangleShape) => {
            ctx.beginPath();
            ctx.rect(
                rectangle.boundingBox.left + camera.x,
                rectangle.boundingBox.top + camera.y,
                rectangle.boundingBox.right - rectangle.boundingBox.left,
                rectangle.boundingBox.bottom - rectangle.boundingBox.top,
            );
            ctx.lineWidth = 2;
            ctx.strokeStyle = rectangle.meta.color;
            ctx.stroke();
        }

        for (const shape of [...shapes, currentShape]) {
            if (!shape) {
                continue;
            }

            if (showBoundingBox) {
                drawRectangle({
                    type: "rectangle",
                    meta: {
                        color: "#ff0000"
                    },
                    boundingBox: shape.boundingBox,
                    ...shape.boundingBox
                });
            }

            const inside = rectangle({
                top: 0,
                left: 0,
                right: canvas.width,
                bottom: canvas.height
            }).rectangle.isInside(shape.boundingBox, camera);

            if (!inside) {
                continue;
            }

            switch (shape.type) {
                case "path": {
                    drawPath(shape);
                    break;
                }
                case "circle": {
                    drawCircle(shape);
                    break;
                }
                case "rectangle": {
                    drawRectangle(shape);
                    break;
                }
            }
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
        shapes,
        currentShape,
        showBoundingBox,
        darkTheme
    ]);


    return <>
        <canvas ref={canvasRef}></canvas>
    </>

}

export default Canvas;