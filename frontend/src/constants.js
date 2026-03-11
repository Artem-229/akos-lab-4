export const TAGS = [
  { label: "Семья",  color: "#fca5a5", bg: "#fff1f2" },
  { label: "Работа", color: "#93c5fd", bg: "#eff6ff" },
  { label: "Друзья", color: "#86efac", bg: "#f0fdf4" },
  { label: "Другое", color: "#d8b4fe", bg: "#faf5ff" },
];

const AVATAR_COLORS = [
  ["#fde68a", "#92400e"], ["#a5f3fc", "#164e63"],
  ["#bbf7d0", "#14532d"], ["#fca5a5", "#7f1d1d"],
  ["#c4b5fd", "#4c1d95"], ["#fbcfe8", "#831843"],
  ["#fed7aa", "#7c2d12"], ["#bfdbfe", "#1e3a5f"],
];

export function getAvatarColor(name) {
  const index = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(word => word[0]).slice(0, 2).join("").toUpperCase();
}
