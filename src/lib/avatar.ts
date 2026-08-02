export function generateProfileColor(email: string | undefined | null): string {
  if (!email) return "#9CA3AF"; // Default gray

  // A palette of aesthetic, modern colors (Tailwind colors)
  const colors = [
    "#F87171", // red-400
    "#FBBF24", // amber-400
    "#34D399", // emerald-400
    "#60A5FA", // blue-400
    "#A78BFA", // violet-400
    "#F472B6", // pink-400
    "#38BDF8", // sky-400
    "#4ADE80", // green-400
    "#FB923C", // orange-400
    "#818CF8", // indigo-400
  ];
  
  // Create a simple deterministic hash of the email string
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Pick a color based on the hash
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
