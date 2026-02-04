import { View, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Screen, AppText, Nav, FormLoader, PaymentHistorySummary, PaymentHistoryFilters, PaymentHistoryList } from "@/components";
import { PaymentHistoryFiltersRef } from "@/components/dashboard/payments/history/PaymentHistoryFilters";
import { getMyPaymentHistory } from "@/lib/dashboard";
import { PaymentHistory } from "@/types/payments.types";
import colors from "@/config/colors";

type FilterValues = {
  status: "all" | "completed" | "pending" | "failed";
  date_from: string;
  date_to: string;
};

const PaymentsHistoryScreen = () => {
  const filtersRef = useRef<PaymentHistoryFiltersRef>(null);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    status: "all",
    date_from: "",
    date_to: "",
  });

  const fetchPayments = useCallback(
    async (page: number, resetData: boolean = false) => {
      if (resetData) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const data = await getMyPaymentHistory(page, 10, {
          status: filters.status,
          date_from: filters.date_from,
          date_to: filters.date_to,
        });

        if (!data) {
          throw new Error("Failed to fetch payment history");
        }

        if (resetData) {
          setPaymentHistory(data);
        } else {
          setPaymentHistory((prev) => {
            if (!prev) return data;
            return {
              ...data,
              results: [...prev.results, ...data.results],
            };
          });
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters]
  );

  // Initial fetch
  useEffect(() => {
    fetchPayments(1, true);
  }, []);

  // Refetch when filters change
  const handleApplyFilters = useCallback(
    (newFilters: FilterValues) => {
      setFilters(newFilters);
      setCurrentPage(1);
      fetchPayments(1, true);
    },
    [fetchPayments]
  );

  // Load more
  const handleLoadMore = useCallback(() => {
    if (paymentHistory?.next && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPayments(nextPage, false);
    }
  }, [paymentHistory, currentPage, isLoadingMore, fetchPayments]);

  const hasActiveFilters =
    filters.status !== "all" || filters.date_from || filters.date_to;

  return (
    <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
      <Nav title="Payment History" />

      {/* Error State */}
      {error && !paymentHistory && (
        <View className="flex-1 items-center justify-center px-4">
          <View className="bg-red-500/10 rounded-xl p-6 border-2 border-red-500/30">
            <AppText styles="text-lg text-red-400 mb-2 text-center font-nunbold">
              Error loading payments
            </AppText>
            <AppText styles="text-sm text-red-300 text-center mb-4">
              {error}
            </AppText>
            <TouchableOpacity
              onPress={() => fetchPayments(1, true)}
              className="px-6 py-3 bg-accent rounded-xl"
              activeOpacity={0.7}
            >
              <AppText styles="text-sm text-white text-center font-nunbold">
                Try Again
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content - Only show when not in error state or has data */}
      {(!error || paymentHistory) && (
        <>
          {/* Header with Filter Button */}
          <View className="px-4 pt-4 pb-3">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <AppText styles="text-2xl text-white mb-1 font-nunbold">
                  Payment History
                </AppText>
                <AppText styles="text-sm text-slate-400">
                  {paymentHistory?.count || 0} transactions
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => filtersRef.current?.open()}
                className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2 ${hasActiveFilters
                    ? "bg-accent border-2 border-accent-50"
                    : "bg-accent/20 border-2 border-accent/30"
                  }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="filter"
                  size={18}
                  color={hasActiveFilters ? colors.white : colors.accent50}
                />
                <AppText
                  styles={`text-sm ${hasActiveFilters ? "text-white" : "text-accent-50"} font-nunbold`}
                >
                  Filter
                </AppText>
                {hasActiveFilters && (
                  <View className="w-5 h-5 rounded-full bg-white items-center justify-center">
                    <AppText styles="text-xs text-accent font-nunbold">
                      {[
                        filters.status !== "all",
                        filters.date_from,
                        filters.date_to,
                      ].filter(Boolean).length}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Cards */}
          {paymentHistory && <PaymentHistorySummary summary={paymentHistory.summary} />}

          {/* Payment List */}
          {paymentHistory && (
            <PaymentHistoryList
              payments={paymentHistory.results}
              isLoading={isLoadingMore}
              hasMore={!!paymentHistory.next}
              onLoadMore={handleLoadMore}
            />
          )}
        </>
      )}

      {/* Filters Bottom Sheet */}
      <PaymentHistoryFilters
        ref={filtersRef}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />

      {/* Loading Overlay */}
      <FormLoader visible={isLoading && !paymentHistory} />
    </Screen>
  );
};

export default PaymentsHistoryScreen;