export interface PublicStatsOverview {
  total_upcoming_events: number;
  total_tickets_sold: number;
  total_organizers: number;
  total_attendees_checked_in: number;
  total_events_published: number;
  active_events_now: number;
}

export interface PublicStatsRevenue {
  total_revenue: string;
  currency: string;
}

export interface MostPopularEvent {
  id: number;
  slug: string;
  title: string;
  tickets_sold: number;
  category: string | null;
}

export interface PublicStatsHighlights {
  most_popular_event: MostPopularEvent | null;
  events_this_month: number;
  new_organizers_this_month: number;
}

export interface PublicStats {
  data: {
    overview: PublicStatsOverview;
    revenue: PublicStatsRevenue;
    highlights: PublicStatsHighlights;
    last_updated: string;
  };
}

export interface CurrentUser {
    id: number;
    username: string;
    email: string;
    full_name: string;
    phone_number: string | null;
    profile_image: string | null;
    bio: string | null;
    city: string | null;
    country: string | null;
    is_email_verified: boolean;
    date_joined: string;
    last_login: string | null;
    is_organizer: boolean;

    settings: {
        marketing_emails: boolean;
        event_reminders: boolean;
        email_notifications: boolean;
        sms_notifications: boolean;
    };

    stats: {
        total_tickets_purchased: number;
        total_events_attended: number;
        events_organized: number;
        total_spent: number;
        account_age_days: number;
    };
}