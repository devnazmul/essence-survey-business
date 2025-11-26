export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(`Error getting location: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Maximum time to wait for the location (in milliseconds)
          maximumAge: 0, // Prevent using cached data
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}
