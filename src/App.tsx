import { useState } from "react";
import { Counter } from "./counter";

const App = () => {
  const [counter, setCounter] = useState<number>(0)

  return (
    <div>
      <Counter initCount={1} />
      <Counter initCount={1} />
      <Counter initCount={1} />
    </div>
  )
}

export default App;