export type Link = { text: string; to: string; icon: string };
export type Divider = { divider: true };
export type NavItem = Link | Divider;

export const navItems: NavItem[] = [
  {
    text: "My Characters",
    to: "/characters",
    icon: "account-search"
  },
  {
    text: "Games & Tools",
    to: "/games",
    icon: "dice-d20"
  },
  {
    divider: true
  },
  {
    text: "LARP Rules",
    to: "/books/core-rules",
    icon: "feather"
  },
  {
    text: "Domains",
    to: "/books/domains",
    icon: "layers-triple-outline"
  },
  {
    text: "Downtime Periods",
    to: "/books/downtime-periods",
    icon: "briefcase-clock-outline"
  },
  {
    divider: true
  },
  {
    text: "Settings",
    to: "/settings",
    icon: "settings"
  },
  {
    text: "About",
    to: "/about",
    icon: "information-outline"
  }
];
