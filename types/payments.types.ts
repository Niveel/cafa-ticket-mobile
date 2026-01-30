export interface PaymentHistory {
    count: number;
    next: string | null;
    previous: string | null;
    summary: PaymentSummary;
    results: PaymentTransaction[];
}

export interface PaymentSummary {
    total_spent: string;
    total_transactions: number;
    completed_transactions: number;
    pending_transactions: number;
}

export interface PaymentTransaction {
    payment_id: string;
    reference: string;
    amount: string;
    currency: string;
    payment_method: string;
    provider: string;
    status: "completed" | "pending" | "failed";
    created_at: string;
    completed_at: string | null;
    event: PaymentEvent;
    tickets: PaymentTicket[];
    fees: PaymentFee;
}

export interface PaymentEvent {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
    start_date: string;
}

export interface PaymentTicket {
    ticket_id: string;
    ticket_type: string;
    price: string;
}

export interface PaymentFee {
    service_fee: string;
    total_paid: string;
}


// payment details
export interface PaymentDetails {
    payment_id: string;
    reference: string;
    amount: string;
    currency: string;
    payment_method: string;
    card_details?: CardDetails; // optional because not all methods have card info
    provider: string;
    status: "completed" | "pending" | "failed";
    created_at: string;
    completed_at: string | null;
    event: PaymentEventDetails;
    tickets: PaymentTicketDetails[];
    breakdown: PaymentBreakdown;
    billing_info: BillingInfo;
}

/* -------------------- CARD DETAILS -------------------- */

export interface CardDetails {
    brand: string;
    last4: string;
    exp_month: string;
    exp_year: string;
}

/* -------------------- EVENT -------------------- */

export interface PaymentEventDetails {
    id: number;
    title: string;
    slug: string;
    featured_image: string;
    organizer: PaymentEventOrganizer;
    venue_name: string;
    start_date: string;
    start_time: string;
}

export interface PaymentEventOrganizer {
    id: number;
    username: string;
    full_name: string;
}

/* -------------------- TICKETS -------------------- */

export interface PaymentTicketDetails {
    ticket_id: string;
    qr_code: string;
    ticket_type: TicketTypeDetails;
    attendee_name: string;
    status: "active" | "used" | "expired";
}

export interface TicketTypeDetails {
    id: number;
    name: string;
    price: string;
}

/* -------------------- BREAKDOWN -------------------- */

export interface PaymentBreakdown {
    subtotal: string;
    service_fee: string;
    total: string;
}

/* -------------------- BILLING INFO -------------------- */

export interface BillingInfo {
    name: string;
    email: string;
    phone: string;
}


// revenue

export interface RevenueSummary {
    period: string; // "all_time" | "30d" | "7d" etc, depending on what you support

    summary: {
        gross_revenue: string;
        platform_fees: string;
        net_revenue: string;
        total_tickets_sold: number;
        total_events: number;
        average_ticket_price: string;
    };

    payout_status: {
        available_balance: string;
        pending_balance: string;
        total_paid_out: string;
        next_payout_date: string;
    };

    revenue_by_event: RevenueByEvent[];
    revenue_by_month: RevenueByMonth[];
    recent_transactions: RecentTransaction[];
}

export interface RevenueByEvent {
    event_id: number;
    event_title: string;
    gross_revenue: string;
    net_revenue: string;
    platform_fee: string;
    tickets_sold: number;
}

export interface RevenueByMonth {
    month: string; // "YYYY-MM"
    gross_revenue: string;
    net_revenue: string;
    platform_fee: string;
    tickets_sold: number;
}

export interface RecentTransaction {
    date: string; // ISO string
    event_title: string;
    ticket_type: string;
    amount: string;
    platform_fee: string;
    net_amount: string;
}

// payment profiles
export type PaymentMethod = "mobile_money" | "bank_transfer";

export type PaymentProfileStatus = "verified" | "pending" | "failed";

export interface BasePaymentProfile {
    id: string;
    method: PaymentMethod;
    name: string;
    description: string;
    fee_percentage: number;
    status: PaymentProfileStatus;
    is_verified: boolean;
    verified_at: string | null;
    is_default: boolean;
    created_at: string;
}

export interface MobileMoneyAccountDetails {
    mobile_number: string;
    network: string;
    account_name: string;
}

export interface BankTransferAccountDetails {
    account_number: string;
    account_name: string;
    bank_name: string;
    bank_code: string;
}

export interface MobileMoneyPaymentProfile extends BasePaymentProfile {
    method: "mobile_money";
    account_details: MobileMoneyAccountDetails;
}

export interface BankTransferPaymentProfile extends BasePaymentProfile {
    method: "bank_transfer";
    account_details: BankTransferAccountDetails;
}

export type PaymentProfile =
    | MobileMoneyPaymentProfile
    | BankTransferPaymentProfile;

export interface PaymentProfilesResponse {
    count: number;
    results: PaymentProfile[];
}