"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { bookmarkService } from "@/services";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await bookmarkService.getAll();
      setWishlist(res.data || []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (ebookId) => {
    if (!user) {
      toast.info("Please login to manage wishlist");
      return;
    }
    const isAdded = wishlist.some((item) => (item._id || item) === ebookId);
    try {
      if (isAdded) {
        await bookmarkService.remove(ebookId);
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== ebookId));
        toast.success("Removed from Wishlist");
      } else {
        await bookmarkService.add(ebookId);
        const res = await bookmarkService.getAll();
        setWishlist(res.data || []);
        toast.success("Added to Wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update wishlist");
    }
  }, [user, wishlist]);

  const isWishlisted = useCallback((ebookId) => {
    return wishlist.some((item) => (item._id || item) === ebookId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, loading, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
