export async function fetchProperties(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `/api/properties?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPropertyDetail(id) {
  const response = await fetch(`/api/properties/${id}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPropertyOpenHouses(id) {
  const response = await fetch(`/api/properties/${id}/openhouses`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
