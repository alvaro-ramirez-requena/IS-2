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
  error_message?: string;
};

export type LocationDetails = {
  address: string | null;
  district: string | null;
  province: string | null;
  department: string | null;
  searchText: string | null;
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
      searchText: null,
    };
  }

  private static normalizeText(value?: string | null) {
    if (!value) {
      return "";
    }

    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private static isUsefulDistrict(value?: string | null) {
    const normalized =
      this.normalizeText(value);

    if (!normalized) {
      return false;
    }

    const genericValues = [
      "lima",
      "provincia de lima",
      "region de lima",
      "peru",
    ];

    return !genericValues.includes(normalized);
  }

  private static findComponent(
    components: GoogleAddressComponent[],
    acceptedTypes: string[]
  ) {
    const component =
      components.find((item) =>
        acceptedTypes.some((type) =>
          item.types.includes(type)
        )
      );

    return component?.long_name || null;
  }

  private static findUsefulComponentFromAllResults(
    results: GoogleGeocodeResult[],
    acceptedTypes: string[],
    avoidGenericDistrict = false
  ) {
    for (const result of results) {
      const components =
        result.address_components || [];

      const component =
        this.findComponent(
          components,
          acceptedTypes
        );

      if (!component) {
        continue;
      }

      if (
        avoidGenericDistrict &&
        !this.isUsefulDistrict(component)
      ) {
        continue;
      }

      return component;
    }

    return null;
  }

  private static buildSearchText(
    results: GoogleGeocodeResult[]
  ) {
    const values: string[] = [];

    for (const result of results) {
      if (result.formatted_address) {
        values.push(result.formatted_address);
      }

      for (const component of result.address_components || []) {
        values.push(component.long_name);
        values.push(component.short_name);
      }
    }

    return Array.from(new Set(values))
      .filter(Boolean)
      .join(" ");
  }

  static async getAddress(
    latitude: number,
    longitude: number
  ): Promise<string | undefined> {
    const locationDetails =
      await this.getLocationDetails(
        latitude,
        longitude
      );

    return locationDetails.address || undefined;
  }

  static async getLocationDetails(
    latitude: number,
    longitude: number
  ): Promise<LocationDetails> {
    const apiKey =
      this.getApiKey();

    if (!apiKey) {
      return this.emptyLocationDetails();
    }

    const url =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?latlng=${latitude},${longitude}` +
      `&key=${apiKey}` +
      `&language=es` +
      `&region=pe`;

    const response =
      await fetch(url);

    const data =
      (await response.json()) as GoogleGeocodeResponse;

    if (
      data.status !== "OK" ||
      !data.results ||
      data.results.length === 0
    ) {
      console.log("Error de Google Geocoding:", {
        status:
          data.status,

        errorMessage:
          data.error_message,

        latitude,

        longitude,
      });

      return this.emptyLocationDetails();
    }

    const results =
      data.results;

    const address =
      results[0].formatted_address || null;

    const searchText =
      this.buildSearchText(results);

    const district =
      this.findUsefulComponentFromAllResults(
        results,
        [
          "sublocality_level_1",
          "sublocality",
          "administrative_area_level_3",
          "administrative_area_level_4",
          "locality",
        ],
        true
      ) ||
      this.findUsefulComponentFromAllResults(
        results,
        [
          "sublocality_level_1",
          "sublocality",
          "administrative_area_level_3",
          "administrative_area_level_4",
          "locality",
        ]
      );

    const province =
      this.findUsefulComponentFromAllResults(
        results,
        [
          "administrative_area_level_2",
        ]
      );

    const department =
      this.findUsefulComponentFromAllResults(
        results,
        [
          "administrative_area_level_1",
        ]
      );

    return {
      address,
      district,
      province,
      department,
      searchText,
    };
  }
}