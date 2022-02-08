import Canvas from '../components/canvas';
import {useEffect, useState} from 'react';

export default function Home() {
  const [color, setColor] = useState({r: 0, g: 0, b: 0});
  return (
    <div>
      <form>
        <label>Red Value</label>
        <input type="text"></input>
      </form>
      <form>
        <label>Green Value</label>
        <input type="text"></input>
      </form>
      <form>
        <label>Blue Value</label>
        <input type="text"></input>
      </form>
      <Canvas width={50} height={50}></Canvas>
    </div>
  )
}
