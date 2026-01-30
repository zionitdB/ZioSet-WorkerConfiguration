import { Step } from "react-joyride";

export const dashboardTourSteps: Step[] = [
  {
    target: "#dashboard",
    title: "Welcome to Zioset",
    content:
      "This is your Management Console. From here you can monitor agents, scripts, activity, and system health in real time.",
    placement: "center",
    disableBeacon: true,
  },

  /* ===== HEADER CONTROLS ===== */

  {
    target: "#user-profile",
    title: "Your Profile",
    content:
      "Access your profile settings, change your password, and manage your account details from here.",
    placement: "bottom",
  },

  {
    target: "#theme-toggle",
    title: "Theme Settings",
    content:
      "Switch between Light, Dark, or System theme to match your preferred working style.",
    placement: "bottom",
  },

  {
    target: "#notifications",
    title: "Notifications",
    content:
      "View system alerts, warnings, and important updates in real time from here.",
    placement: "bottom",
  },
  {
  target: "#quick-search",
  title: "Quick Search",
  content:
    "Use Quick Search to instantly find modules, users, scripts, or settings across the application without navigating through menus.",
  placement: "bottom",
},

  /* ===== DASHBOARD CONTENT ===== */

  {
    target: "#quick-modules",
    title: "Quick Access Modules",
    content:
      "These cards give you fast access to major modules based on your permissions. Click any module to get started.",
    placement: "bottom",
  },



 

  /* ===== FINISH ===== */

  {
    target: "#dashboard",
    title: "You're All Set 🎉",
    content:
      "That’s a quick overview of your dashboard. You’re now ready to manage your environment efficiently.",
    placement: "center",
  },
];
