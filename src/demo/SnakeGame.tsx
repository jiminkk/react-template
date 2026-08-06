import { RefObject, useEffect, useRef, useState } from "react"

const BOARD_SIZE = 10

function useStateRef<T>(
  initialValue: T,
): [
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  ref: RefObject<T>,
] {
  const ref = useRef(initialValue)
  const [value, setValue] = useState(initialValue)
  const wrappedSetValue: React.Dispatch<React.SetStateAction<T>> = (
    valueOrUpdateFn,
  ) => {
    if (typeof valueOrUpdateFn === "function") {
      const updateFn = valueOrUpdateFn as (prev: T) => T
      setValue((prev) => {
        const value = updateFn(prev)
        ref.current = value
        return value
      })
    } else {
      ref.current = valueOrUpdateFn
      setValue(valueOrUpdateFn)
    }
  }
  return [value, wrappedSetValue, ref]
}

export default function App() {
  const initPos: number[] = [1, 4] // [col, row]
  const snakePos = useRef<number[][]>([initPos])
  const applePos = useRef<number[][]>([[7, 4]])
  const direction = useRef<"up" | "down" | "left" | "right">("right")
  const intervalId = useRef<number | null>(null)
  const [result, setResult] = useState<
    "playing" | "paused" | "ko" | "complete"
  >("playing")
  const currLevel = useRef<number>(1)
  const [tick, setTick] = useState<number>(0)

  const row = Array.from({ length: BOARD_SIZE }).fill(null) as []
  const matrix = Array.from({ length: BOARD_SIZE }).fill(row) as []

  function levelUp() {
    currLevel.current += 1

    const newApples: number[][] = []
    const newAppleSet = new Set()
    Array.from({ length: currLevel.current }).forEach((v, i) => {
      // todo: make random positions valid, retry if invalid
      while (1) {
        const randomPosX = Math.floor(Math.random() * BOARD_SIZE)
        const randomPosY = Math.floor(Math.random() * BOARD_SIZE)
        if (!newAppleSet.has([randomPosX, randomPosY])) {
          newApples.push([randomPosX, randomPosY])
          break
        }
      }
    })
    applePos.current = newApples
  }

  // move snake position
  function moveSnake() {
    const head = snakePos.current[snakePos.current.length - 1]

    // if snake eats its own self, game over
    for (let i = 0; i < snakePos.current.length - 1; i++) {
      if (
        head[0] === snakePos.current[i][0] &&
        head[1] === snakePos.current[i][1]
      ) {
        setResult("ko")
        clearInterval(intervalId.current ?? undefined)
        return
      }
    }

    // check if first snake cell is in same cell as one of the apples
    for (let i = 0; i < applePos.current.length; i++) {
      if (
        applePos.current[i][0] === head[0] &&
        applePos.current[i][1] === head[1]
      ) {
        applePos.current = applePos.current.filter((_, idx) => idx !== i)
        snakePos.current = [snakePos.current[0], ...snakePos.current]
      }
    }

    if (applePos.current.length < 1) {
      if (currLevel.current === 3) {
        setResult("complete")
        clearInterval(intervalId.current ?? undefined)
        return
      } else {
        levelUp()
      }
    }

    let nextPos: number[]
    switch (direction.current) {
      case "up":
        nextPos = [head[0], head[1] - 1]
        break
      case "down":
        nextPos = [head[0], head[1] + 1]
        break
      case "right":
        nextPos = [head[0] + 1, head[1]]
        break
      case "left":
        nextPos = [head[0] - 1, head[1]]
        break
    }
    // update snakepos current ref with new array of snake positions.
    // current: [[2, 6]] -> new array: [nextPos]
    console.log("snake pos: ", snakePos)
    snakePos.current = [...snakePos.current.slice(1), nextPos]

    if (
      snakePos.current.some(
        (pos: number[]) =>
          pos[0] < 0 ||
          pos[0] >= BOARD_SIZE ||
          pos[1] < 0 ||
          pos[1] >= BOARD_SIZE,
      )
    ) {
      // game over
      setResult("ko")
      clearInterval(intervalId.current ?? undefined)
      return
    }
  }

  function tickCallback() {
    moveSnake()

    setTick((tick) => tick + 1)
  }

  useEffect(() => {
    const interval = setInterval(tickCallback, 500)
    intervalId.current = interval

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          direction.current = "up"
          console.log("Up arrow pressed")
          break
        case "ArrowDown":
          direction.current = "down"
          console.log("Down arrow pressed")
          break
        case "ArrowLeft":
          direction.current = "left"
          console.log("Left arrow pressed")
          break
        case "ArrowRight":
          direction.current = "right"
          console.log("Right arrow pressed")
          break
      }
    })
  }, [])

  function isSnakeGrid(r: number, c: number): boolean {
    // todo: maybe later use set to contain snake positions in string combination
    return snakePos.current.some(
      (pos: number[]) => pos[0] === c && pos[1] === r,
    )
  }

  const renderCell = (r: number, c: number) =>
    applePos.current.some((pos: number[]) => pos[0] === c && pos[1] === r) ? (
      <div className="w-4 h-4 p-4 bg-amber-100 outline-black outline-1" />
    ) : (
      <div className="w-4 h-4 p-4 outline-black outline-1" />
    )

  return (
    <div className="m-4">
      {matrix.map((row: [], r) => (
        <div className="flex">
          {row.map((val, c) =>
            isSnakeGrid(r, c) ? (
              <div className="w-4 h-4 p-4 bg-blue-200 outline-black outline-1" />
            ) : (
              renderCell(r, c)
            ),
          )}
        </div>
      ))}

      {result === "ko" ? <div>game over!!!</div> : null}
      {result === "complete" ? <div>great job! </div> : null}
    </div>
  )
}
