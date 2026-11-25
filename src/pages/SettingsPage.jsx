import { useState } from "react";
import SectionCard from "../components/SectionCard";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { defaultSettings } from "../data/defaultSettings";

export default function SettingsPage({ settings, onSave }) {
  useDocumentTitle("Settings | StudyFlow");

  const [draft, setDraft] = useState(settings);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraft({ ...draft, [name]: type === "checkbox" ? checked : value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const duration = Number(draft.duration);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) {
      setError("Study duration must be a whole number between 1 and 180 minutes.");
      setSaved(false);
      return;
    }
    setError("");
    onSave({ ...draft, name: draft.name.trim(), duration });
    setSaved(true);
  };

  const handleReset = () => {
    setDraft(defaultSettings);
    onSave(defaultSettings);
    setError("");
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-600">Saved in this browser, so they stay after you refresh.</p>
      </div>

      <SectionCard title="Preferences" className="max-w-xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextInput id="name" name="name" label="Display name" placeholder="e.g. Aline" value={draft.name} onChange={handleChange} />
          <TextInput
            id="duration" name="duration" type="number" label="Preferred study duration (minutes)"
            value={draft.duration} onChange={handleChange} error={error} min="1" max="180"
          />
          <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
            <input
              id="compact" name="compact" type="checkbox" checked={draft.compact} onChange={handleChange}
              className="mt-1 h-4 w-4 accent-teal-700"
            />
            <label htmlFor="compact" className="text-sm">
              <span className="block font-medium text-slate-900">Compact layout</span>
              <span className="text-slate-600">Use tighter spacing and smaller text across the site.</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" icon="check">Save settings</Button>
            <Button variant="secondary" onClick={handleReset}>Reset to defaults</Button>
            {saved && (
              <span role="status" className="text-sm font-medium text-emerald-700">
                Settings saved.
              </span>
            )}
          </div>
        </form>
      </SectionCard>
    </div>
  );
}