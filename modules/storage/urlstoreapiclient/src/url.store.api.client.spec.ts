import fetchMock from 'jest-fetch-mock';
import { loadFromApi } from "./url.store.api.client";

fetchMock.enableMocks ();

beforeEach ( () => {
  // Reset fetchMock before each test
  fetchMock.resetMocks ();
} );

afterAll ( () => {
  fetchMock.disableMocks ();
} );

describe('loadFromApi', () => {

  it('successfully loads data from the API', async () => {
    const mockResult = {
      url: 'someUrl',
      mimeType: 'application/json',
      result: { some: 'data' },
      fileSize: 123,
      id: 'itsmid:org:namespace:id'
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResult));

    const config = { apiUrlPrefix: 'http://api.example.com' };
    const urlAsString = 'itsmid:org:namespace:id';

    const result = await loadFromApi(config, urlAsString);

    expect(result).toEqual(mockResult);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${config.apiUrlPrefix}/${encodeURIComponent(urlAsString)}`);
  });

  it('handles non-200 responses from the API', async () => {
    fetchMock.mockResponseOnce('Not Found', { status: 404 });

    const config = { apiUrlPrefix: 'http://api.example.com' };
    const urlAsString = 'itsmid:org:namespace:id';

    const result = await loadFromApi(config, urlAsString);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toContain(`Failed to load ${urlAsString}. Status 404`);
  });

  it('handles fetch errors', async () => {
    fetchMock.mockReject(new Error('Network error'));

    const config = { apiUrlPrefix: 'http://api.example.com' };
    const urlAsString = 'itsmid:org:namespace:id';

    const result = await loadFromApi(config, urlAsString);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toContain(`Failed to load ${urlAsString}`);
    expect(result[1]).toBeDefined(); // Expecting the error object
  });


});
