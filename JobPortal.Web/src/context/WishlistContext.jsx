import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // [{ jobId, title, companyName, city }]

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  function toggle(job) {
    setItems(prev => {
      const exists = prev.some(x => x.jobId === job.jobId);
      if (exists) return prev.filter(x => x.jobId !== job.jobId);
      return [job, ...prev];
    });
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo(() => ({ items, toggle, clear }), [items]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
