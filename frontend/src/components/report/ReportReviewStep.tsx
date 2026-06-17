import type {
  ReportFormValues,
} from "../../types/report.types";

import {
  categoryLabels,
} from "../../utils/reportLabels";

type Props = {
  formData: ReportFormValues;
};

export default function
  ReportReviewStep({
    formData,
  }: Props) {

  return (

    <div>

      <h2 className="
        text-4xl
        font-bold
        mb-4
      ">
        Revisar reporte antes
        de enviarlo
      </h2>

      <p className="
        text-gray-500
        text-lg
        mb-10
      ">
        Verifica la información
        antes de confirmar.
      </p>

      <div className="
        border
        rounded-3xl
        p-8
        space-y-6
      ">

        <div>

          <h3 className="
            text-2xl
            font-semibold
            mb-4
          ">
            Información
          </h3>

          <div className="
            space-y-2
            text-lg
          ">

            <p>
              <strong>
                Categoría:
              </strong>

              {" "}
              {
                categoryLabels[
                formData.category
                ]
              }
            </p>

            <p>
              <strong>
                Problema:
              </strong>

              {" "}
              {formData.problemType}
            </p>

            <p>
              <strong>
                Descripción:
              </strong>

              {" "}
              {formData.description}
            </p>

            <p>
              <strong>
                Anónimo:
              </strong>

              {" "}
              {
                formData.isAnonymous
                  ? "Sí"
                  : "No"
              }
            </p>

          </div>

        </div>

        <div>

          <h3 className="
            text-2xl
            font-semibold
            mb-4
          ">
            Ubicación
          </h3>

          <div className="
    bg-green-50
    rounded-2xl
    p-5
">

            <p className="
        text-green-700
        font-semibold
        text-lg
    ">

              ✓ Ubicación capturada correctamente

            </p>

            <p className="
        text-gray-500
        mt-2
    ">

              La dirección exacta será
              generada automáticamente
              al registrar el reporte.

            </p>

          </div>

        </div>

        <div>

          <h3 className="
            text-2xl
            font-semibold
            mb-4
          ">
            Evidencias
          </h3>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-4
          ">

            {formData.images.map(
              (image, index) => (

                <img
                  key={index}

                  src={
                    URL.createObjectURL(
                      image
                    )
                  }

                  className="
                    w-full
                    h-40
                    object-cover
                    rounded-2xl
                  "
                />
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}