import { placeholderImage } from "@/data/constants";

export const getFullImageUrl = (path?: string | null): string => {
    if (!path) return placeholderImage;

    const trimmedPath = path.trim();
    if (!trimmedPath) return placeholderImage;

    // Keep local/device sources untouched.
    if (
        trimmedPath.startsWith("file://") ||
        trimmedPath.startsWith("content://") ||
        trimmedPath.startsWith("data:") ||
        trimmedPath.startsWith("blob:")
    ) {
        return trimmedPath;
    }

    if (trimmedPath.startsWith("//")) {
        return `https:${trimmedPath}`;
    }

    if (trimmedPath.startsWith("http://")) {
        return `https://${trimmedPath.slice(7)}`;
    }

    if (trimmedPath.startsWith("https://")) {
        return trimmedPath;
    }

    const normalizedPath = trimmedPath.startsWith("/")
        ? trimmedPath
        : `/${trimmedPath}`;

    return `https://api.cafatickets.com${normalizedPath}`;
};
