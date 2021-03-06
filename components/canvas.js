import dynamic from "next/dynamic";
import { useState, useEffect, useRef} from "react";
import { supabase } from "../utils/supabaseClient";

const Canvas = dynamic(
	{
		loader: async () => {
			const rust = await import("@leviticusnelson/rust-wasm");
			
			const response = await fetch("/api/image");
			const profileData = await supabase.auth.user();
			const data = await response.json();
			let image = await rust.Image.decode(data);
			image.sort_pixels();
			const WIDTH = image.width();
			const HEIGHT = image.height();
			
			return (props) => {
				const zoom = props.zoom;
				let PIXEL_SIZE = 15 + zoom; //px
				const canvasRef = useRef(null);
				const userId = profileData.id;

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

				const paintPixel = async (event) => {
					const canvas = canvasRef.current;
					const context = canvas.getContext("2d");
					const rect = canvas.getBoundingClientRect();

					let x = event.clientX - rect.left;
					let y = event.clientY - rect.top;
					if (x <= 2 || x >= rect.width - 2 || y <= 2 || y >= rect.height - 2)
						return;
					x = Math.floor(x / PIXEL_SIZE);
					y = Math.floor(y / PIXEL_SIZE);

					let pixel = image.get_pixel(x, y);
					if (
						pixel.r() == newColor[0] &&
						pixel.g() == newColor[1] &&
						pixel.b() == newColor[2]
					)
						return;

					image.paint(x, y, newColor);
					drawPixels(context);
					pixel = image.get_pixel(x, y);

					// This should be rewritten in rust
					const { data, error } = await supabase
						.from("Pixels")
						.update({
							r: pixel.r(),
							g: pixel.g(),
							b: pixel.b(),
							last_user: userId,
							is_blank: false,
						})
						.eq("id", pixel.id());
				};

				const eventClickHandler = (event) => {
					if (props.movingCursor) {
						return;
					}
					paintPixel(event);
				};


				useEffect(() => {
					const canvas = canvasRef.current;
					const context = canvas.getContext("2d");

					drawPixels(context);
				}, [drawPixels]);

				useEffect(async () => {
					const handleUpdates = (payload) => {
						const newPixel = payload.new;
						const newColor = [newPixel.r, newPixel.g, newPixel.b];
						image.paint_with_idx(newPixel.id, newColor);
						const canvas = canvasRef.current;
						const context = canvas.getContext("2d");
						drawPixels(context);
					};
					const { data: pixels, error } = await supabase
						.from("Pixels")
						.on("UPDATE", handleUpdates)
						.subscribe();
				}, []);

				return (
					<div className=''>
						<canvas
							className={!props.movingCursor ? "cursor-pointer" : "cursor-move"}
							ref={canvasRef}
							width={WIDTH * PIXEL_SIZE + 1}
							height={HEIGHT * PIXEL_SIZE + 1}
							onClick={eventClickHandler}></canvas>
					</div>
				);
			};
		},
	},
	{ ssr: false }
);

export default Canvas;
