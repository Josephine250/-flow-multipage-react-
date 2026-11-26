import { memo } from "react";
import Badge from "./Badge";
import Button from "./Button";
import Icon from "./Icon";
import { formatDate, isOverdue } from "../utils/Dates";

const priorityTone = { high: "red", medium: "amber", low: "green" };

// memo: skips re-rendering when its props are unchanged (e.g. while typing in the search box,
const TaskCard = memo(function TaskCard({ task, onToggle, onEdit, onDelete }) {
  if (import.meta.env.DEV) console.log("render TaskCard", task.id);
  const overdue = isOverdue(task);

  return (
    <li
      className={`card flex flex-col gap-3 rounded-xl border-white p-4 shadow-sm ring-1 sm:flex-row sm:items-center ${
        overdue ? "ring-red-300" : "ring-slate-200"
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as complete`}
        aria-pressed={task.completed}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.completed
            ? "border-teal-700 bg-teal-700 text-white"
            : "border-slate-400 text-transparent hover:border-teal-700 hover:text-teal-700"
        }`}
      >
        <Icon name="check" className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`truncate font-semibold ${task.completed ? "text-slate-500 line-through" : "text-slate-900"}`}>
          {task.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-slate-600">
            <Icon name="calendar" className="h-3.5 w-3.5" />
            {formatDate(task.dueDate)}
          </span>
          <Badge tone="blue">{task.category}</Badge>
          <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
          <Badge tone={task.completed ? "teal" : "slate"}>{task.completed ? "Completed" : "Pending"}</Badge>
          {overdue && <Badge tone="red">Overdue</Badge>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" icon={task.completed ? "undo" : "check"} onClick={() => onToggle(task.id)}>
          {task.completed ? "Undo" : "Done"}
        </Button>
        <Button variant="secondary" size="sm" icon="edit" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
          Edit
        </Button>
        <Button variant="danger" size="sm" icon="trash" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>
          Delete
        </Button>
      </div>
    </li>
  );
});

export default TaskCard;