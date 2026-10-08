import axios from "axios";

let cachedRestaurantAddress = "";
let cachedRestaurantCoordinates = null;
let restaurantGeocodePromise = null;
let nominatimQueue = Promise.resolve();
let lastNominatimRequestAt = 0;

const getRestaurantCoordinates = async (address) => {
  if (address === cachedRestaurantAddress && cachedRestaurantCoordinates) {
    return cachedRestaurantCoordinates;
  }

  if (address !== cachedRestaurantAddress) {
    cachedRestaurantAddress = address;
    cachedRestaurantCoordinates = null;
    restaurantGeocodePromise = null;
  }

  if (!restaurantGeocodePromise) {
    const geocodePromise = axios
      .get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: address,
          format: "jsonv2",
          limit: 1,
          email: process.env.OSM_CONTACT_EMAIL?.trim() || undefined,
        },
        headers: {
          "User-Agent": "RestaurantAPP/1.0 (delivery fee estimation)",
        },
        timeout: 10000,
      })
      .then((response) => {
        const place = response.data?.[0];
        const latitude = Number(place?.lat);
        const longitude = Number(place?.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          const error = new Error(
            "Could not find the restaurant address on OpenStreetMap.",
          );
          error.statusCode = 400;
          throw error;
        }
        const coordinates = { latitude, longitude };
        if (cachedRestaurantAddress === address) {
          cachedRestaurantCoordinates = coordinates;
        }
        return coordinates;
      })
      .catch((cause) => {
        if (
          cachedRestaurantAddress === address &&
          restaurantGeocodePromise === geocodePromise
        ) {
          restaurantGeocodePromise = null;
        }
        if (cause.statusCode) throw cause;
        const error = new Error(
          "OpenStreetMap address lookup is temporarily unavailable.",
        );
        error.statusCode = 502;
        error.cause = cause;
        throw error;
      });
    restaurantGeocodePromise = geocodePromise;
  }

  return restaurantGeocodePromise;
};

const lookupNominatim = async (path, params) => {
  const request = nominatimQueue.then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastNominatimRequestAt));
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    lastNominatimRequestAt = Date.now();

    try {
      return await axios.get(`https://nominatim.openstreetmap.org${path}`, {
        params: {
          ...params,
          format: "jsonv2",
          email: process.env.OSM_CONTACT_EMAIL?.trim() || undefined,
        },
        headers: {
          "User-Agent": "RestaurantAPP/1.0 (delivery location lookup)",
        },
        timeout: 10000,
      });
    } catch (cause) {
      const error = new Error(
        "OpenStreetMap location lookup is temporarily unavailable.",
      );
      error.statusCode = 502;
      error.cause = cause;
      throw error;
    }
  });
  nominatimQueue = request.then(
    () => undefined,
    () => undefined,
  );
  return request;
};

const formatPlace = (place) => {
  const latitude = Number(place?.lat);
  const longitude = Number(place?.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    const error = new Error("Could not find that address on OpenStreetMap.");
    error.statusCode = 404;
    throw error;
  }

  return {
    address: place.display_name || "",
    latitude,
    longitude,
  };
};

export const searchDeliveryAddress = async (address) => {
  const response = await lookupNominatim("/search", {
    q: address,
    limit: 1,
  });
  return formatPlace(response.data?.[0]);
};

export const reverseLookupDeliveryLocation = async (latitude, longitude) => {
  const response = await lookupNominatim("/reverse", {
    lat: latitude,
    lon: longitude,
    zoom: 18,
    addressdetails: 1,
  });
  return formatPlace(response.data);
};

export const getDistanceBasedDeliveryQuote = async (
  latitude,
  longitude,
  subtotal,
  settings,
) => {
  const destinationLatitude = Number(latitude);
  const destinationLongitude = Number(longitude);
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined ||
    !Number.isFinite(destinationLatitude) ||
    destinationLatitude < -90 ||
    destinationLatitude > 90 ||
    !Number.isFinite(destinationLongitude) ||
    destinationLongitude < -180 ||
    destinationLongitude > 180
  ) {
    const error = new Error("Select a valid delivery location on the map.");
    error.statusCode = 400;
    throw error;
  }

  const origin = await getRestaurantCoordinates(settings.restaurantAddress);
  let response;
  try {
    response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destinationLongitude},${destinationLatitude}`,
      {
        params: { overview: "false", steps: "false" },
        timeout: 10000,
      },
    );
  } catch (cause) {
    const error = new Error("Could not calculate the driving distance.");
    error.statusCode = 502;
    error.cause = cause;
    throw error;
  }

  if (response.data?.code !== "Ok") {
    const error = new Error(
      "Could not find a driving route to the selected delivery location.",
    );
    error.statusCode = 400;
    throw error;
  }

  const distanceMeters = Number(response.data?.routes?.[0]?.distance);
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    const error = new Error("The routing service returned an invalid distance.");
    error.statusCode = 502;
    throw error;
  }

  const distanceKm = distanceMeters / 1000;
  const deliveryFee =
    subtotal >= settings.freeDeliveryThreshold
      ? 0
      : Number((distanceKm * settings.deliveryFeePerKm).toFixed(2));

  return {
    distanceKm: Number(distanceKm.toFixed(1)),
    deliveryFee,
  };
};
