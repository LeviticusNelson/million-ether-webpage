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

			let newColor = props.rgb;
			newColor = [newColor.r, newColor.g, newColor.b];

			const paintPixel = (event) => {
				const canvas = canvasRef.current;
				const context = canvas.getContext("2d");
				const rect = canvas.getBoundingClientRect();

				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;
				if (x <= 2 || x >= rect.width - 2 || y <= 2 || y >= rect.height - 2) return;
				x = Math.floor(x / PIXEL_SIZE);
				y = Math.floor(y / PIXEL_SIZE);

				let pixel = image.get_pixel(x, y);
				if (pixel.r() == newColor[0] && pixel.g() == newColor[1] && pixel.b() == newColor[2]) return;

				image.paint(x, y, newColor);
				drawPixels(context);
				pixel = image.get_pixel(x,y);
				console.log(pixel.encode());
			};

			let dragging = false;
			const eventMouseDownHandler = (event) => {
				dragging = true;
			};
			const eventMouseUpHandler = (event) => {
				dragging = false;
			};
			const eventMouseMoveHandler = (event) => {
				if (!dragging) return;
				paintPixel(event);
			};
			const eventClickHandler = (event) => {
				paintPixel(event);
			};

			useEffect(() => {
				const canvas = canvasRef.current;
				const context = canvas.getContext("2d");

				drawPixels(context);
			}, [drawPixels]);

			return (
				<div className='absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
					<canvas
						className="cursor-pointer"
						ref={canvasRef}
						width={WIDTH * PIXEL_SIZE + 1}
						height={HEIGHT * PIXEL_SIZE + 1}
						onClick={eventClickHandler}
						onMouseDown={eventMouseDownHandler}
						onMouseUp={eventMouseUpHandler}
						onMouseMove={eventMouseMoveHandler}
						onMouseLeave={eventMouseUpHandler}
						></canvas>
				</div>
			);
		};
	},
});

export default Canvas;
