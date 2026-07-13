import { useState } from "react";

import type { Dispatch, SetStateAction } from "react";

import type { ReportFormValues } from "../../types/report.types";

type Props = {
  formData: ReportFormValues;

  setFormData: Dispatch<SetStateAction<ReportFormValues>>;
};

export default function ReportLocationStep({ formData, setFormData }: Props) {
  const [locationName, setLocationName] = useState<string>("");

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const hasLocation =
    formData.latitude !== null &&
    formData.latitude !== undefined &&
    formData.longitude !== null &&
    formData.longitude !== undefined;

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      setIsLoadingAddress(true);

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=es`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;

        setLocationName(address);

        setFormData((prev) => ({
          ...prev,
          address,
        }));
      } else {
        setLocationName("No se pudo obtener el nombre exacto de la ubicación.");
      }
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,

          latitude,
          longitude,
        }));

        await getAddressFromCoordinates(latitude, longitude);
      },

      () => {
        alert("No se pudo obtener la ubicación. Verifica los permisos del navegador.");
      }
    );
  };

  return (
    <div>
      <h2
        className="
                text-4xl
                font-bold
                mb-4
            "
      >
        Ubicación del reporte
      </h2>

      <p
        className="
                text-gray-500
                text-lg
                mb-10
            "
      >
        Usamos tu ubicación para asociar el reporte al distrito o municipalidad correspondiente.
      </p>

      <div
        className="
                space-y-6
            "
      >
        <div
          className="
                    border
                    rounded-3xl
                    p-8
                    flex
                    items-center
                    justify-between
                "
        >
          <div
            className="
                        flex
                        items-center
                        gap-6
                    "
          >
            <div
              className="
                            w-16
                            h-16
                            rounded-full
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            text-3xl
                        "
            >
              📍
            </div>

            <div>
              <h3
                className="
                                text-2xl
                                font-semibold
                            "
              >
                Solicitud de permisos de ubicación
              </h3>

              <p
                className="
                                text-gray-500
                                mt-2
                            "
              >
                Necesitamos tu permiso para acceder a la ubicación de tu dispositivo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGetLocation}
            className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            text-lg
                            font-semibold
                        "
          >
            Permitir ubicación
          </button>
        </div>

        <div
          className="
                    border
                    rounded-3xl
                    p-8
                "
        >
          <div
            className="
                        flex
                        items-center
                        justify-between
                    "
          >
            <div
              className="
                            flex
                            items-center
                            gap-6
                        "
            >
              <div
                className="
                                w-16
                                h-16
                                rounded-full
                                bg-green-100
                                flex
                                items-center
                                justify-center
                                text-3xl
                            "
              >
                🎯
              </div>

              <div>
                <h3
                  className="
                                    text-2xl
                                    font-semibold
                                "
                >
                  Captura automática de coordenadas
                </h3>

                <p
                  className="
                                    text-gray-500
                                    mt-2
                                "
                >
                  {hasLocation
                    ? "Ubicación capturada correctamente."
                    : "Solicita permisos para obtener tu ubicación."}
                </p>
              </div>
            </div>

            <div
              className="
                            text-green-600
                            font-semibold
                            text-lg
                        "
            >
              {hasLocation ? "✓ Ubicación obtenida" : "Ubicación pendiente"}
            </div>
          </div>

          {hasLocation && (
            <div
              className="
                                mt-8
                                bg-green-50
                                rounded-2xl
                                p-6
                                space-y-5
                            "
            >
              <div>
                <p
                  className="
                                        text-green-700
                                        font-semibold
                                        text-lg
                                    "
                >
                  ✓ Ubicación detectada en Google Maps
                </p>

                <p
                  className="
                                        text-gray-600
                                        mt-2
                                    "
                >
                  Latitud: {formData.latitude} | Longitud: {formData.longitude}
                </p>

                <div
                  className="
                                        mt-4
                                        bg-white
                                        border
                                        rounded-2xl
                                        p-4
                                    "
                >
                  <p
                    className="
                                            font-semibold
                                            text-[#03152E]
                                        "
                  >
                    Dirección aproximada detectada:
                  </p>

                  <p
                    className="
                                            text-gray-600
                                            mt-2
                                            leading-relaxed
                                        "
                  >
                    {isLoadingAddress
                      ? "Obteniendo nombre de la ubicación..."
                      : locationName || "Ubicación detectada, pero aún no se obtuvo una dirección."}
                  </p>
                </div>
              </div>

              <iframe
                title="Ubicación detectada"
                width="100%"
                height="320"
                loading="lazy"
                className="
                                        rounded-2xl
                                        border
                                    "
                src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&z=17&output=embed`}
              />

              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                                        inline-block
                                        text-blue-700
                                        font-semibold
                                        hover:underline
                                    "
              >
                Abrir ubicación en Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
