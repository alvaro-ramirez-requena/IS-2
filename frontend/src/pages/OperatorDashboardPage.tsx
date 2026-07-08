import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/OperatorDashboardPage.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Report = {
    id: string;
    problemType: string;
    description: string;
    status: string;
    createdAt: string;
    evidences: {
        imageUrl: string;
    }[];
};

export default function OperatorDashboardPage() {
    const navigate = useNavigate();

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("REGISTERED");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/reports/status/${selectedStatus}`
                );

                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [selectedStatus]);

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const getRelativeTime = (date: string) => {
        const now = new Date().getTime();
        const created = new Date(date).getTime();
        const diff = now - created;

        const minutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `Hace ${minutes} min`;
        }

        if (hours < 24) {
            return `Hace ${hours} horas`;
        }

        return `Hace ${days} días`;
    };

    if (loading) {
        return (
            <div className="operator-loading">
                Cargando...
            </div>
        );
    }

    return (
        <div className="operator-root">
            <aside className="operator-sidebar">
                <div>
                    <h1 className="operator-logo">
                        reporta
                        <span>Ya</span>
                    </h1>

                    <div className="operator-menu">
                        <button onClick={() => setSelectedStatus("REGISTERED")}>
                            Pendientes
                        </button>

                        <button onClick={() => setSelectedStatus("APPROVED")}>
                            Aprobados
                        </button>

                        <button onClick={() => setSelectedStatus("REJECTED")}>
                            Rechazados
                        </button>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="operator-logout"
                >
                    Cerrar sesión
                </button>
            </aside>

            <main className="operator-main">
                <h2 className="operator-title">
                    Gestión de reportes
                </h2>

                <p className="operator-subtitle">
                    Supervisión municipal
                </p>

                {reports.length === 0 ? (
                    <div className="operator-empty">
                        No existen reportes.
                    </div>
                ) : (
                    <div className="operator-report-list">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="operator-report-card"
                            >
                                <img
                                    src={
                                        report.evidences?.[0]?.imageUrl ||
                                        "https://placehold.co/600x400"
                                    }
                                    alt={report.problemType}
                                    className="operator-report-image"
                                />

                                <div className="operator-report-content">
                                    <div className="operator-report-header">
                                        <div>
                                            <h3 className="operator-report-title">
                                                {report.problemType}
                                            </h3>

                                            <p className="operator-report-time">
                                                {getRelativeTime(report.createdAt)}
                                            </p>
                                        </div>

                                        <span className="operator-status">
                                            {report.status}
                                        </span>
                                    </div>

                                    <div className="operator-report-footer">
                                        <p className="operator-report-description">
                                            {report.description}
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(`/operator/report/${report.id}`)
                                            }
                                            className="operator-detail-button"
                                        >
                                            Ver detalle →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}