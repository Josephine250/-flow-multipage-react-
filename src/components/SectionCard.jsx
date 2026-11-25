// Reusable card shell. Uses `children` for its content.
export default function SectionCard({ title, action, children, className = "" }) {
  return (
    <section className={`card rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}