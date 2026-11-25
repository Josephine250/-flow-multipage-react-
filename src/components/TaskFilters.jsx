import TextInput from "./TextInput";
import SelectField from "./SelectField";
import Button from "./Button";
import { categories } from "../data/categories";

export default function TaskFilters({
  search, onSearchChange, searchRef,
  category, onCategoryChange,
  status, onStatusChange,
  sortBy, onSortChange,
  onClear, hasActiveFilters,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="flex items-end gap-2 sm:col-span-3">
        <TextInput
          id="task-search"
          label="Search tasks"
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          ref={searchRef}
          className="flex-1"
        />
        <Button variant="secondary" icon="search" onClick={() => searchRef.current?.focus()}>
          Focus
        </Button>
      </div>
      <SelectField id="filter-category" label="Category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </SelectField>
      <SelectField id="filter-status" label="Status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="done">Completed</option>
      </SelectField>
      <SelectField id="sort-by" label="Sort by" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="due">Due date</option>
        <option value="az">Title A–Z</option>
      </SelectField>
      {hasActiveFilters && (
        <div className="sm:col-span-3">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear search &amp; filters
          </Button>
        </div>
      )}
    </div>
  );
}