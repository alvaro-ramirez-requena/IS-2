import { useEffect, 
        useState } from "react";
import { useNavigate } 
        from "react-router-dom";
import "../estilos/TechnicianDashboardPage.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type Work = {

    id: string;

    problemType: string;

    description: string;
    
    status: string;
    
    priority?: string;
    
    location?: string;
    
    createdAt: string;
    
    evidences: {
        
        imageUrl: string;
    } [];
};

export default function TechnicianDashboardPage() {
    const navigate = useNavigate();

    const [works, setWorks] = useState<Work[]>([]);

    const [loading,setLoading] =useState(true);
    const [selectedStatus,setSelectedStatus] = useState("APPROVED");

useEffect(() => {
    const fetchWorks = async () => {
        try {
            setLoading(true);

            const endpoint = selectedStatus === "APPROVED"
                ? `${API_URL}/api/reports/status/APPROVED`
                : `${API_URL}/api/technician/works/status/${selectedStatus}`;

            const response = await fetch(endpoint);

            const data = await response.json();
            setWorks(Array.isArray(data) ? data : []);
        } catch(error) {
            console.error (error);
            setWorks([]);
        } finally{
            setLoading(false);
        }
    };

    fetchWorks();
}, [selectedStatus]);

    const logout = () =>{
        localStorage.clear();
        navigate("/login");
    };

    const getRelativeTime = (date: string) => {
        const now = 
        new Date().getTime();

        const created = 
        new Date(date).getTime();
        
        const diff = 
        now - created;

        const minutes = 
        Math.floor(diff / 1000 / 60);
        
        const hours = 
        Math.floor(minutes / 60);
        
        const days = 
        Math.floor(hours / 24);

        if (minutes < 60) {
            return `Hace ${minutes} min`;
        }

        if (hours < 24) {
            return `Hace ${hours} horas`;
        }

        return `Hace ${days} días`;
    };

    const getStatusLabel= (status: string) => {
        switch (status) {

            case "APPROVED":
                return "Asignado";
            
            case "ACCEPTED":
                return "Aceptado";
            
            case "ON_ROUTE":
                return "En traslado";
            
            case "IN_PROGRESS":
                return "En atención";
            
            default:
                return status;
        }
    };

    if (loading) {
        return (

            <div className="technician-loading">
                
                Cargando...
            
            </div>
        );
    }

    return (
        <div className="technician-root">
            <aside className="technician-sidebar">
                <div>
                    <h1 className="technician-logo">
                        
                        reporta
                        
                        <span>Ya</span>
                    </h1>

                    <div className="technician-menu">
                        
                        <button onClick={() => 
                            setSelectedStatus("APPROVED")}>
                            
                            Trabajos asignados
                        
                        </button>

                        <button onClick={() => 
                            setSelectedStatus("ACCEPTED")}>
                            
                            Aceptados
                        
                        </button>

                        <button onClick={() => 
                            setSelectedStatus("ON_ROUTE")}>
                            
                            En traslado
                        
                        </button>

                        <button onClick={() => 
                            setSelectedStatus("IN_PROGRESS")}>

                            En atención
                        
                        </button>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="technician-logout"
                >
                    Cerrar sesión
               
                </button>
            </aside>

            <main className="technician-main">
                <h2 className="technician-title">

                    Panel del técnico
                
                </h2>

                <p className="technician-subtitle">

                    Consulta y gestión de trabajos asignados
                
                </p>

                {works.length === 0 ? (
                    <div className="technician-empty">

                        No existen trabajos para este estado.
                    
                    </div>
                ) : (
                    <div className="technician-work-list">
                        {works.map((work) => (
                            <div
                                key={work.id}
                                className="technician-work-card"
                            >
                                <img
                                    src={
                                        work.evidences?.[0]?.imageUrl ||
                                        "https://placehold.co/600x400"
                                    }
                                    alt={work.problemType}
                                    className="technician-work-image"
                                />

                                <div className="technician-work-content">
                                    <div className="technician-work-header">
                                        <div>
                                            <h3 className="technician-work-title">
                                                {work.problemType}
                                            </h3>

                                            <p className="technician-work-time">
                                                {getRelativeTime(work.createdAt)}
                                            </p>
                                        </div>

                                        <span className="technician-status">
                                            {getStatusLabel(work.status)}
                                        </span>
                                    </div>

                                    <div className="technician-work-info">
                                        {work.priority && (
                                            <p>
                                                <strong>Prioridad:</strong> {work.priority}
                                            </p>
                                        )}

                                        {work.location && (
                                            <p>
                                                <strong>Ubicación:</strong> {work.location}
                                            </p>
                                        )}
                                    </div>

                                    <div className= "technician-work-footer">
                                        <p className= "technician-work-description">
                                            {work.description}
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(`/technician/work/${work.id}`)
                                            }
                                            className="technician-detail-button"
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