import client from "./client";
import * as Sentry from '@sentry/react-native';
import type {
    MyEventDetailsResponse,
    MyEventAnalytics,
    AttendedEventsResponse,
    MyEventsResponse,
    EventAttendees,
} from "@/types/dash-events.types";
import type {
    PaymentProfilesResponse,
    RevenueSummary,
    PaymentHistory,
    PaymentDetails,
} from "@/types/payments.types";
import type { MyTicketsResponse, TicketDetails } from "@/types/tickets.types";
import type { CheckInHistoryItem, CheckInResponse, UserStats } from "@/types/dashboard.types";

// =====================
// User Stats
// =====================

export async function getUserStats() {
    try {
        const response = await client.get("/auth/stats/");
        return response.data as UserStats;
    } catch (error) {
        console.error("getUserStats error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// My Created Events - Details & Analytics
// =====================

export async function getMyCreatedEventDetails(slugOrId: string) {
    try {
        const response = await client.get(`/events/my-events/${slugOrId}/`);
        return response.data as MyEventDetailsResponse;
    } catch (error) {
        console.error("getMyCreatedEventDetails error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function getMyCreatedEventAnalytics(slugOrId: string) {
    try {
        const response = await client.get(`/events/my-events/${slugOrId}/analytics/`);
        return response.data as MyEventAnalytics;
    } catch (error) {
        console.error("getMyCreatedEventAnalytics error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// Payment Profiles
// =====================

export async function getMyPaymentProfiles() {
    try {
        const response = await client.get("/auth/payment-profile/");
        return response.data as PaymentProfilesResponse;
    } catch (error) {
        console.error("getMyPaymentProfiles error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// Revenue
// =====================

export async function getMyRevenueSummary(
    period: "all_time" | "this_month" | "last_month" | "this_year" = "all_time"
) {
    try {
        const response = await client.get(`/organizers/revenue/?period=${period}`);
        return response.data as RevenueSummary;
    } catch (error) {
        console.error("getMyRevenueSummary error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// Payment History
// =====================

export async function getMyPaymentHistory(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
        status?: "completed" | "pending" | "failed" | "all";
        date_from?: string;
        date_to?: string;
    }
) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (filters?.status && filters.status !== "all") {
            params.append("status", filters.status);
        }

        if (filters?.date_from) {
            params.append("date_from", filters.date_from);
        }

        if (filters?.date_to) {
            params.append("date_to", filters.date_to);
        }

        const response = await client.get(`/payments/?${params.toString()}`);
        return response.data as PaymentHistory;
    } catch (error) {
        console.error("getMyPaymentHistory error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function getPaymentDetailsById(id: string) {
    try {
        const response = await client.get(`/payments/${id}/`);
        return response.data as PaymentDetails;
    } catch (error) {
        console.error("getPaymentDetailsById error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// Attended Events
// =====================

export async function getMyAttendedEvents(page: number = 1, pageSize: number = 10) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        const response = await client.get(`/tickets/attended-events/?${params}`);
        return response.data as AttendedEventsResponse;
    } catch (error) {
        console.error("getMyAttendedEvents error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// My Tickets
// =====================

export async function fetchMyTickets(params: {
    status?: string;
    search?: string;
    category?: string;
    page?: number; // ✅ CHANGED FROM string TO number
}) {
    try {
        const searchParams = new URLSearchParams();

        if (params.status && params.status !== "all")
            searchParams.set("status", params.status);
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        // ✅ Convert number to string
        searchParams.set("page", (params.page || 1).toString());
        searchParams.set("page_size", "10");

        const response = await client.get(`/tickets/my-tickets/?${searchParams}`);
        return response.data as MyTicketsResponse;
    } catch (error) {
        console.error("fetchMyTickets error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function getMyTicketDetails(ticketId: string) {
    try {
        const response = await client.get(`/tickets/${ticketId}/`);
        return response.data as TicketDetails;
    } catch (error) {
        console.error("getMyTicketDetails error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// My Created Events - List
// =====================

export async function getMyCreatedEvents(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
        status?: string;
        is_published?: string;
        category?: string;
        search?: string;
        sort_by?: string;
    }
) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (filters?.status && filters.status !== "all") {
            params.set("status", filters.status);
        }
        if (filters?.is_published && filters.is_published !== "true") {
            params.set("is_published", filters.is_published);
        }
        if (filters?.category) {
            params.set("category", filters.category);
        }
        if (filters?.search) {
            params.set("search", filters.search);
        }
        if (filters?.sort_by && filters.sort_by !== "-start_date") {
            params.set("sort_by", filters.sort_by);
        }

        const response = await client.get(`/events/my-events/?${params}`);
        return response.data as MyEventsResponse;
    } catch (error) {
        console.error("getMyCreatedEvents error:", error);
        Sentry.captureException(error);
        return null;
    }
}

// =====================
// Event Attendees
// =====================

export async function getMyEventAttendees(
    eventSlug: string,
    page: number = 1,
    pageSize: number = 20,
    filters?: {
        search?: string;
        ticket_type_id?: string;
        payment_status?: string;
        check_in_status?: string;
        sort_by?: string;
    }
) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (filters?.search) {
            params.set("search", filters.search);
        }
        if (filters?.ticket_type_id) {
            params.set("ticket_type_id", filters.ticket_type_id);
        }
        if (filters?.payment_status && filters.payment_status !== "paid") {
            params.set("payment_status", filters.payment_status);
        }
        if (filters?.check_in_status && filters.check_in_status !== "all") {
            params.set("check_in_status", filters.check_in_status);
        }
        if (filters?.sort_by && filters.sort_by !== "-purchase_date") {
            params.set("sort_by", filters.sort_by);
        }

        const response = await client.get(`/events/${eventSlug}/attendees/?${params}`);
        return response.data as EventAttendees;
    } catch (error) {
        console.error("getMyEventAttendees error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function getCheckInHistory(eventSlug: string) {
    try {
        const response = await client.get(`/events/${eventSlug}/checkin-history/`);
        return response.data as CheckInHistoryItem[];
    } catch (error) {
        console.error("getCheckInHistory error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function checkInEventTicket(eventSlug: string, ticketId: string) {
    try {
        const response = await client.post(`/events/${eventSlug}/checkin/`, {
            ticket_id: ticketId,
        });
        return response.data as CheckInResponse;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data as CheckInResponse;
        }

        console.error("checkInEventTicket error:", error);
        Sentry.captureException(error);
        return {
            success: false,
            error: "Check-in failed",
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again.",
        } as CheckInResponse;
    }
}

export async function updatePaymentProfile(
    profileId: string,
    data: { name: string; description?: string }
) {
    try {
        const response = await client.patch(`/auth/payment-profile/${profileId}/`, data);
        return response.data;
    } catch (error) {
        console.error("updatePaymentProfile error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function createPaymentProfile(data: {
    method: "bank_transfer";
    name: string;
    description?: string;
    account_details: {
        account_number: string;
        account_name: string;
        bank_name: string;
        bank_code: string;
        branch?: string;
    };
}) {
    try {
        const response = await client.post("/auth/payment-profile/", data);
        return response.data;
    } catch (error) {
        console.error("createPaymentProfile error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function getVerificationStatus() {
    try {
        const response = await client.get("/auth/verification/status/");
        return response.data;
    } catch (error) {
        console.error("getVerificationStatus error:", error);
        Sentry.captureException(error);
        return null;
    }
}

export async function uploadIDDocument(idDocumentUri: string) {
    try {
        const formData = new FormData();
        formData.append('id_document', {
            uri: idDocumentUri,
            type: 'image/jpeg',
            name: 'id_document.jpg',
        } as any);

        const response = await client.post("/auth/verification/upload-id/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("uploadIDDocument error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function uploadSelfieImage(selfieUri: string) {
    try {
        const formData = new FormData();
        formData.append('selfie_image', {
            uri: selfieUri,
            type: 'image/jpeg',
            name: 'selfie.jpg',
        } as any);

        const response = await client.post("/auth/verification/upload-selfie/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("uploadSelfieImage error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function retryVerification() {
    try {
        const response = await client.post("/auth/verification/retry/");
        return response.data;
    } catch (error) {
        console.error("retryVerification error:", error);
        Sentry.captureException(error);
        throw error;
    }
}
