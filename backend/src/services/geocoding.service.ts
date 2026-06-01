export class GeocodingService {

    static async getAddress(

        latitude: number,

        longitude: number

    ) {

        try {

            const response =
                await fetch(

                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,

                    {
                        headers: {
                            "User-Agent":
                                "ReportaYaApp"
                        }
                    }
                );

            const data =
                await response.json();

            return (
                data.display_name
                || "Ubicación desconocida"
            );

        } catch {

            return "Ubicación desconocida";
        }
    }
}