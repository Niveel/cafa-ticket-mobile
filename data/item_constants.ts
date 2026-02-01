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
        icon: "stats-chart-outline",
        title: "Analytics",
        route: "/dashboard/analytics",
    },
    {
        id: 2,
        icon: "person-outline",
        title: "Profile",
        route: "/dashboard/profile",
    },
    {
        id: 3,
        icon: "calendar-outline",
        title: "My Events",
        route: "/dashboard/events",
    },
    {
        id: 4,
        icon: "ticket-outline",
        title: "My Tickets",
        route: "/dashboard/tickets",
    },
    {
        id: 5,
        icon: "card-outline",
        title: "Payments",
        route: "/dashboard/payments",
    },
    {
        id: 6,
        icon: "scan-outline",
        title: "Check-In",
        route: "/dashboard/check-in",
    },
    {
        id: 7,
        icon: "settings-outline",
        title: "Settings",
        route: "/dashboard/settings",
    },
    {
        id: 8,
        icon: "log-out-outline",
        title: "Logout",
        route: null,
    },
];