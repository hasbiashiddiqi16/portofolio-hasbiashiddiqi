import { useEffect, useState } from "react";

/** Returns the current location hash and updates on change (used for #/admin routing). */
export function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return hash;
}
