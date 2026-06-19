export function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("fable_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fable_token");
  }
}

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fable_token");
  }
  return null;
}
