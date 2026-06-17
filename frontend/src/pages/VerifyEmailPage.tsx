import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Token no encontrado.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/verify-email?token=${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "No se pudo verificar el correo");
        }

        setMessage("Correo verificado correctamente. Redirigiendo al login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        setMessage(error.message || "No se pudo verificar el correo.");
      }
    }

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Verificación de correo</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}