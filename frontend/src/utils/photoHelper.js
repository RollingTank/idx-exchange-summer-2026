export function getFirstPhoto(photosRaw) {
    const fallback = "../img/image-broken.png"
    if (!photosRaw || photosRaw === 'null' || photosRaw === '') {
        return fallback;
    }
    try {
        const parsed = typeof photosRaw === 'string' ? JSON.parse(photosRaw) : photosRaw;

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {
        console.log("Failed to parse image: ", e);
    }
    return fallback;
}
