import { useState } from "react"

export const Counter = (props: {initCount: number}) => {
  const [counter, setCounter] = useState<number>(props.initCount)

  return (
    <div>
      counter: {counter}
      <br />
      <button onClick={() => setCounter(counter + 1)}>Add</button>
    </div>
  )
}