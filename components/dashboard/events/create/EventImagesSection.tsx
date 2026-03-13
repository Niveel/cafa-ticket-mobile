import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { Image } from "expo-image";

import AppText from "../../../ui/AppText";
import ImageUpload from "../../../ui/ImageUpload";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";
import { getFullImageUrl } from "@/utils/imageUrl";

const EventImagesSection = () => {
    const { values, setFieldValue } = useFormikContext<EventFormValues>();

    // ✅ Handle SINGLE featured image (URI string)
    const handleFeaturedImageChange = (imageUri: string | null) => {
        setFieldValue("featured_image", imageUri || "");
    };

    // ✅ Handle MULTIPLE additional images (array of URIs)
    const handleAdditionalImagesChange = (imageUris: string[]) => {
        const uniqueImages = Array.from(new Set(imageUris));
        const limitedImages = uniqueImages.slice(0, 5);
        setFieldValue("additional_images", limitedImages);
    };

    // ✅ Remove a single additional image
    const handleRemoveAdditionalImage = (index: number) => {
        const currentImages = values.additional_images || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        setFieldValue("additional_images", newImages);
    };

    // ✅ Filter and type-guard to ensure string[] (no undefined)
    const additionalImages: string[] = (values.additional_images || []).filter(
        (img): img is string => img !== null && img !== undefined && typeof img === "string" && img.length > 0
    );
    const canAddMore = additionalImages.length < 5;
    const remainingSlots = 5 - additionalImages.length;

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="image-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Event Images
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Add attractive images
                    </AppText>
                </View>
            </View>

            {/* Featured Image - SINGLE IMAGE ONLY */}
            <View
                className="p-4 rounded-xl border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <AppText styles="text-sm text-white mb-3" font="font-ibold">
                    Featured Image
                </AppText>
                <ImageUpload
                    label="Upload Featured Image"
                    name="featured_image"
                    onImageChange={handleFeaturedImageChange}
                    currentImage={values.featured_image}
                    required
                    multiple={false} // ✅ Single image only
                    helperText="Main event image shown on event cards"
                />
            </View>

            {/* Additional Images - UP TO 5 IMAGES */}
            <View
                className="p-4 rounded-xl border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                {additionalImages.length === 0 ? (
                    // ✅ No images yet - show upload button
                    <ImageUpload
                        label="Upload Additional Images"
                        name="additional_images"
                        onImageChange={() => {}} // Not used for multiple
                        onMultipleImagesChange={handleAdditionalImagesChange}
                        multiple={true} // ✅ Multiple images allowed
                        maxImages={5} // ✅ Up to 5 images
                        helperText="Select up to 5 images for event gallery"
                    />
                ) : (
                    <View className="gap-4">
                        {/* Images Grid - Show current images */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                            {additionalImages.map((image, index) => (
                                <View key={`${image}-${index}`} className="relative mr-3">
                                    <Image
                                        source={{ uri: getFullImageUrl(image) || undefined }}
                                        style={{ width: 120, height: 120 }}
                                        className="rounded-xl"
                                        contentFit="cover"
                                    />

                                    {/* Remove Button */}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveAdditionalImage(index)}
                                        accessible
                                        accessibilityRole="button"
                                        accessibilityLabel={`Remove image ${index + 1}`}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full items-center justify-center"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="close" size={16} color={colors.white} />
                                    </TouchableOpacity>

                                    {/* Image Number */}
                                    <View
                                        className="absolute bottom-2 left-2 px-2 py-0.5 rounded"
                                        style={{ backgroundColor: colors.primary + "CC" }}
                                    >
                                        <AppText styles="text-xs text-white" font="font-ibold">
                                            {index + 1}
                                        </AppText>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Add More Button - Only if under 5 images */}
                        {canAddMore && (
                            <View 
                                className="border-2 border-dashed rounded-xl p-4" 
                                style={{ borderColor: colors.accent + "4D" }}
                            >
                                <ImageUpload
                                    label={`Add More Images`}
                                    name="additional_images_add_more"
                                    onImageChange={() => {}} // Not used
                                    onMultipleImagesChange={(newUris) => {
                                        const combined = [...additionalImages, ...newUris];
                                        const unique = Array.from(new Set(combined));
                                        const limited = unique.slice(0, 5);
                                        setFieldValue("additional_images", limited);
                                    }}
                                    multiple={true}
                                    maxImages={remainingSlots} // ✅ Only allow remaining slots
                                    compact
                                    helperText={`${remainingSlots} ${remainingSlots === 1 ? 'slot' : 'slots'} remaining`}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Info Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200, borderColor: colors.accent }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        Image Guidelines
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Featured image: 1 image for event cards
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Additional images: Up to 5 images for gallery
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Recommended: 1920x1080px or higher
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Formats: JPG, PNG, WEBP
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventImagesSection;
