import SummaryCard from "../components/SummaryCard";
import SectionCard from "../components/SectionCard";
import Badge from "../components/Badge";
import { ButtonLink } from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { compareDue, formatDate, isOverdue } from "../utils/dates";

const priorityTone = { high: "red", medium: "amber", low: "green" };

export default function DashboardPage({ tasks, name, studyMinutes }) {
  useDocumentTitle("Dashboard | StudyFlow");

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(isOverdue).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const upcoming = tasks.filter((t) => !t.completed).sort(compareDue).slice(0, 4);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-teal-800 p-6 text-white shadow-sm md:p-8">
        <p className="text-sm text-teal-100">{today}</p>
        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Welcome back{name ? `, ${name}` : ""}!</h1>
        <p className="mt-2 max-w-xl text-slate-200">
          {pending === 0
            ? "You have no pending tasks. Great work!"
            : `You have ${pending} pending ${pending === 1 ? "task" : "tasks"}. Pick one and start a focus session.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink to="/tasks" variant="secondary" icon="arrow">View tasks</ButtonLink>
          <ButtonLink to="/focus" variant="ghost" className="text-white hover:bg-white/10">Start focusing</ButtonLink>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total tasks" value={total} icon="list" tone="teal" />
        <SummaryCard label="Pending" value={pending} icon="focus" tone="amber" />
        <SummaryCard label="Completed" value={completed} icon="check" tone="green" />
        <SummaryCard label="Overdue" value={overdue} icon="alert" tone="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title={`Progress: ${progress}%`} className="lg:col-span-2">
          <div
            className="h-4 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Task completion progress"
          >
            <div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {completed} of {total} tasks completed
          </p>
        </SectionCard>

        <SectionCard title="Focus timer">
          <p className="text-4xl font-extrabold text-slate-900">
            {studyMinutes}
            <span className="ml-1 text-base font-medium text-slate-600">min session</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">Your preferred study duration from Settings.</p>
          <ButtonLink to="/focus" className="mt-4" icon="arrow">Open timer</ButtonLink>
        </SectionCard>
      </div>

      <SectionCard
        title="Upcoming tasks"
        action={<ButtonLink to="/tasks" variant="secondary" size="sm" icon="arrow">Go to Tasks</ButtonLink>}
      >
        {upcoming.length === 0 ? (
          <EmptyState icon="check" title="Nothing due" message="All your tasks are complete. Add a new one on the Tasks page." />
        ) : (
          <ul className="divide-y divide-slate-200">
            {upcoming.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-medium text-slate-900">{t.title}</p>
                  <p className="text-sm text-slate-600">
                    {t.category} · {formatDate(t.dueDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isOverdue(t) && <Badge tone="red">Overdue</Badge>}
                  <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}