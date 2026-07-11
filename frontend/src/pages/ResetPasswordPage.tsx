import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Token no encontrado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || "No se pudo restablecer la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#03152E] text-white flex flex-col justify-center px-20">
        <h1 className="text-5xl font-bold mb-16">
          reporta<span className="text-yellow-400">Ya</span>
        </h1>
        <h2 className="text-4xl font-bold mb-6">Crea una nueva contraseña</h2>
        <p className="text-xl">Ingresa una nueva contraseña para tu cuenta.</p>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <h1 className="text-4xl font-bold mb-10 text-[#152238]">Nueva contraseña</h1>

          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full border border-black rounded-xl px-6 py-5 mb-6"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-5 rounded-xl font-bold text-lg"
          >
            Actualizar contraseña
          </button>

          {message && <p className="text-center mt-6">{message}</p>}
        </form>
      </div>
    </div>
  );
}
