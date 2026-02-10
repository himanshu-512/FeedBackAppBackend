export function getBadge(points) {
  if (points >= 400) return { name: "Community Helper", icon: "👑" };
  if (points >= 150) return { name: "Helpful Contributor", icon: "⭐" };
  if (points >= 50) return { name: "Contributor", icon: "🧩" };
  return { name: "New Member", icon: "🌱" };
}