// SiteLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-slate-900">
      <header className="bg-slate-900 px-4 py-3 text-white">
        <h1 className="text-xl font-bold">StudyFlow</h1>
      </header>
      <Navbar />
      <main className="mx-auto max-w-5xl p-4 pb-24 md:pb-4">
        <Outlet />
      </main>
    </div>
  );
}