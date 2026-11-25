import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import Icon from "../components/Icon";
// layout that must must be used for all application 
export default function SiteLayout({ compact = false, pending = 0 }) {
  return (
    <div className={`min-h-screen md:flex ${compact ? "compact" : ""}`}>
      <Navbar pending={pending} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-2 bg-slate-900 px-4 py-3 text-white md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
            <Icon name="book" className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold">StudyFlow</span>
        </header>
        <main className={`mx-auto w-full max-w-5xl pb-28 md:pb-10 ${compact ? "p-3 md:p-5" : "p-4 md:p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}