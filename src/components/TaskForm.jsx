import { useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";
import SelectField from "./SelectField";
import { categories } from "../data/categories";

const empty = { title: "", category: categories[0], dueDate: "", priority: "medium" };

// Controlled form used for BOTH adding and editing. `titleRef` lets the parent focus the title input.
export default function TaskForm({ initialTask, onSubmit, onCancel, titleRef }) {
  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title,
          category: initialTask.category,
          dueDate: initialTask.dueDate,
          priority: initialTask.priority,
        }
      : empty
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // immutable object update
    if (e.target.name === "title") setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Please enter a task title. It cannot be blank.");
      titleRef?.current?.focus();
      return;
    }
    if (title.length > 80) {
      setError("Title must be 80 characters or fewer.");
      return;
    }
    onSubmit({ ...form, title });
    if (!initialTask) setForm(empty);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <TextInput
        id="task-title"
        name="title"
        label="Task title"
        placeholder="e.g. Finish the Router exercise"
        value={form.title}
        onChange={handleChange}
        error={error}
        ref={titleRef}
        className="sm:col-span-2"
      />
      <SelectField id="task-category" name="category" label="Category" value={form.category} onChange={handleChange}>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </SelectField>
      <TextInput id="task-due" name="dueDate" type="date" label="Due date" value={form.dueDate} onChange={handleChange} />
      <SelectField id="task-priority" name="priority" label="Priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </SelectField>
      <div className="flex items-end gap-2">
        <Button type="submit" icon={initialTask ? "check" : "plus"}>
          {initialTask ? "Save changes" : "Add task"}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}