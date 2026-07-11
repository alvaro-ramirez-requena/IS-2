import { useRef } from "react";

import type { Dispatch, SetStateAction } from "react";

import type { ReportFormValues } from "../../types/report.types";

import { ReportService } from "../../services/report.service";

type Props = {
  formData: ReportFormValues;

  setFormData: Dispatch<SetStateAction<ReportFormValues>>;
};

export default function ReportEvidenceStep({ formData, setFormData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 3;

  const handleSelectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const uniqueFiles = selectedFiles.filter((file) => {
      return !formData.images.some(
        (existingImage) => existingImage.name === file.name && existingImage.size === file.size
      );
    });

    if (uniqueFiles.length === 0) {
      alert("Las imágenes ya fueron agregadas");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    const totalImages = formData.images.length + uniqueFiles.length;

    if (totalImages > MAX_IMAGES) {
      alert(`Máximo ${MAX_IMAGES} imágenes`);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    try {
      const uploadedUrls = await Promise.all(
        uniqueFiles.map((file) => ReportService.uploadImage(file))
      );

      setFormData((prev) => ({
        ...prev,

        images: [...prev.images, ...uniqueFiles],

        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      alert("Error subiendo imágenes");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,

      images: prev.images.filter((_, i) => i !== index),

      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
        Evidencia del reporte
      </h2>

      <p
        className="
        text-gray-500
        text-lg
        mb-10
      "
      >
        Adjunta fotos que ayuden a describir mejor el problema reportado.
      </p>

      <div
        className="
        border
        rounded-3xl
        p-10
      "
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"

          onChange={handleSelectImages}
        />
      </div>

      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
        mt-8
      "
      >
        {formData.images.map((image, index) => (
          <div
            key={index}
            className="
                relative
              "
          >
            <img
              src={URL.createObjectURL(image)}

              className="
                  w-full
                  h-40
                  object-cover
                  rounded-2xl
                "
            />

            <button
              onClick={() => removeImage(index)}

              className="
                  absolute
                  top-2
                  right-2
                  bg-white
                  rounded-full
                  w-8
                  h-8
                "
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
