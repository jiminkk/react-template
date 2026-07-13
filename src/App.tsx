import { useState } from "react";
import { Counter } from "./Counter";

const App = () => {
  return (
    <div>
      <Counter initCount={1} />
    </div>
  )
}

export default App;