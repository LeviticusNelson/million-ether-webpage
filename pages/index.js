import Canvas from '../components/canvas';
import {useEffect, useState} from 'react';
import { RgbColorPicker } from 'react-colorful';

export default function Home() {
  const [color, setColor] = useState({r: 0, g: 0, b: 0})
  function handleChange(value, index) {
    let colorCopy = [...color];
    colorCopy[index] = value;
    setColor(colorCopy);
  }

  return (
    <div className="flex px-10">
      <div className="p-10">
        <RgbColorPicker className="border-4 border-black rounded-xl" color={color} onChange={setColor}></RgbColorPicker>
      </div>
      <Canvas rgb={color}></Canvas>
    </div>
  )
}
