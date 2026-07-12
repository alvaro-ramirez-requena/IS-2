import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TechnicalReportDetailPage from "./TechnicalReportDetailPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TechnicalReportDetailPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockNavigate.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renderiza los datos del trabajo y permite volver", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "42",
        problemType: "Bache en la avenida",
        description: "Necesita reparación",
        status: "APPROVED",
        priority: "Media",
        location: "Avenida 5",
        latitude: 10.1,
        longitude: 20.2,
        createdAt: "2026-07-10T10:00:00.000Z",
        evidences: [{ imageUrl: "https://example.com/evidence.jpg" }],
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={["/work/42"]}>
        <Routes>
          <Route path="/work/:id" element={<TechnicalReportDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Cargando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Bache en la avenida")).toBeInTheDocument();
    });

    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(screen.getByText("Detalles")).toBeInTheDocument();
    expect(screen.getByText("Necesita reparación")).toBeInTheDocument();
    expect(screen.getByText("Avenida 5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /volver/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/technician");
  });

  it("muestra mensaje cuando no existe el trabajo", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    } as Response);

    render(
      <MemoryRouter initialEntries={["/work/99"]}>
        <Routes>
          <Route path="/work/:id" element={<TechnicalReportDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Trabajo no encontrado")).toBeInTheDocument();
    });
  });

  it("acepta el trabajo y navega al panel técnico", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "42",
          problemType: "Bache en la avenida",
          description: "Necesita reparación",
          status: "APPROVED",
          priority: "Media",
          location: "Avenida 5",
          evidences: [{ imageUrl: "https://example.com/evidence.jpg" }],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

    render(
      <MemoryRouter initialEntries={["/work/42"]}>
        <Routes>
          <Route path="/work/:id" element={<TechnicalReportDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Bache en la avenida")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /aceptar trabajo/i }));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/reports/42/status"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "PRIORITIZED" }),
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/technician");
  });

  it("no navega si falla la actualización del estado", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "42",
          problemType: "Bache en la avenida",
          description: "Necesita reparación",
          status: "APPROVED",
          evidences: [],
        }),
      } as Response)
      .mockRejectedValueOnce(new Error("fail"));

    render(
      <MemoryRouter initialEntries={["/work/42"]}>
        <Routes>
          <Route path="/work/:id" element={<TechnicalReportDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Bache en la avenida")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /aceptar trabajo/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
