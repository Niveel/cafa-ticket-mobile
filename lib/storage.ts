import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from '@sentry/react-native';

const ONBOARDING_COMPLETE_KEY = "@cafa_onboarding_complete";

export const storage = {
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return value === "true";
    } catch {
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      Sentry.captureException(error);
    }
  },

  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      Sentry.captureException(error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      Sentry.captureException(error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      Sentry.captureException(error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      Sentry.captureException(error);
    }
  },
};
