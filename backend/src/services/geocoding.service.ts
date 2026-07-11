type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type LocationDetails = {
  address: string | null;
  district: string | null;
  province: string | null;
  department: string | null;
};

export class GeocodingService {
  private static getApiKey() {
    return process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "";
  }

  static async getAddress(latitude: number, longitude: number): Promise<string | undefined> {
    const locationDetails = await this.getLocationDetails(latitude, longitude);

    return locationDetails.address || undefined;
  }

  static async getLocationDetails(latitude: number, longitude: number): Promise<LocationDetails> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        address: null,
        district: null,
        province: null,
        department: null,
      };
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK" || !data.results?.length) {
      return {
        address: null,
        district: null,
        province: null,
        department: null,
      };
    }

    const result = data.results[0];

    const components = result.address_components as GoogleAddressComponent[];

    const findComponent = (type: string) =>
      components.find((component) => component.types.includes(type))?.long_name || null;

    const district =
      findComponent("locality") ||
      findComponent("sublocality") ||
      findComponent("sublocality_level_1") ||
      findComponent("administrative_area_level_3");

    const province = findComponent("administrative_area_level_2");

    const department = findComponent("administrative_area_level_1");

    return {
      address: result.formatted_address || null,

      district,

      province,

      department,
    };
  }
}
