import EmptyState from "../components/EmptyState";
import { ButtonLink } from "../components/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Page not found | StudyFlow");
  return (
    <div className="mx-auto max-w-xl pt-8">
      <EmptyState
        icon="alert"
        title="Page not found"
        message="Oops, that page doesn't exist. Let's get you back on track."
      >
        <ButtonLink to="/" icon="arrow">Back to Dashboard</ButtonLink>
      </EmptyState>
    </div>
  );
}