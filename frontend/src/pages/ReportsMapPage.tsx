import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";

import Navbar from "../components/home/Navbar";

import { statusLabels } from "../utils/reportLabels";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API_BASE = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type MapReport = {
  id: string;
  title: string;
  problemType: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  address?: string;
  createdAt: string;
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: -12.0464,
  lng: -77.0428,
};

function getDistanceInKm(
  pointA: {
    lat: number;
    lng: number;
  },
  pointB: {
    lat: number;
    lng: number;
  }
) {
  const earthRadiusKm = 6371;

  const dLat = ((pointB.lat - pointA.lat) * Math.PI) / 180;

  const dLng = ((pointB.lng - pointA.lng) * Math.PI) / 180;

  const lat1 = (pointA.lat * Math.PI) / 180;

  const lat2 = (pointB.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export default function ReportsMapPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const [reports, setReports] = useState<MapReport[]>([]);

  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);

  const [loading, setLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const [filteredReports, setFilteredReports] = useState<MapReport[]>([]);

  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/reports/map/locations`);

        if (!response.ok) {
          throw new Error("No se pudieron cargar los reportes del mapa.");
        }

        const data = await response.json();

        setReports(data);
        setFilteredReports(data);

        if (data.length > 0) {
          setSelectedReport(data[0]);

          setMapCenter({
            lat: data[0].latitude,
            lng: data[0].longitude,
          });
        }
      } catch (error) {
        console.error("Error cargando reportes del mapa:", error);

        setReports([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!isLoaded || reports.length === 0) {
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    if (query.length === 0) {
      setFilteredReports(reports);

      if (reports.length > 0) {
        setSelectedReport(reports[0]);

        setMapCenter({
          lat: reports[0].latitude,
          lng: reports[0].longitude,
        });
      }

      setSearchMessage("");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        address: searchQuery,
        componentRestrictions: {
          country: "PE",
        },
      },
      (results, status) => {
        let searchedPoint: {
          lat: number;
          lng: number;
        } | null = null;

        if (status === "OK" && results && results.length > 0) {
          const location = results[0].geometry.location;

          searchedPoint = {
            lat: location.lat(),
            lng: location.lng(),
          };

          setMapCenter(searchedPoint);
        }

        const nearbyReports = reports.filter((report) => {
          const title = report.title?.toLowerCase() || "";

          const problemType = report.problemType?.toLowerCase() || "";

          const address = report.address?.toLowerCase() || "";

          const description = report.description?.toLowerCase() || "";

          const matchesText =
            title.includes(query) ||
            problemType.includes(query) ||
            address.includes(query) ||
            description.includes(query);

          if (matchesText) {
            return true;
          }

          if (!searchedPoint) {
            return false;
          }

          const reportPoint = {
            lat: report.latitude,
            lng: report.longitude,
          };

          const distance = getDistanceInKm(searchedPoint, reportPoint);

          return distance <= 10;
        });

        setFilteredReports(nearbyReports);

        setSelectedReport(nearbyReports.length > 0 ? nearbyReports[0] : null);

        setSearchMessage(
          nearbyReports.length > 0
            ? `Mostrando reportes relacionados con "${searchQuery}".`
            : `No se encontraron reportes relacionados con "${searchQuery}".`
        );
      }
    );
  }, [isLoaded, reports, searchQuery]);

  if (loadError) {
    return (
      <div
        className="
                min-h-screen
                bg-gray-100
            "
      >
        <Navbar />

        <main
          className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-10
                "
        >
          <div
            className="
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        rounded-2xl
                        p-6
                    "
          >
            No se pudo cargar Google Maps. Revisa que tengas activada la Maps JavaScript API y que
            tu API key sea válida.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="
            min-h-screen
            bg-gray-100
        "
    >
      <Navbar />

      <main
        className="
                max-w-7xl
                mx-auto
                px-6
                py-10
            "
      >
        <div
          className="
                    mb-8
                "
        >
          <button
            onClick={() => navigate("/home")}
            className="
                            mb-5
                            text-blue-700
                            font-semibold
                            hover:underline
                        "
          >
            ← Volver al dashboard
          </button>

          <p
            className="
                        text-blue-700
                        font-semibold
                        text-sm
                    "
          >
            Reportes georreferenciados
          </p>

          <h1
            className="
                        text-4xl
                        font-bold
                        text-[#03152E]
                        mt-2
                    "
          >
            Mapa de reportes ciudadanos
          </h1>

          <p
            className="
                        text-gray-600
                        mt-3
                    "
          >
            Visualiza reportes registrados con ubicación para identificar incidencias cercanas en tu
            zona.
          </p>

          {searchMessage && (
            <div
              className="
                            mt-4
                            bg-blue-50
                            border
                            border-blue-200
                            text-blue-700
                            rounded-xl
                            px-4
                            py-3
                            text-sm
                            font-medium
                        "
            >
              {searchMessage}
            </div>
          )}
        </div>

        {!isLoaded ? (
          <div
            className="
                            bg-white
                            border
                            rounded-2xl
                            p-8
                            text-gray-600
                        "
          >
            Cargando Google Maps...
          </div>
        ) : loading ? (
          <div
            className="
                            bg-white
                            border
                            rounded-2xl
                            p-8
                            text-gray-600
                        "
          >
            Cargando reportes...
          </div>
        ) : reports.length === 0 ? (
          <div
            className="
                        bg-white
                        border
                        rounded-2xl
                        p-8
                        text-gray-600
                    "
          >
            No hay reportes con ubicación registrada.
          </div>
        ) : (
          <div
            className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_380px]
                        gap-6
                    "
          >
            <section
              className="
                            bg-white
                            border
                            rounded-2xl
                            overflow-hidden
                            shadow-sm
                        "
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={searchQuery ? 13 : 15}
              >
                {filteredReports.map((report) => (
                  <Marker
                    key={report.id}
                    position={{
                      lat: report.latitude,
                      lng: report.longitude,
                    }}
                    title={report.title || report.problemType}
                    onClick={() => setSelectedReport(report)}
                  />
                ))}

                {selectedReport && (
                  <InfoWindow
                    position={{
                      lat: selectedReport.latitude,
                      lng: selectedReport.longitude,
                    }}
                    onCloseClick={() => setSelectedReport(null)}
                  >
                    <div
                      className="
                                            max-w-[240px]
                                        "
                    >
                      <h3
                        className="
                                                font-bold
                                                text-[#03152E]
                                                text-base
                                                mb-1
                                            "
                      >
                        {selectedReport.title || selectedReport.problemType}
                      </h3>

                      <p
                        className="
                                                text-sm
                                                text-gray-600
                                                mb-1
                                            "
                      >
                        {selectedReport.problemType}
                      </p>

                      <p
                        className="
                                                text-sm
                                                text-gray-500
                                                mb-2
                                            "
                      >
                        {selectedReport.address || "Ubicación registrada por coordenadas."}
                      </p>

                      <button
                        onClick={() =>
                          navigate(
                            `/reports/problem/${encodeURIComponent(
                              selectedReport.problemType
                            )}?highlight=${selectedReport.id}`
                          )
                        }
                        className="
                                                    text-blue-600
                                                    font-semibold
                                                    text-sm
                                                "
                      >
                        Ver detalle
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </section>

            <aside
              className="
                            bg-white
                            border
                            rounded-2xl
                            p-5
                            shadow-sm
                            max-h-[600px]
                            overflow-y-auto
                        "
            >
              <h2
                className="
                                text-xl
                                font-bold
                                text-[#03152E]
                                mb-4
                            "
              >
                Reportes encontrados
              </h2>

              <div
                className="
                                space-y-3
                            "
              >
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`
                                            w-full
                                            text-left
                                            border
                                            rounded-xl
                                            p-4
                                            transition
                                            ${
                                              selectedReport?.id === report.id
                                                ? "bg-blue-50 border-blue-400"
                                                : "bg-white hover:bg-gray-50"
                                            }
                                        `}
                  >
                    <p
                      className="
                                            font-bold
                                            text-[#03152E]
                                        "
                    >
                      {report.title || report.problemType}
                    </p>

                    <p
                      className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        "
                    >
                      {report.problemType}
                    </p>

                    <p
                      className="
                                            text-sm
                                            text-gray-600
                                            mt-2
                                            line-clamp-2
                                        "
                    >
                      {report.address || "Ubicación registrada por coordenadas."}
                    </p>

                    <div
                      className="
                                            mt-4
                                            flex
                                            justify-between
                                            items-center
                                            gap-4
                                        "
                    >
                      <span
                        className="
                                                text-xs
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-yellow-100
                                                text-yellow-700
                                                font-semibold
                                            "
                      >
                        {statusLabels[report.status as keyof typeof statusLabels] || report.status}
                      </span>

                      <span
                        onClick={(event) => {
                          event.stopPropagation();

                          navigate(
                            `/reports/problem/${encodeURIComponent(
                              report.problemType
                            )}?highlight=${report.id}`
                          );
                        }}
                        className="
                                                    text-sm
                                                    text-blue-600
                                                    font-semibold
                                                    hover:underline
                                                "
                      >
                        Ver detalle
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
