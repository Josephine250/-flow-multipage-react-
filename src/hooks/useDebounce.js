import { useState, useEffect } from "react";

// Returns `value` only after it stops changing for `delay` ms.
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cleanup cancels the previous timer on every keystroke
  }, [value, delay]);

  return debounced;
}