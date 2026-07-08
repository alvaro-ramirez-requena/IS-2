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

    errors:
    Partial<
        Record<
            keyof ReportFormValues,
            string
        >
    >;
};

const categoryProblems = {

    SECURITY: [

        "Robos y asaltos",

        "Consumo de alcohol en la vía pública",

        "Venta ambulante no autorizada",

        "Personas sospechosas",

        "Ruidos molestos",
    ],

    ENVIRONMENT: [

        "Acumulación de basura",

        "Mal olor en la vía pública",

        "Contaminación de áreas verdes",

        "Residuos fuera de contenedores",

        "Quema de residuos",
    ],

    INFRASTRUCTURE: [

        "Alumbrado público defectuoso",

        "Pistas en mal estado",

        "Veredas en mal estado",

        "Semáforos inoperativos",

        "Señalización dañada",
    ],

    MOBILITY: [

        "Congestión vehicular",

        "Estacionamiento en zonas prohibidas",

        "Transporte público deficiente",

        "Autos abandonados",

        "Exceso de velocidad",
    ],
};

export default function ReportInformationStep({
    formData,
    setFormData,
    errors,
}: Props) {

    return (

        <div>

            <div className="
        grid
        md:grid-cols-2
        gap-6
      ">

                <div>

                    <label className="
            block
            text-lg
            font-medium
            mb-3
          ">
                        Categoría *
                    </label>

                    <select
                        value={formData.category}
                        onChange={(e) =>
                            setFormData((prev) => ({

                                ...prev,

                                category:
                                    e.target.value,

                                problemType: "",
                            }))
                        }
                        className="
              w-full
              border
              rounded-2xl
              p-4
              text-lg
            "
                    >

                        <option value="">
                            Selecciona categoría
                        </option>

                        <option value="INFRASTRUCTURE">
                            Infraestructura y servicios
                        </option>

                        <option value="SECURITY">
                            Seguridad ciudadana
                        </option>

                        <option value="ENVIRONMENT">
                            Ambiente y limpieza
                        </option>

                        <option value="MOBILITY">
                            Movilidad y tránsito
                        </option>

                    </select>

                    {errors.category && (

                        <p className="
                            text-red-500
                            mt-2
                        ">
                            {errors.category}
                        </p>

                    )}

                </div>

                <div>

                    <label className="
                        block
                        text-lg
                        font-medium
                        mb-3
                    ">
                        Tipo de problema *
                    </label>

                    <select
                        value={formData.problemType}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                problemType: e.target.value,
                            }))
                        }
                        className="
                            w-full
                            border
                            rounded-2xl
                            p-4
                            text-lg
                            "
                        >

                        <option value="">
                            Selecciona un tipo de problema
                        </option>

                        {
                            formData.category &&

                            categoryProblems[
                                formData.category as keyof typeof categoryProblems
                            ]?.map((problem) => (

                                <option
                                    key={problem}
                                    value={problem}
                                >
                                    {problem}
                                </option>

                            ))
                        }

                    </select>

                    {errors.problemType && (

                        <p className="
                            text-red-500
                            mt-2
                        ">
                            {errors.problemType}
                        </p>

                    )}

                </div>

            </div>

                <div className="mt-8">

                    <label className="
                        block
                        text-lg
                        font-medium
                        mb-3
                    ">
                        Título del reporte *
                    </label>

                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                        placeholder="Ej. Personas bebiendo frente al parque"
                        className="
                            w-full
                            border
                            rounded-2xl
                            p-4
                            text-lg
                        "
                    />

                    {errors.title && (

                        <p className="
                            text-red-500
                            mt-2
                        ">
                            {errors.title}
                        </p>

                    )}

                </div>

                <div className="mt-8">

                    <label className="
                        block
                        text-lg
                        font-medium
                        mb-3
                    ">
                        Descripción del problema *
                    </label>

                <textarea
                    rows={8}
                    value={formData.description}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                    placeholder="
                        Describe lo que está ocurriendo...
                    "
                    className="
                        w-full
                        border
                        rounded-2xl
                        p-4
                        text-lg
                        resize-none
                    "
                />

                {errors.description && (

                    <p className="
                        text-red-500
                        mt-2
                    ">
                        {errors.description}
                    </p>

                )}



            </div>

            <div className="
                mt-8
                border
                rounded-2xl
                p-6
                flex
                items-center
                justify-between
            ">

                <div>

                    <h3 className="
                        text-xl
                        font-medium
                    ">
                        ¿Deseas enviar el reporte
                        de forma anónima?
                    </h3>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        Tu identidad no será visible
                        para otros usuarios.
                    </p>

                </div>

                <button
                    onClick={() =>
                        setFormData((prev) => ({
                            ...prev,
                            isAnonymous:
                                !prev.isAnonymous,
                        }))
                    }
                    className={`
                        w-16
                        h-9
                        rounded-full
                        flex
                        items-center
                        px-1
                        transition
                        ${formData.isAnonymous
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }
          `}
                >

                    <div className={`
                        w-7
                        h-7
                        rounded-full
                        bg-white
                        transition
                        ${formData.isAnonymous
                            ? "ml-auto"
                            : ""
                        }
                    `} />

                </button>

            </div>

        </div>
    );
}