import { useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import FocusPage from "./pages/FocusPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { initialTasks } from "./data/initialTasks";
import { defaultSettings } from "./data/defaultSettings";

export default function App() {
  if (import.meta.env.DEV) console.log("render App");

  // STATE OWNERSHIP: App stays mounted while the route changes, so it owns the state that more than
  // one page needs (tasks -> Dashboard + Tasks + nav badge; settings -> Dashboard, Focus, layout).
  const [tasks, setTasks] = useLocalStorage("studyflow-tasks", initialTasks);
  const [storedSettings, setSettings] = useLocalStorage("studyflow-settings", defaultSettings);
  const settings = { ...defaultSettings, ...storedSettings }; // fills any missing keys

  // Functional updates + spread/map/filter = immutable changes. useCallback keeps the functions
  // stable so memo(TaskCard) is not defeated by new function identities on every render.
  const addTask = useCallback(
    (task) => setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID(), completed: false }]),
    [setTasks]
  );
  const updateTask = useCallback(
    (id, changes) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t))),
    [setTasks]
  );
  const deleteTask = useCallback((id) => setTasks((prev) => prev.filter((t) => t.id !== id)), [setTasks]);
  const toggleTask = useCallback(
    (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [setTasks]
  );

  const pending = tasks.filter((t) => !t.completed).length; // derived, not stored

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout compact={settings.compact} pending={pending} />}>
          <Route path="/" element={<DashboardPage tasks={tasks} name={settings.name} studyMinutes={settings.duration} />} />
          <Route
            path="/tasks"
            element={
              <TasksPage tasks={tasks} onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask} onToggle={toggleTask} />
            }
          />
          <Route path="/focus" element={<FocusPage studyMinutes={settings.duration} />} />
          <Route path="/settings" element={<SettingsPage settings={settings} onSave={setSettings} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}