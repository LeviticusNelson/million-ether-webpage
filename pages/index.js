import dynamic from "next/dynamic";
import {useState, useEffect, useRef} from "react"

const Canvas = dynamic({
  loader: async () => {
    const rust = await import('rust-wasm')
    const PIXEL_SIZE = 15; //px
    
    return ((props) => {
      const canvasRef = useRef(null)
      const image = rust.Image.new(props.width, props.height)
      
      const drawPixels = ctx => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        const width = image.width();
        const height = image.height();
        
        const pixels = image.pixels();
        for (let x=0; x < width; x++) {
          for (let y=0; y < height; y++) {
            const index = ((y * width) + x) * 3;
            const color = `rgb(${pixels[index + 1]}, ${pixels[index + 2]}, ${pixels[index + 3]})`;
            ctx.fillStyle = color;
            ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
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
      }

      useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        drawPixels(context)
        canvas.addEventListener('click', (event) => {
          const rect = canvas.getBoundingClientRect();

          let x = event.clientX - rect.left;
          let y = event.clientY - rect.top;

          x = Math.floor(x / PIXEL_SIZE);
          y = Math.floor(y / PIXEL_SIZE);

          image.paint(x, y, [200,255,200]);
          drawPixels(context)
        })
      }, [drawPixels])
      return (
        <div className='absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center tracking-[-.1rem] text-[15px]'>
          <canvas ref={canvasRef} width={(props.width * PIXEL_SIZE) + 1} height={(props.height * PIXEL_SIZE) + 1}></canvas>
        </div>
      )
    })
  }
})

export default function Home() {
  return (
    <Canvas width={50} height={50}></Canvas>
  )
}
