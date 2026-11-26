import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import SectionCard from "../components/SectionCard";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useToggle } from "../hooks/useToggle";
import { useDebounce } from "../hooks/useDebounce";
import { compareDue } from "../utils/Dates";

export default function TasksPage({ tasks, onAdd, onUpdate, onDelete, onToggle }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("due");
  const [editing, setEditing] = useState(null); // the task being edited, or null
  const [showForm, toggleForm, setShowForm] = useToggle(false);
  const [notice, setNotice] = useState("");

  const searchRef = useRef(null);
  const titleRef = useRef(null);

  const debouncedSearch = useDebounce(search, 300);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  useDocumentTitle(`Tasks (${pendingCount} pending) | StudyFlow`);

  useEffect(() => {
    if (showForm || editing) titleRef.current?.focus();
  }, [showForm, editing]);

  // Search + filter + sort work together. This is DERIVED data (computed during render, not in an Effect).
  // useMemo: the list is only recomputed when one of these inputs changes.
  const visible = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return tasks
      .filter((t) => t.title.toLowerCase().includes(term))
      .filter((t) => category === "all" || t.category === category)
      .filter((t) => status === "all" || (status === "done" ? t.completed : !t.completed))
      .sort((a, b) => (sortBy === "due" ? compareDue(a, b) : a.title.localeCompare(b.title)));
  }, [tasks, debouncedSearch, category, status, sortBy]);

  const hasActiveFilters = search !== "" || category !== "all" || status !== "all";
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  const handleAdd = (task) => {
    onAdd(task);
    setNotice("Task added.");
    titleRef.current?.focus();
  };
  const handleEditSave = (changes) => {
    onUpdate(editing.id, changes);
    setEditing(null);
    setNotice("Task updated.");
  };
  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Delete this task?")) {
        onDelete(id);
        setEditing((current) => (current?.id === id ? null : current));
        setNotice("Task deleted.");
      }
    },
    [onDelete]
  );
  const handleHeaderButton = () => {
    setNotice("");
    if (editing) setEditing(null);
    else toggleForm();
  };
  const formOpen = showForm || editing;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Tasks</h1>
          <p className="text-slate-600">
            {pendingCount} pending · {tasks.length} total
          </p>
        </div>
        <Button icon={formOpen ? undefined : "plus"} onClick={handleHeaderButton}>
          {formOpen ? "Close form" : "Add Task"}
        </Button>
      </div>

      {notice && (
        <div role="status" className="flex items-center justify-between rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900">
          {notice}
          <button onClick={() => setNotice("")} className="rounded px-2 text-emerald-900 hover:bg-emerald-200" aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      {formOpen && (
        <SectionCard title={editing ? "Edit task" : "New task"}>
          {/* key makes React create a fresh form when switching between add mode and different tasks */}
          <TaskForm
            key={editing ? editing.id : "new"}
            initialTask={editing ?? undefined}
            onSubmit={editing ? handleEditSave : handleAdd}
            onCancel={editing ? () => setEditing(null) : undefined}
            titleRef={titleRef}
          />
        </SectionCard>
      )}

      <SectionCard>
        <TaskFilters
          search={search} onSearchChange={setSearch} searchRef={searchRef}
          category={category} onCategoryChange={setCategory}
          status={status} onStatusChange={setStatus}
          sortBy={sortBy} onSortChange={setSortBy}
          onClear={clearFilters} hasActiveFilters={hasActiveFilters}
        />
      </SectionCard>

      {tasks.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No tasks yet"
          message="Your study list is empty. Add your first task to get started."
        >
          <Button icon="plus" onClick={() => setShowForm(true)}>Add your first task</Button>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState
          icon="search"
          title="No matching tasks"
          message="Nothing matches your current search and filters. Try different keywords or clear the filters."
        >
          <Button variant="secondary" onClick={clearFilters}>Clear search &amp; filters</Button>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {visible.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}