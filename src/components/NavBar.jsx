import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/tasks", label: "Tasks", icon: "tasks" },
  { to: "/focus", label: "Focus", icon: "focus" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export default function Navbar({ pending = 0 }) {
  return (
    <aside className="bg-slate-900 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
      <div className="hidden items-center gap-3 px-6 py-6 md:flex">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
          <Icon name="book" className="h-6 w-6" />
        </span>
        <div>
          <p className="text-lg font-extrabold leading-tight">StudyFlow</p>
          <p className="text-xs text-slate-300">Plan. Focus. Finish.</p>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-slate-700 bg-slate-900 px-1 py-1.5
                   md:static md:flex-col md:justify-start md:gap-1 md:border-0 md:px-4 md:py-2"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors
               md:flex-none md:flex-row md:gap-3 md:px-4 md:py-2.5 md:text-sm ${
                 isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
               }`
            }
          >
            <Icon name={link.icon} className="h-5 w-5" />
            {link.label}
            {link.to === "/tasks" && pending > 0 && (
              <span className="absolute right-3 top-0.5 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-900 md:static md:ml-auto md:px-2 md:text-xs">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}