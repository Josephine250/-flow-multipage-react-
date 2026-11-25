import Icon from "./Icon";

const tones = {
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
};

export default function SummaryCard({ label, value, icon, tone = "teal" }) {
  return (
    <div className="card flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-3xl font-bold leading-tight text-slate-900">{value}</p>
      </div>
    </div>
  );
}