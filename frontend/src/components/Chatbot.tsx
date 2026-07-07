import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Message {
  role: "user" | "bot";
  text: string;
}

// Detecta la página y el ID según la URL actual
function getPageContext(pathname: string): { page: string; pageId?: string } {
  if (pathname === "/home") return { page: "home" };
  if (pathname === "/my-reports") return { page: "my-reports", pageId: localStorage.getItem("userId") || undefined };
  if (pathname === "/operator") return { page: "operator" };
  if (pathname.startsWith("/operator/report/")) return { page: "operator-detail", pageId: pathname.split("/").pop() };
  if (pathname.startsWith("/fieldwork/")) return { page: "fieldwork", pageId: pathname.split("/").pop() };
  if (pathname === "/reports/create") return { page: "create-report" };
  return { page: "general" };
}

// Mensajes de bienvenida según la página
function getWelcomeMessage(page: string, role: string): string {
  if (role === "OPERATOR") {
    if (page === "operator") return "Hola, soy tu asistente municipal. ¿Quieres saber cuántos reportes están pendientes o cuáles son los más urgentes?";
    if (page === "operator-detail") return "Estoy revisando este reporte contigo. ¿Tienes dudas sobre aprobarlo o rechazarlo?";
  }
  if (role === "TECHNICIAN") {
    if (page === "fieldwork") return "Estoy aquí para ayudarte con este trabajo en campo. ¿Qué necesitas saber?";
  }
  if (page === "my-reports") return "Puedo ayudarte a entender el estado de tus reportes. ¿Qué quieres saber?";
  if (page === "create-report") return "Estás creando un reporte. El proceso tiene 4 pasos: Información, Ubicación, Evidencia y Confirmar. ¿Tienes alguna duda sobre algún paso?";
  if (page === "home") return "Hola, soy el asistente de ReportaYa. ¿En qué puedo ayudarte hoy?";
  return "Hola, soy el asistente de ReportaYa. ¿En qué puedo ayudarte?";
}

export default function Chatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const role = localStorage.getItem("role") || "CITIZEN";
  const { page, pageId } = getPageContext(location.pathname);

  // Reinicia el chat al cambiar de página
  useEffect(() => {
    const welcome = getWelcomeMessage(page, role);
    setMessages([{ role: "bot", text: welcome }]);
    setInput("");
  }, [location.pathname]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    // Historial sin el mensaje de bienvenida inicial
    const history = messages
      .slice(1)
      .map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }));

    try {
      const res = await fetch(`${API}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history,
          role,
          page,
          pageId,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Hubo un error al procesar tu mensaje. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  // No mostrar en login ni register
  if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <>
      {/* ── Botón flotante ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
        title="Asistente ReportaYa"
      >
        {isOpen ? (
          // X para cerrar
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Ícono de chat
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* ── Ventana del chat ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistente ReportaYa</p>
              <p className="text-blue-200 text-xs">Siempre disponible</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
  msg.role === "user"
    ? "bg-blue-600 text-white rounded-br-sm"
    : "bg-gray-100 text-gray-800 rounded-bl-sm"
}`}>
  {msg.role === "bot" ? (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{
        __html: msg.text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n\n/g, "<br/><br/>")
          .replace(/\n(\d+\.)/g, "<br/>$1")
          .replace(/\n-/g, "<br/>•")
      }}
    />
  ) : (
    msg.text
  )}
</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white rounded-xl px-3 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
