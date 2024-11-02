export const getCoordinates = async (address: string) => {
    const url = `https://geocode.maps.co/search?q=${address}&api_key=6725c228d97dd083516407vpk4a8592`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) };
    } catch (error) {
      console.error(error.message);
      throw new Error("Failed to get coordinates");
    }
  }
  
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number ) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c / 1000; // in kilometers
}