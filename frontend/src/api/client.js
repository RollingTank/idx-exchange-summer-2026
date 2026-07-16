export async function fetchProperties(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = `/api/properties?${params}`;
    const response = await(fetch(url));

    if(!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
