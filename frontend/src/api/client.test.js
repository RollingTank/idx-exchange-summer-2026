import { fetchProperties } from './client';

describe('API Client - fetchProperties', () => {
  beforeEach(() => {
    global.fetch = jest.fn(); 
  });

  test('returns results and total on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ L_ListingID: '1000291026' }], total: 1 })
    });

    const data = await fetchProperties({ city: 'Portland' });
    expect(data.total).toBe(1);
  });

  test('throws meaningful error message on 500 failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(fetchProperties()).rejects.toThrow('API Error: 500 Internal Server Error');
  });

  test('serializes search params into the URL structure correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], total: 0 })
    });

    await fetchProperties({ city: 'Beverly Hills', beds: '2' });
    expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Beverly+Hills&beds=2');
  });
});
