import { CurrentUser } from "./general.types";

export interface UserSettings {
  marketing_emails: boolean;
  event_reminders: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

export interface UserStats {
  total_tickets_purchased: number;
  total_events_attended: number;
  events_organized: number;
  total_spent: number;
  account_age_days: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  full_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: CurrentUser;
}
