export interface Event {
    id: number;
    title: string;
    slug: string;
    organizer: {
        id: number;
        username: string;
        full_name: string;
        profile_image: string;
    };
    category: {
        id: number;
        name: string;
        slug: string;
        icon: string;
    };
    short_description: string;
    featured_image: string;
    venue_name: string;
    venue_city: string;
    venue_country: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    tickets_sold: number;
    tickets_available: number;
    total_tickets: number;
    lowest_price: string;
    highest_price: string;
    status: "upcoming" | "ongoing" | "past";
    is_recurring: boolean;
    created_at: string;
}

// Pagination Response from Backend
export interface PaginatedEventsResponse {
    count: number; // Total number of events
    next: string | null; // URL to next page
    previous: string | null; // URL to previous page
    page_size?: number; // Items per page
    total_pages?: number; // Total number of pages
    current_page?: number; // Current page number
    filters_applied?: {
        category?: string | null;
        search?: string | null;
        city?: string | null;
        status?: string | null;
    };
    results: Event[]; // Array of events
}

// Filter Options for API
export interface EventFilters {
    search?: string;
    category?: string;
    city?: string;
    status?: 'upcoming' | 'ongoing' | 'past' | 'all';
    date_from?: string;
    date_to?: string;
    price_min?: string;
    price_max?: string;
    ordering?: string;
    page?: number;
}

export type CheckInPolicy = "single_entry" | "multi_entry" | "daily_entry";

export interface Organizer {
    id: number;
    username: string;
    email: string;
    full_name: string;
    profile_image: string | null;
    bio: string;
    events_organized: number;
    total_tickets_sold: number;
    member_since: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
}

export interface Venue {
    name: string;
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    google_maps_url: string;
}

export interface TicketType {
    id: number;
    name: string;
    description: string;
    price: string;
    quantity: number;
    tickets_sold: number;
    tickets_remaining: number;
    min_purchase: number;
    max_purchase: number;
    available_from: string;
    available_until: string;
    is_available: boolean;
    sold_out_at?: string;
}

export interface SimilarEvent {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
    start_date: string;
    venue_city: string;
    lowest_price: string;
}

export interface ShareUrls {
    facebook: string;
    twitter: string;
    whatsapp: string;
    email: string;
}

export interface EventDetails {
    id: number;
    title: string;
    slug: string;
    organizer: Organizer;
    category: Category;

    description: string;
    short_description: string;
    featured_image: string;
    additional_images: string[];

    venue: Venue;

    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    timezone: string;

    max_attendees: number;
    tickets_sold: number;
    tickets_available: number;
    lowest_price: number,
    highest_price: number,


    status: "upcoming" | "ongoing" | "past";

    is_recurring: boolean;
    recurrence_info: RecurrenceInfo | null;

    check_in_policy: CheckInPolicy;

    is_published: boolean;
    created_at: string;
    updated_at: string;

    ticket_types: TicketType[];

    similar_events: SimilarEvent[];
    share_urls: ShareUrls;
}

export interface RecurrenceInfo {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    end_date: string;
    total_occurrences: number;
}

export interface RecurringEventDetails extends Omit<EventDetails, "is_recurring" | "recurrence_info"> {
    is_recurring: true;
    recurrence_info: RecurrenceInfo;
}

