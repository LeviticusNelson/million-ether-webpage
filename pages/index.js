import * as wasm from "rust-wasm";
import React, {useState, useEffect} from "react";


export default function Home() {
  const [buttonPress, setButtonPress] = useState(false);

  useEffect(() => {
    if(buttonPress) {
      wasm.greet("Levi")
    }
    setButtonPress(false);
  }, [buttonPress]);

  return (
    <button onClick={() => setButtonPress(true)} className="text-3xl font-bold underline">
      Hello world!
    </button>
  )
}
