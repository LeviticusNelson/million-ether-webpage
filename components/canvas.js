import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const Canvas = dynamic({
	loader: async () => {
		const rust = await import("rust-wasm");
		const PIXEL_SIZE = 15; //px
    const WIDTH = 50;
    const HEIGHT = 50;
    let image = rust.Image.new(WIDTH, HEIGHT);

		return (props) => {
			const canvasRef = useRef(null);

			const drawPixels = (ctx) => {
				ctx.strokeStyle = "black";
				ctx.lineWidth = 1;

				const width = image.width();
				const height = image.height();

        let pixels = image.pixels();
				for (let x = 0; x < width; x++) {
					for (let y = 0; y < height; y++) {
						const index = (y * width + x) * 3;
						const color = `rgb(${pixels[index + 0]}, ${pixels[index + 1]}, ${
							pixels[index + 2]
						})`;
						ctx.fillStyle = color;
						ctx.fillRect(
							x * PIXEL_SIZE,
							y * PIXEL_SIZE,
							PIXEL_SIZE,
							PIXEL_SIZE
						);
					}
				}

				ctx.beginPath();
				for (let x = 0; x <= width; x++) {
					ctx.moveTo(x * PIXEL_SIZE + 0.5, 0);
					ctx.lineTo(x * PIXEL_SIZE + 0.5, height * PIXEL_SIZE);
				}

				for (let y = 0; y <= height; y++) {
					ctx.moveTo(0, y * PIXEL_SIZE + 0.5);
					ctx.lineTo(width * PIXEL_SIZE, y * PIXEL_SIZE + 0.5);
				}
				ctx.stroke();
			};

      const eventClickHandler = (event) => {
        const canvas = canvasRef.current;
				const context = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

					let x = event.clientX - rect.left;
					let y = event.clientY - rect.top;

					x = Math.floor(x / PIXEL_SIZE);
					y = Math.floor(y / PIXEL_SIZE);

          let newColor = props.rgb;
          newColor = [newColor.r, newColor.g, newColor.b];

					image.paint(x, y, newColor);
					drawPixels(context);
          console.log(image.pixels());
      }

			useEffect(() => {
				const canvas = canvasRef.current;
				const context = canvas.getContext("2d");

        drawPixels(context);
			}, [drawPixels]);

			return (
				<div className='absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
					<canvas
						ref={canvasRef}
						width={WIDTH * PIXEL_SIZE + 1}
						height={HEIGHT * PIXEL_SIZE + 1}
            onClick={eventClickHandler}></canvas>
				</div>
			);
		};
	},
});

export default Canvas;
