// ---------- Shared types ----------

export type TicketStatus = "active" | "used" | "cancelled";
export type EventStatus = "upcoming" | "ongoing" | "past";

// ---------- My Tickets ----------

export interface MyTicketsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: MyTicket[];
}

export interface MyTicket {
    ticket_id: string;
    qr_code: string;

    event: MyTicketEvent;

    ticket_type: MyTicketType;

    attendee_info: TicketAttendeeInfo;

    purchase_date: string;
    payment_reference: string;
    amount_paid: string;

    status: TicketStatus;
    is_checked_in: boolean;
    checked_in_at: string | null;
}

// ---------- Nested ----------

export interface MyTicketEvent {
    id: number;
    title: string;
    slug: string;
    featured_image: string;

    category: {
        id: number;
        name: string;
    };

    venue_name: string;
    venue_city: string;

    start_date: string;
    start_time: string;

    status: EventStatus;
}

export interface MyTicketType {
    id: number;
    name: string;
    price: string;
}

export interface TicketAttendeeInfo {
    name: string;
    email: string;
    phone: string;
}

// ---------- Shared ----------

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "card" | "mobile_money" | "bank_transfer";

export interface EventCategory {
    id: number;
    name: string;
}

export interface VenueLocation {
    latitude: string;
    longitude: string;
}

// ---------- Ticket Details ----------

export interface TicketDetails {
    ticket_id: string;
    qr_code: string;

    event: TicketEventDetails;

    ticket_type: TicketTypeDetails;

    attendee_info: TicketAttendeeInfo;

    purchase_info: TicketPurchaseInfo;

    status: TicketStatus;
    is_checked_in: boolean;
    checked_in_at: string | null;
}

// ---------- Event ----------

export interface TicketEventDetails {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
    description: string;

    category: EventCategory;

    venue_name: string;
    venue_address: string;
    venue_city: string;
    venue_country: string;
    venue_location: VenueLocation;

    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;

    organizer: EventOrganizer;
}

export interface EventOrganizer {
    id: number;
    username: string;
    full_name: string;
    profile_image: string;
}

// ---------- Ticket ----------

export interface TicketTypeDetails {
    id: number;
    name: string;
    description: string;
    price: string;
}

// ---------- Attendee ----------

export interface TicketAttendeeInfo {
    name: string;
    email: string;
    phone: string;
}

// ---------- Purchase ----------

export interface TicketPurchaseInfo {
    purchase_date: string;
    payment_reference: string;
    payment_method: PaymentMethod;
    amount_paid: string;
    currency: string;
    payment_status: PaymentStatus;
}
