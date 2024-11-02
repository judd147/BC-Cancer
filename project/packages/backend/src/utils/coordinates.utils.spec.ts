import { getCoordinates, calculateDistance } from './coordinates.utils';

describe('Coordinates Utils', () => {
  describe('getCoordinates', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('should return coordinates for a valid address', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([{ lat: '49.288990', lon: '-123.128270' }]),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const address = '1400 - 410 West Georgia St., Vancouver';
      const coordinates = await getCoordinates(address);

      expect(coordinates).toEqual({ lat: 49.288990, lon: -123.128270 });
      expect(global.fetch).toHaveBeenCalledWith(
        `https://geocode.maps.co/search?q=${address}&api_key=6725c228d97dd083516407vpk4a8592`
      );
    });

    it('should throw an error if the response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const address = 'Invalid Address';

      await expect(getCoordinates(address)).rejects.toThrow('Failed to get coordinates');
    });

    it('should throw an error if fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

      const address = 'New York';

      await expect(getCoordinates(address)).rejects.toThrow('Failed to get coordinates');
    });
  });

  describe('calculateDistance', () => {
    it('should calculate the distance between two coordinates', () => {
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      const lat2 = 34.0522;
      const lon2 = -118.2437;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      console.log(distance);
      // The distance between New York and Los Angeles is approximately 3940 km
      expect(distance).toBeCloseTo(3940, -3);
    });
  });
});