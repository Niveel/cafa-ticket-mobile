import { useState, useEffect } from "react";
import { detectUserCountry, getPaystackCode } from "@/utils/countryUtils";

type Bank = {
    name: string;
    code: string;
    country: string;
};

const MOBILE_MONEY_KEYWORDS = [
    "mtn",
    "vodafone",
    "airteltigo",
    "airtel",
    "tigo",
    "mobile money",
    "momo",
];

const isMobileMoneyProvider = (bank: any) => {
    const combined = `${bank?.name || ""} ${bank?.slug || ""} ${bank?.type || ""}`.toLowerCase();
    return MOBILE_MONEY_KEYWORDS.some((keyword) => combined.includes(keyword));
};

const DEFAULT_COUNTRY = "ghana";

const FALLBACK_BANKS: Bank[] = [
    { name: "Absa Bank Ghana Limited", code: "030100", country: "ghana" },
    { name: "Access Bank Ghana Plc", code: "280100", country: "ghana" },
    { name: "GCB Bank Limited", code: "040100", country: "ghana" },
    { name: "Ecobank Ghana Limited", code: "130100", country: "ghana" },
    { name: "Fidelity Bank Ghana Limited", code: "240100", country: "ghana" },
];

export const useBankForm = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoadingBanks, setIsLoadingBanks] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isDetectingCountry, setIsDetectingCountry] = useState(true);

    // Detect user's country on mount
    useEffect(() => {
        const detectCountry = async () => {
            setIsDetectingCountry(true);

            try {
                const detected = await detectUserCountry();
                if (detected?.code) {
                    setSelectedCountry(detected.code);
                } else {
                    setSelectedCountry(DEFAULT_COUNTRY);
                }
            } catch (error) {
                console.error("Country detection error:", error);
                setSelectedCountry(DEFAULT_COUNTRY);
            } finally {
                setIsDetectingCountry(false);
            }
        };

        detectCountry();
    }, []);

    // Fetch banks when country changes
    useEffect(() => {
        if (isDetectingCountry || !selectedCountry) return;

        const fetchBanks = async () => {
            setIsLoadingBanks(true);
            try {
                const country = getPaystackCode(selectedCountry);
                const response = await fetch(
                    `https://api.paystack.co/bank?country=${encodeURIComponent(country)}`,
                    {
                        headers: { Accept: "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Bank fetch failed with status ${response.status}`);
                }

                const payload = await response.json();
                if (payload?.status && Array.isArray(payload?.data)) {
                    const uniqueBanks = new Map<string, Bank>();
                    payload.data.forEach((bank: any) => {
                        if (isMobileMoneyProvider(bank)) return;
                        if (!uniqueBanks.has(bank.code)) {
                            uniqueBanks.set(bank.code, {
                                name: bank.name,
                                code: bank.code,
                                country: bank.country || country,
                            });
                        }
                    });
                    setBanks(Array.from(uniqueBanks.values()));
                } else {
                    setBanks([]);
                }
            } catch {
                console.warn("Failed to fetch banks. Using fallback list.");
                setBanks(FALLBACK_BANKS);
            } finally {
                setIsLoadingBanks(false);
            }
        };

        fetchBanks();
    }, [selectedCountry, isDetectingCountry]);

    const bankOptions = banks.map((bank) => ({
        label: bank.name,
        value: bank.code,
    }));

    const getBankFromCode = (bankCode: string) => {
        return banks.find((b) => b.code === bankCode);
    };

    const handleCountryChange = (newCountry: string) => {
        const normalized = getPaystackCode(newCountry);
        setSelectedCountry(normalized);
    };

    return {
        banks,
        bankOptions,
        isLoadingBanks,
        selectedCountry,
        setSelectedCountry: handleCountryChange,
        isDetectingCountry,
        getBankFromCode,
    };
};
