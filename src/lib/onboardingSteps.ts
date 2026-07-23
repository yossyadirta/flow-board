import { Step } from "react-joyride";

export const ONBOARDING_STEPS: Step[] = [
  {
    target: '[data-onboarding="create-board-btn"]',
    content:
      "Welcome to Flowboard! 🎉 Let's start by creating your first board. Click this button to begin!",
    title: "Create Your First Board",
    skipBeacon: true,
    placement: "bottom",
    blockTargetInteraction: false,
    data: { hideFooter: true },
  },
  {
    target: '[data-onboarding="board-modal"]',
    content:
      "Give your board a name and a short key (e.g. MKT). Pick an icon you like, then hit Create!",
    title: "Fill in Board Details",
    skipBeacon: true,
    placement: "right",
    blockTargetInteraction: false,
    data: { hideFooter: true },
  },
  {
    target: '[data-onboarding="add-task-btn-todo"]',
    content:
      "Great! Your board is ready. Now let's add your first task. Click this button!",
    title: "Add Your First Task",
    skipBeacon: true,
    placement: "top",
    blockTargetInteraction: false,
    data: { hideFooter: true },
  },
  {
    target: '[data-onboarding="task-input"]',
    content:
      'Type a task name and press Enter to create it. Try something like "My first task"!',
    title: "Create a Task",
    skipBeacon: true,
    placement: "top",
    blockTargetInteraction: false,
    data: { hideFooter: true },
  },
  {
    target: '[data-onboarding="col-in-progress"]',
    content:
      "You can drag tasks between columns to update their status.",
    title: "Drag to In Progress",
    skipBeacon: true,
    placement: "top",
    blockTargetInteraction: true,
    data: { hideBack: true },
  },
  {
    target: '[data-onboarding="col-done"]',
    content:
      "When a task is complete, drag it to the Done column. That's it — you've mastered Flowboard! 🎊",
    title: "Move to Done",
    skipBeacon: true,
    placement: "top",
    blockTargetInteraction: true,
    data: { hideBack: true, hideSkip: true },
  },
];
