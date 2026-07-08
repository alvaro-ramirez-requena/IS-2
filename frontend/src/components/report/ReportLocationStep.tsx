import type {
    Dispatch,
    SetStateAction,
} from "react";

import type {
    ReportFormValues,
} from "../../types/report.types";

type Props = {

    formData: ReportFormValues;

    setFormData:
    Dispatch<
        SetStateAction<
            ReportFormValues
        >
    >;
};

export default function ReportLocationStep({
    formData,
    setFormData,
}: Props) {

    const handleGetLocation = () => {

        navigator.geolocation
            .getCurrentPosition(

                (position) => {

                    setFormData((prev) => ({
                        ...prev,

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,
                    }));
                },

                () => {

                    alert(
                        "No se pudo obtener la ubicación"
                    );
                }
            );
    };

    return (

        <div>

            <h2 className="
        text-4xl
        font-bold
        mb-4
      ">
                Ubicación del reporte
            </h2>

            <p className="
        text-gray-500
        text-lg
        mb-10
      ">
                Usamos tu ubicación para
                asociar el reporte al distrito
                o municipalidad correspondiente.
            </p>

            <div className="
        space-y-6
      ">

                <div className="
          border
          rounded-3xl
          p-8
          flex
          items-center
          justify-between
        ">

                    <div className="
            flex
            items-center
            gap-6
          ">

                        <div className="
              w-16
              h-16
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
              text-3xl
            ">
                            📍
                        </div>

                        <div>

                            <h3 className="
                text-2xl
                font-semibold
              ">
                                Solicitud de permisos
                                de ubicación
                            </h3>

                            <p className="
                text-gray-500
                mt-2
              ">
                                Necesitamos tu permiso
                                para acceder a la ubicación
                                de tu dispositivo.
                            </p>

                        </div>

                    </div>

                    <button
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
          ">
                        Permitir ubicación
                    </button>

                </div>

                <div className="
          border
          rounded-3xl
          p-8
        ">

                    <div className="
            flex
            items-center
            justify-between
          ">

                        <div className="
              flex
              items-center
              gap-6
            ">

                            <div className="
                w-16
                h-16
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                text-3xl
              ">
                                🎯
                            </div>

                            <div>

                                <h3 className="
                  text-2xl
                  font-semibold
                ">
                                    Captura automática
                                    de coordenadas
                                </h3>

                                <p className="
                  text-gray-500
                  mt-2
                ">
                                    Obteniendo tu
                                    ubicación actual...
                                </p>

                            </div>

                        </div>

                        <div className="
              text-green-600
              font-semibold
              text-lg
            ">
                            {
                                formData.latitude
                                    && formData.longitude
                                    ? "✓ Ubicación obtenida"
                                    : "Ubicación pendiente"
                            }
                        </div>

                    </div>

                    <div className="
            mt-8
            grid
            md:grid-cols-2
            gap-6
            bg-green-50
            rounded-2xl
            p-6
          ">

                        <div>

                            <p className="
                text-gray-500
              ">
                                Latitud
                            </p>

                            <p className="
                text-2xl
                font-bold
                mt-2
              ">
                                {
                                    formData.latitude
                                    ?? "Sin ubicación"
                                }
                            </p>

                        </div>

                        <div>

                            <p className="
                text-gray-500
              ">
                                Longitud
                            </p>

                            <p className="
                text-2xl
                font-bold
                mt-2
              ">
                                {
                                    formData.longitude
                                    ?? "Sin ubicación"
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}