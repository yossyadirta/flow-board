export const BOARD_ICONS_MAP = {
  briefcase: {
    emoji: "💼",
    bg: "#3B82F64D",
  },
  checklist: {
    emoji: "🧾",
    bg: "#10B9814D",
  },
  target: {
    emoji: "🎯",
    bg: "#F59E0B4D",
  },
  rocket: {
    emoji: "🚀",
    bg: "#8B5CF64D",
  },
  calendar: {
    emoji: "📅",
    bg: "#0EA5E94D",
  },
  pin: {
    emoji: "📌",
    bg: "#EF44444D",
  },
  lightbulb: {
    emoji: "💡",
    bg: "#EAB3084D",
  },
  chart: {
    emoji: "📈",
    bg: "#22C55E4D",
  },
  book: {
    emoji: "📚",
    bg: "#6366F14D",
  },
  gear: {
    emoji: "⚙️",
    bg: "#94A3B84D",
  },
  note: {
    emoji: "📝",
    bg: "#FB923C4D",
  },
  inbox: {
    emoji: "📥",
    bg: "#38BDF84D",
  },
  heart: {
    emoji: "❤️",
    bg: "#FB71854D",
  },
  brain: {
    emoji: "🧠",
    bg: "#C084FC4D",
  },
} as const;

export type BoardIconId = keyof typeof BOARD_ICONS_MAP;
