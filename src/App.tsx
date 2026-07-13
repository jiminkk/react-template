import { Counter } from "./Counter";
import { Task, Todo } from "./Todo";

const App = () => {
  const initialTodoList: Task[] = [
    {
      task: "make orange juice",
      createdAt: Date.now(),
      completed: false,
    },
    {
      task: "cut apples",
      createdAt: Date.now(),
      completed: false,
    },
  ];

  return (
    <div>
      <Counter initCount={1} />

      <div className="border-b-2 p-4 mb-4" />

      <Todo initialChecklist={initialTodoList} />
    </div>
  );
};

export default App;
