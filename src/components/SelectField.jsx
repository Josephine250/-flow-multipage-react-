export default function SelectField({ id, label, className = "", children, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}