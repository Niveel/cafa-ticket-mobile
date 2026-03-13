import { View } from "react-native";
import { useRef, useState, useCallback, useEffect } from "react";
import { router } from "expo-router";

import {
    Screen,
    AppText,
    RequireAuth,
    CreateEventForm,
    Nav,
    AddTicketTypeModal,
    AppBottomSheet,
    ConfirmAction,
} from "@/components";
import type { AppBottomSheetRef } from "@/components";
import type { AddTicketTypeModalRef } from "@/components/dashboard/events/create/AddTicketTypeModal";
import type { TicketTypeFormValues } from "@/data/eventCreationSchema";
import { useAuth } from "@/context";

const CreateEventScreen = () => {
    const modalRef = useRef<AddTicketTypeModalRef>(null);
    const verificationPromptRef = useRef<AppBottomSheetRef>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { user } = useAuth();

    const isOrganizer = user?.is_organizer;

    useEffect(() => {
        if (user && !isOrganizer) {
            const timer = setTimeout(() => {
                verificationPromptRef.current?.open();
            }, 50);
            return () => clearTimeout(timer);
        } else if (isOrganizer) {
            verificationPromptRef.current?.close();
        }
    }, [user, isOrganizer]);

    const formContextRef = useRef<{
        setFieldValue: (field: string, value: any) => void;
        ticketTypes: TicketTypeFormValues[];
    } | null>(null);

    const handleOpenModal = useCallback((index: number | null) => {
        setEditingIndex(index);
        modalRef.current?.open();
    }, []);

    const handleSubmitTicket = useCallback(
        (ticketValues: TicketTypeFormValues) => {
            const ctx = formContextRef.current;
            if (!ctx) return;

            if (editingIndex !== null) {
                const updated = [...ctx.ticketTypes];
                updated[editingIndex] = ticketValues;
                ctx.setFieldValue("ticket_types", updated);
            } else {
                ctx.setFieldValue("ticket_types", [
                    ...ctx.ticketTypes,
                    ticketValues,
                ]);
            }
        },
        [editingIndex]
    );

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Create Event" />

                <View className="flex-1 px-4 pb-6">
                    {isOrganizer && (
                        <>
                            <View className="mb-6">
                                <AppText
                                    styles="text-sm text-black"
                                    style={{ opacity: 0.6 }}
                                >
                                    Fill in the details below to create your event
                                </AppText>
                            </View>

                            <CreateEventForm
                                onOpenModal={handleOpenModal}
                                formContextRef={formContextRef}
                            />
                        </>
                    )}
                </View>
            </RequireAuth>

            {/* BottomSheet at Screen root — outside FlatList virtualization tree.
                Same placement pattern as DashboardEventsScreen filters / delete sheets. */}
            <AddTicketTypeModal
                ref={modalRef}
                onSubmit={handleSubmitTicket}
                initialValues={
                    editingIndex !== null && formContextRef.current
                        ? formContextRef.current.ticketTypes[editingIndex]
                        : undefined
                }
                isEditing={editingIndex !== null}
            />

            <AppBottomSheet ref={verificationPromptRef} customSnapPoints={["55%"]}>
                <ConfirmAction
                    title="Identity Verification Required"
                    desc="You need to complete identity verification before you can create events."
                    onCancel={() => {
                        verificationPromptRef.current?.close();
                        router.back();
                    }}
                    onConfirm={() => {
                        verificationPromptRef.current?.close();
                        router.push("/dashboard/profile/verify");
                    }}
                    confirmBtnTitle="Start Verification"
                />
            </AppBottomSheet>
        </Screen>
    );
};

export default CreateEventScreen;
