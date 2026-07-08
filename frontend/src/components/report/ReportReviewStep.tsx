import type {
  ReportFormValues,
} from "../../types/report.types";

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
              {formData.category}
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
            text-lg
            space-y-2
          ">

            <p>
              <strong>
                Latitud:
              </strong>

              {" "}
              {formData.latitude}
            </p>

            <p>
              <strong>
                Longitud:
              </strong>

              {" "}
              {formData.longitude}
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