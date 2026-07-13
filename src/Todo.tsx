import { useState } from "react";

export interface Task {
  task: string;
  createdAt: number;
  completed: boolean;
}

export const Todo = (props: { initialChecklist: Task[] }) => {
  const [checklist, setChecklist] = useState<Task[]>(props.initialChecklist);
  const [newTask, setNewTask] = useState<string>("");

  const toggleTaskCheck = (taskIndex: number) => {
    setChecklist((prevState) =>
      prevState.map((task: Task, index: number) =>
        index === taskIndex ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const onAddTask = () => {
    if (!newTask) {
      return;
    }
    setChecklist((prevState) =>
      prevState.concat({
        task: newTask,
        createdAt: Date.now(),
        completed: false,
      }),
    );
    setNewTask("");
  };

  return (
    <div className="p-1">
      <h1 className="italic underline">ToDo...</h1>
      <div className="py-1" />

      <ul className="grid gap-1">
        {checklist.map((todo: Task, idx: number) => (
          <li key={`${todo.createdAt}-${idx}`} className="flex text-sm">
            <input
              type="checkbox"
              className="appearance-none border w-5 h-5 mr-1 rounded-none checked:bg-orange-400"
              onChange={() => toggleTaskCheck(idx)}
              checked={todo.completed}
            />
            <p>{todo.task}</p>
          </li>
        ))}
      </ul>

      <div className="flex inline-grid gap-2">
        <input
          type="text"
          className="border-b focus:outline-none"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onAddTask() : null)}
        />
        <button
          className="text-sm outline hover:bg-orange-100 active:bg-orange-300"
          onClick={onAddTask}
        >
          add
        </button>
      </div>
    </div>
  );
};
