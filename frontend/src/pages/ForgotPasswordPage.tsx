import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
    } catch (error: any) {
      setMessage(error.message || "No se pudo solicitar la recuperación.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#03152E] text-white flex flex-col justify-center px-20">
        <h1 className="text-5xl font-bold mb-16">
          reporta<span className="text-yellow-400">Ya</span>
        </h1>
        <h2 className="text-4xl font-bold mb-6">Recupera tu cuenta</h2>
        <p className="text-xl">Te enviaremos un enlace para restablecer tu contraseña.</p>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-[70%]">
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-full border border-black font-semibold"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-full border border-black font-semibold"
            >
              Registrarse
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-10 text-[#152238]">Restablecer contraseña</h1>

          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-black rounded-xl px-6 py-5 mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-5 rounded-xl font-bold text-lg"
          >
            Enviar enlace
          </button>

          {message && <p className="text-center mt-6">{message}</p>}
        </form>
      </div>
    </div>
  );
}
