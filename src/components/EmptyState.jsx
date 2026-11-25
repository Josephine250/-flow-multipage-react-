import Icon from "./Icon";

export default function EmptyState({ icon = "inbox", title, message, children }) {
  return (
    <div className="card rounded-xl border-2 border-dashed border-slate-300 bg-white/60 p-10 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}