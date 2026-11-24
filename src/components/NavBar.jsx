// Navbar.jsx
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/focus", label: "Focus" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t bg-white p-2
                 md:static md:justify-start md:gap-2 md:border-b md:border-t-0 md:px-4"
    >
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === "/"}
          className={({ isActive }) =>
            `rounded px-3 py-2 text-sm font-medium focus:outline-2 focus:outline-teal-600 ${
              isActive ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-gray-100"
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}