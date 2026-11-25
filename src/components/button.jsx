import { Link } from "react-router-dom";
import Icon from "./Icon";

const variants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-sm",
  secondary: "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50",
  danger: "bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50",
  ghost: "text-slate-600 hover:bg-slate-100",
};
const sizes = { md: "px-4 py-2 text-sm", sm: "px-3 py-1.5 text-xs" };

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const build = (variant, size, className) =>
  `${base} ${variants[variant]} ${sizes[size]} ${className}`;

// Reusable button: one style for the whole site.
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  type = "button",
  children,
  ...props
}) {
  return (
    <button type={type} className={build(variant, size, className)} {...props}>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function ButtonLink({ to, variant = "primary", size = "md", icon, className = "", children }) {
  return (
    <Link to={to} className={build(variant, size, className)}>
      {children}
      {icon && <Icon name={icon} className="h-4 w-4" />}
    </Link>
  );
}