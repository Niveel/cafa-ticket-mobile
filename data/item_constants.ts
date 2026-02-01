import type { Ionicons } from "@expo/vector-icons";

export interface DashboardListItem {
    id: number;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    route: string | null;
}

export const dashboardListItems: DashboardListItem[] = [
    {
        id: 1,
        icon: "person-outline",
        title: "Profile",
        route: "/dashboard/profile",
    },
    {
        id: 2,
        icon: "calendar-outline",
        title: "My Events",
        route: "/dashboard/events",
    },
    {
        id: 3,
        icon: "ticket-outline",
        title: "My Tickets",
        route: "/dashboard/tickets",
    },
    {
        id: 4,
        icon: "card-outline",
        title: "Payments",
        route: "/dashboard/payments",
    },
    {
        id: 5,
        icon: "scan-outline",
        title: "Check-In",
        route: "/dashboard/check-in",
    },
    {
        id: 6,
        icon: "settings-outline",
        title: "Settings",
        route: "/dashboard/settings",
    },
    {
        id: 7,
        icon: "log-out-outline",
        title: "Logout",
        route: null,
    },
];