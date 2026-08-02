import { Variants } from "framer-motion";
import {
  SquareKanban,
  List,
  Table2,
  CalendarDays,
  GripVertical,
  Users,
  Moon,
  Compass,
  type LucideIcon,
} from "lucide-react";

export const HERO_HEADLINE = "One unified workspace.\nInfinite flow.";
export const HERO_SUBTITLE =
  "Meet the multiplayer workspace built for speed. Flowboard gives your team four powerful views, synced instantly in the cloud.";

export const DEMO_TASKS = [
  {
    id: "t1",
    key: "FB-1",
    title: "Design system components",
    status: "done" as const,
    dueDate: "Jun 3",
    description: "Build reusable UI primitives",
    cover: { type: "color" as const, value: "#8B5CF6" },
    assignee: { name: "Alice", bg_color: "#F59E0B" },
  },
  {
    id: "t2",
    key: "FB-2",
    title: "Implement drag & drop",
    status: "done" as const,
    dueDate: "Jun 5",
    description: "",
    cover: { type: "color" as const, value: "#10B981" },
    assignee: { name: "Bob", bg_color: "#3B82F6" },
  },
  {
    id: "t3",
    key: "FB-3",
    title: "Setup database schema",
    status: "in-progress" as const,
    dueDate: "Jun 8",
    description: "Implement state hydration from Supabase",
    cover: null,
  },
  {
    id: "t4",
    key: "FB-4",
    title: "Build list view layout",
    status: "in-progress" as const,
    dueDate: "Jun 10",
    description: "",
    cover: { type: "color" as const, value: "#3B82F6" },
    assignee: { name: "Alice", bg_color: "#F59E0B" },
  },
  {
    id: "t5",
    key: "FB-5",
    title: "Add table view with sorting",
    status: "todo" as const,
    dueDate: "Jun 12",
    description: "Use tanstack/react-table",
    cover: null,
  },
  {
    id: "t6",
    key: "FB-6",
    title: "Calendar view integration",
    status: "todo" as const,
    dueDate: "Jun 15",
    description: "",
    cover: { type: "color" as const, value: "#F59E0B" },
    assignee: { name: "Charlie", bg_color: "#EC4899" },
  },
];

export type ViewKey = "kanban" | "list" | "table" | "calendar";

export const VIEW_TABS: { key: ViewKey; icon: LucideIcon; label: string }[] = [
  { key: "kanban", icon: SquareKanban, label: "Kanban" },
  { key: "list", icon: List, label: "List" },
  { key: "table", icon: Table2, label: "Table" },
  { key: "calendar", icon: CalendarDays, label: "Calendar" },
];

export const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description:
      "Move tasks across columns with smooth, physics-based drag and drop. Powered by dnd-kit for a native-feel experience.",
  },
  {
    icon: Users,
    title: "Cloud Synchronized",
    description:
      "All your data is saved instantly to the cloud and synced across all your devices in real-time.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "A meticulously crafted dark theme with oklch-powered color tokens. Every pixel considered, day and night.",
  },
  {
    icon: Compass,
    title: "Guided Onboarding",
    description:
      "New users are greeted with a polished step-by-step tour that highlights every feature without overwhelming.",
  },
];

export const TECH_BADGES = [
  { name: "Next.js 16", icon: "▲" },
  { name: "React 19", icon: "⚛" },
  { name: "TypeScript", icon: "TS" },
  { name: "Tailwind v4", icon: "🎨" },
  { name: "shadcn/ui", icon: "◆" },
  { name: "Framer Motion", icon: "◎" },
];

// --- Animation Variants ---

export const wordVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "done":
      return "Done";
    case "in-progress":
      return "In Progress";
    default:
      return "To Do";
  }
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "done":
      return {
        color: "text-emerald-500",
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20",
        badgeClass: "bg-emerald-700/15 text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
      };
    case "in-progress":
      return {
        color: "text-blue-500",
        bg: "bg-blue-500/5",
        border: "border-blue-500/20",
        badgeClass: "bg-blue-700/15 text-blue-700 dark:text-blue-400",
        dot: "bg-blue-500",
      };
    default:
      return {
        color: "text-slate-400",
        bg: "bg-slate-500/5",
        border: "border-slate-500/20",
        badgeClass: "bg-slate-700/15 text-slate-700 dark:text-slate-300",
        dot: "bg-amber-500",
      };
  }
};
