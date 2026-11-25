import { useState } from "react";
import SectionCard from "../components/SectionCard";
import FocusTimer from "../components/FocusTimer";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const BREAK_MINUTES = 5;

export default function FocusPage({ studyMinutes }) {
  useDocumentTitle("Focus | StudyFlow");
  const [mode, setMode] = useState("study");
  const minutes = mode === "study" ? studyMinutes : BREAK_MINUTES;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Focus</h1>
        <p className="text-slate-600">Work in focused sessions, then take a short break.</p>
      </div>

      <SectionCard className="mx-auto max-w-xl">
        <div className="mb-6 flex justify-center gap-2" role="group" aria-label="Session type">
          {["study", "break"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                mode === m ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {m === "study" ? `Study · ${studyMinutes} min` : `Break · ${BREAK_MINUTES} min`}
            </button>
          ))}
        </div>

            /*so switching Study/Break resets all timer state automatically. */
        <FocusTimer key={mode} mode={mode} minutes={minutes} />
      </SectionCard>
    </div>
  );
}