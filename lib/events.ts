import {
  Event,
  EventDetails,
  EventFilters,
  PaginatedEventsResponse,
} from "@/types";
import { AttendedEventsResponse, EventCategory, MyEventsResponse } from "@/types/dash-events.types";
import client from "./client";

export async function getEvents(
  filters: EventFilters = {}
): Promise<PaginatedEventsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.city) params.append("city", filters.city);
    if (filters.status) params.append("status", filters.status);
    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);
    if (filters.price_min) params.append("price_min", String(filters.price_min));
    if (filters.price_max) params.append("price_max", String(filters.price_max));
    if (filters.ordering) params.append("ordering", filters.ordering);
    if (filters.page) params.append("page", String(filters.page));

    const response = await client.get(`/events/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetails | null> {
  try {
    const response = await client.get(`/events/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getEventCategories(): Promise<EventCategory[]> {
  try {
    const response = await client.get("/event-categories/");
    return response.data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function searchEvents(query: string): Promise<Event[]> {
  try {
    const response = await getEvents({ search: query, status: "upcoming" });
    return response.results;
  } catch (error) {
    console.error("Error searching events:", error);
    return [];
  }
}

// My Events API
interface MyEventsFilters {
  status?: string;
  is_published?: string;
  category?: string;
  search?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

export async function getMyEvents(filters: MyEventsFilters = {}): Promise<MyEventsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.is_published && filters.is_published !== "true") params.append("is_published", filters.is_published);
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.sort_by && filters.sort_by !== "-start_date") params.append("sort_by", filters.sort_by);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.page_size) params.append("page_size", String(filters.page_size));

    const response = await client.get(`/events/my-events/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my events:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      summary: {
        total_events: 0,
        upcoming_events: 0,
        ongoing_events: 0,
        past_events: 0,
        total_revenue: "0.00",
        total_tickets_sold: 0,
      },
      results: [],
    };
  }
}

export async function deleteMyEvent(slug: string): Promise<{ success: boolean; message?: string }> {
  try {
    await client.delete(`/dashboard/events/${slug}/delete/`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || "Failed to delete event",
    };
  }
}

// Attended Events API
export async function getMyAttendedEvents(
  page: number = 1,
  pageSize: number = 10
): Promise<AttendedEventsResponse> {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("page_size", String(pageSize));

    const response = await client.get(`/tickets/attended-events/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attended events:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}