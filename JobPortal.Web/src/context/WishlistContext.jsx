import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // ruajmë vetëm jobId-të
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // persist në localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function toggle(jobId) {
    if (!jobId) return;
    setWishlist((prev) => {
      const exists = prev.includes(jobId);
      return exists ? prev.filter((id) => id !== jobId) : [jobId, ...prev];
    });
  }

  function remove(jobId) {
    if (!jobId) return;
    setWishlist((prev) => prev.filter((id) => id !== jobId));
  }

  function clear() {
    setWishlist([]);
  }

  // për faqe si Wishlist.jsx (që do detaje), mund të mbash items si ID-të për momentin
  const value = useMemo(
    () => ({
      wishlist,      // array ids
      items: wishlist.map((jobId) => ({ jobId })), // fallback i thjeshtë
      toggle,
      remove,
      clear,
    }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
