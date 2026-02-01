export interface UserStats {
    user_id: number;
    username: string;
    overview: UserOverviewStats;
    purchasing_stats: UserPurchasingStats;
    organizing_stats: UserOrganizingStats;
    recent_activity: RecentActivity[];
}

/* -------------------- OVERVIEW -------------------- */

export interface UserOverviewStats {
    tickets_purchased: number;
    events_organized: number;
    events_attended: number;
    total_spent: string;         // keeping as string since you're using currency as string
    total_revenue: string;
    account_age_days: number;
    account_age_display: string; // optional formatted string like "6 months"
}

/* -------------------- PURCHASING STATS -------------------- */

export interface CategoryPurchaseBreakdown {
    category: string;
    count: number;
    total_spent: string;
}

export interface UserPurchasingStats {
    active_tickets: number;
    used_tickets: number;
    total_spent: string;
    tickets_by_category: CategoryPurchaseBreakdown[];
    upcoming_events: number;
    past_events: number;
}

/* -------------------- ORGANIZING STATS -------------------- */

export interface BestSellingEvent {
    id: number;
    title: string;
    tickets_sold: number;
}

export interface RevenueByMonth {
    month: string;           // "YYYY-MM"
    revenue: string;
    tickets_sold: number;
}

export interface UserOrganizingStats {
    total_events_created: number;
    active_events: number;
    past_events: number;
    total_tickets_sold: number;
    total_revenue: string;
    total_attendees: number;
    average_tickets_per_event: number;
    best_selling_event: BestSellingEvent;
    revenue_by_month: RevenueByMonth[];
}

/* -------------------- RECENT ACTIVITY -------------------- */

export type ActivityType = 
    | "ticket_purchase"
    | "ticket_sale"
    | "event_created";

export interface RecentActivity {
    type: ActivityType;
    event_title: string;
    date: string;               // ISO string
    amount?: string;            // only exists for purchase/sale
}

// -----------check in system

export type CheckInTicketType = {
    id: number;
    name: string;
    price: string;
};

export type CheckInUser = {
    id: number;
    username: string;
    full_name: string;
};

export type CheckInTicketData = {
    ticket_id: string;
    attendee_name: string;
    attendee_email: string;
    ticket_type: CheckInTicketType;
    is_checked_in: boolean;
    checked_in_at: string;
    checked_in_by: CheckInUser;
};

export type CheckInEventStats = {
    total_checked_in: number;
    total_attendees: number;
    check_in_percentage: string;
};

export type CheckInSuccessResponse = {
    success: true;
    message: string;
    ticket: CheckInTicketData;
    event_stats: CheckInEventStats;
};

export type CheckInErrorResponse = {
    success: false;
    error: string;
    message: string;
    ticket?: {
        ticket_id: string;
        attendee_name: string;
        checked_in_at: string;
        checked_in_by: string;
    };
};

export type CheckInResponse = CheckInSuccessResponse | CheckInErrorResponse;

export type CheckInHistoryItem = {
    ticket_id: string;
    attendee_name: string;
    attendee_email: string;
    ticket_type: CheckInTicketType;
    checked_in_at: string;
    checked_in_by: CheckInUser;
};