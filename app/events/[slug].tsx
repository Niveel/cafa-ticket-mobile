import { ScrollView, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import {
    EventDetailsHero,
    EventDescription,
    TicketsSection,
    TicketPurchaseModal,
    OrganizerSection,
    VenueSection,
    ShareSection,
    SimilarEventsSection,
    EventNotFound,
} from "@/components";
import { getEventBySlug } from "@/lib/events";
import { EventDetails, TicketType } from "@/types";
import { useAuth } from "@/context";
import colors from "@/config/colors";

const EventDetailsScreen = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { user } = useAuth();

    const [event, setEvent] = useState<EventDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            setIsLoading(true);
            const data = await getEventBySlug(slug);
            setEvent(data);
            setIsLoading(false);
        };

        fetchEvent();
    }, [slug]);

    const handleTicketPurchase = (ticket: TicketType, qty: number) => {
        setSelectedTicket(ticket);
        setQuantity(qty);
        setModalVisible(true);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-primary justify-center items-center">
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!event) {
        return <EventNotFound />;
    }

    return (
        <>
            <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
                <EventDetailsHero event={event} />
                <EventDescription event={event} />
                <TicketsSection event={event} currentUser={user} onTicketSelect={handleTicketPurchase} />
                <OrganizerSection event={event} />
                {/* <VenueSection event={event} /> */}
                <ShareSection event={event} />
                <SimilarEventsSection event={event} />
            </ScrollView>

            {selectedTicket && (
                <TicketPurchaseModal
                    visible={modalVisible}
                    ticket={selectedTicket}
                    quantity={quantity}
                    event={event}
                    currentUser={user}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </>
    );
};

export default EventDetailsScreen;