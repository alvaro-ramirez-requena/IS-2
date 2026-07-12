import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TechnicianDashboardPage from "./TechnicalDashboardPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TechnicianDashboardPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockNavigate.mockReset();
    vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("muestra el título y los trabajos cargados", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "1",
          problemType: "Fuga de agua",
          description: "Reporte de fuga",
          status: "APPROVED",
          priority: "Alta",
          location: "Calle 123",
          createdAt: "2026-07-10T10:00:00.000Z",
          evidences: [{ imageUrl: "https://example.com/1.jpg" }],
        },
      ],
    } as Response);

    render(
      <MemoryRouter>
        <TechnicianDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Cargando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Panel del técnico")).toBeInTheDocument();
      expect(screen.getByText("Fuga de agua")).toBeInTheDocument();
    });

    expect(screen.getByText("Trabajos asignados")).toBeInTheDocument();
    expect(screen.getByText("Prioridad:")).toBeInTheDocument();
    expect(screen.getByText("Ubicación:")).toBeInTheDocument();
  });

  it("llama al logout y navega al login", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(
      <MemoryRouter>
        <TechnicianDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No existen trabajos para este estado.")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(localStorage.clear).toBeCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("inicia el traslado cuando se pulsa el botón correspondiente", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "10",
            problemType: "Fuga de gas",
            description: "Reporte prioritizado",
            status: "PRIORITIZED",
            createdAt: "2026-07-10T10:00:00.000Z",
            evidences: [],
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

    render(
      <MemoryRouter>
        <TechnicianDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Fuga de gas")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /iniciar traslado/i }));

    await waitFor(() => {
      expect(screen.queryByText("Fuga de gas")).not.toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/reports/10/status"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "RESOLVED" }),
      })
    );
  });
});
