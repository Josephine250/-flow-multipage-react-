const pad = (n) => String(n).padStart(2, "0");

// Today as YYYY-MM-DD in the visitor's local time zone.
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(iso) {
  if (!iso) return "No due date";
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Sort helper: earliest first, tasks without a date go last.
export function compareDue(a, b) {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

export function isOverdue(task) {
  return !task.completed && Boolean(task.dueDate) && task.dueDate < todayISO();
}