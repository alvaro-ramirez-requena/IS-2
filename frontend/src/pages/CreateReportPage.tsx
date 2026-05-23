import { useState }
    from "react";

import type {
    ReportFormValues,
} from "../types/report.types";

import ReportStepper
    from "../components/report/ReportStepper";

import ReportInformationStep
    from "../components/report/ReportInformationStep";

import {
    validateReport,
} from "../validators/report.validator";

import { ReportFactory }
    from "../factories/report.factory";

import { ReportService }
    from "../services/report.service";

import ReportLocationStep
    from "../components/report/ReportLocationStep";

import ReportEvidenceStep
    from "../components/report/ReportEvidenceStep";

export default function CreateReportPage() {

    const [formData, setFormData] =

        useState<ReportFormValues>({
            category: "",
            problemType: "",
            description: "",
            isAnonymous: false,
            latitude: undefined,
            longitude: undefined,

            images: [],

            imageUrls: [],
        });

    const [errors, setErrors] =
        useState<
            Partial<
                Record<
                    keyof ReportFormValues,
                    string
                >
            >
        >({});

    const [message, setMessage] =
        useState("");

    const [isSubmitting,
        setIsSubmitting] =
        useState(false);

    const [currentStep,
        setCurrentStep] =
        useState(1);

    const handleNext = async () => {

        if (currentStep === 1) {

            const validationErrors =
                validateReport(formData);

            setErrors(validationErrors);

            if (
                Object.keys(validationErrors)
                    .length > 0
            ) {
                return;
            }
        }

        try {

            setIsSubmitting(true);

            setMessage("");

            const userId =
                localStorage.getItem("userId");

            if (!userId) {

                setMessage(
                    "Usuario no autenticado"
                );

                setIsSubmitting(false);

                return;
            }


            if (currentStep === 1) {

                setCurrentStep(2);

                setIsSubmitting(false);

                return;
            }

            if (currentStep === 2) {

                setCurrentStep(3);

                setIsSubmitting(false);

                return;
            }

            const dto =
                ReportFactory
                    .toCreateReportDTO(
                        formData,
                        userId
                    );

            await ReportService
                .createReport(dto);

            setMessage(
                "Reporte creado correctamente"
            );

            setFormData({
                category: "",
                problemType: "",
                description: "",
                isAnonymous: false,
                latitude: undefined,
                longitude: undefined,

                images: [],

                imageUrls: [],
            });

            setCurrentStep(1);

        } catch (error: any) {

            setMessage(
                error?.message
                || "Error inesperado"
            );

        } finally {

            setIsSubmitting(false);
        }
    };



    return (

        <div className="
      min-h-screen
      bg-[#F5F7FA]
      p-4
      lg:p-10
    ">

            <div className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-3xl
        p-6
        lg:p-10
        shadow-sm
      ">

                <h1 className="
          text-3xl
          lg:text-5xl
          font-bold
        ">
                    Crear nuevo reporte
                </h1>

                <p className="
          text-gray-500
          mt-4
          text-lg
        ">
                    Registra una incidencia
                    con tipo de problema,
                    descripción y opción de anónimo.
                </p>

                <div className="mt-12">

                    <ReportStepper
                        currentStep={currentStep}
                    />

                </div>

                {currentStep === 1 && (

                    <ReportInformationStep
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                    />

                )}

                {currentStep === 2 && (

                    <ReportLocationStep
                        formData={formData}
                        setFormData={setFormData}
                    />

                )}

                {currentStep === 3 && (

                    <ReportEvidenceStep
                        formData={formData}
                        setFormData={setFormData}
                    />

                )}

                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="
          mt-10
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          rounded-2xl
          py-5
          text-2xl
          font-semibold
        ">
                    {
                        isSubmitting
                            ? "Creando..."
                            : currentStep === 3
                                ? "Crear reporte"
                                : "Siguiente"
                    }
                </button>

                {message && (

                    <div className="
    mt-6
    text-center
    text-lg
  ">
                        {message}
                    </div>

                )}

            </div>

        </div>
    );
}