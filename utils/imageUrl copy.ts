export const getFullImageUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://api.cafatickets.com${path}`;
};