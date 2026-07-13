import { useState } from "react";

export const Counter = (props: { initCount: number }) => {
  const [counter, setCounter] = useState<number>(props.initCount);

  return (
    <div>
      <h1 className="text-l underline italic">Counter! </h1>
      <p className="text-xs">currently... {Math.max(counter, 0)}</p>
      <br />
      <button className="outline px-2" onClick={() => setCounter(counter + 1)}>
        Add
      </button>
      <button
        className="outline px-2"
        onClick={() => {
          if (counter > 0) setCounter(counter - 1);
        }}
      >
        Subtract
      </button>
    </div>
  );
};
