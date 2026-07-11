type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GoogleGeocodeResult = {
  formatted_address?: string;
  address_components: GoogleAddressComponent[];
};

type GoogleGeocodeResponse = {
  status: string;
  results?: GoogleGeocodeResult[];
};

export type LocationDetails = {
  address: string | null;
  district: string | null;
  province: string | null;
  department: string | null;
};

export class GeocodingService {
  private static getApiKey() {
    return (
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      ""
    );
  }

  private static emptyLocationDetails(): LocationDetails {
    return {
      address: null,
      district: null,
      province: null,
      department: null,
    };
  }

  private static findComponent(
    components: GoogleAddressComponent[],
    acceptedTypes: string[]
  ) {
    const component = components.find((item) =>
      acceptedTypes.some((type) => item.types.includes(type))
    );

    return component?.long_name || null;
  }

  static async getAddress(
    latitude: number,
    longitude: number
  ): Promise<string | undefined> {
    const locationDetails = await this.getLocationDetails(
      latitude,
      longitude
    );

    return locationDetails.address || undefined;
  }

  static async getLocationDetails(
    latitude: number,
    longitude: number
  ): Promise<LocationDetails> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return this.emptyLocationDetails();
    }

    const url =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?latlng=${latitude},${longitude}` +
      `&key=${apiKey}` +
      `&language=es` +
      `&region=pe`;

    const response = await fetch(url);

    const data = (await response.json()) as GoogleGeocodeResponse;

    if (
      data.status !== "OK" ||
      !data.results ||
      data.results.length === 0
    ) {
      return this.emptyLocationDetails();
    }

    const result = data.results[0];

    const components = result.address_components || [];

    const district =
      this.findComponent(components, [
        "sublocality_level_1",
        "sublocality",
        "locality",
        "administrative_area_level_3",
      ]);

    const province =
      this.findComponent(components, [
        "administrative_area_level_2",
      ]);

    const department =
      this.findComponent(components, [
        "administrative_area_level_1",
      ]);

    return {
      address: result.formatted_address || null,
      district,
      province,
      department,
    };
  }
}