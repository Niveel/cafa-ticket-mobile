import { View } from "react-native";
import { useRef, useState, useCallback } from "react";

import {
    Screen,
    AppText,
    RequireAuth,
    CreateEventForm,
    Nav,
    AddTicketTypeModal,
} from "@/components";
import type { AddTicketTypeModalRef } from "@/components/dashboard/events/create/AddTicketTypeModal";
import type { TicketTypeFormValues } from "@/data/eventCreationSchema";

const CreateEventScreen = () => {
    // ---- modal ----
    const modalRef = useRef<AddTicketTypeModalRef>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Live Formik context — written by CreateEventForm on every render inside
    // the AppForm render-prop, so it is always current when we read it here.
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
                    <View className="mb-6">
                        <AppText
                            styles="text-sm text-white"
                            font="font-iregular"
                            style={{ opacity: 0.6 }}
                        >
                            Fill in the details below to create your event
                        </AppText>
                    </View>

                    <CreateEventForm
                        onOpenModal={handleOpenModal}
                        formContextRef={formContextRef}
                    />
                </View>
            </RequireAuth>

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
        </Screen>
    );
};

export default CreateEventScreen;