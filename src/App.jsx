import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import FocusPage from "./pages/FocusPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { initialTasks } from "./data/initialTasks";

export default function App() {
  const [tasks, setTasks] = useLocalStorage("studyflow-tasks", initialTasks);

  const addTask = (task) => setTasks((prev) => [...prev, { ...task, id: Date.now(), completed: false }]);
  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<DashboardPage tasks={tasks} />} />
          <Route
            path="/tasks"
            element={
              <TasksPage
                tasks={tasks}
                onAdd={addTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onToggle={toggleTask}
              />
            }
          />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}