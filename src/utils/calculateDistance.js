export const getNearest = (current, restaurants, google) => {
  const service = new google.maps.DistanceMatrixService();
  const destinations = restaurants.map((r) => r.position);

  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [current],
        destinations,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status !== "OK" || !response.rows.length) {
          return reject("DistanceMatrix failed: " + status);
        }
        const elements = response.rows[0].elements;
        let minIdx = 0;
        let minVal = elements[0].distance.value;

        for (let i = 1; i < elements.length; i++) {
          if (elements[i].distance.value < minVal) {
            minVal = elements[i].distance.value;
            minIdx = i;
          }
        }
        resolve(restaurants[minIdx]);
      }
    );
  });
};
