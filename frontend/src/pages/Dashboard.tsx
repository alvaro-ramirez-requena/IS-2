import React from "react";
import {
  Bell,
  ChevronDown,
  MapPin,
  Search,
  CirclePlus,
  FileText,
  Sparkles,
  HelpCircle,
  Shield,
  Trees,
  Building2,
  Car,
  Trash2,
  Lightbulb,
  Dog,
  TrafficCone,
  Users,
  Flame,
  Store,
  Volume2,
  ParkingCircle,
  Bike,
} from "lucide-react";
import "./dashboard.css";

type Item = {
  title: string;
  reports: number;
  icon: React.ElementType;
};

type Category = {
  title: string;
  icon: React.ElementType;
  color: string;
  items: Item[];
};

const topProblems = [
  {
    rank: 1,
    title: "Acumulación de basura",
    reports: "1,248 reportes",
    category: "Ambiente",
    icon: Trash2,
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 2,
    title: "Alumbrado público defectuoso",
    reports: "987 reportes",
    category: "Infraestructura",
    icon: Lightbulb,
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 3,
    title: "Pistas en mal estado",
    reports: "842 reportes",
    category: "Infraestructura",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 4,
    title: "Grafitis en espacios públicos",
    reports: "715 reportes",
    category: "Seguridad",
    icon: Shield,
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 5,
    title: "Animales en situación de calle",
    reports: "612 reportes",
    category: "Ambiente",
    icon: Dog,
    image:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 6,
    title: "Veredas en mal estado",
    reports: "543 reportes",
    category: "Infraestructura",
    icon: TrafficCone,
    image:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=900&q=80",
  },
  {
    rank: 7,
    title: "Congestión vehicular",
    reports: "512 reportes",
    category: "Movilidad",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=900&q=80",
  },
];

const quickActions = [
  { title: "Crear reporte", subtitle: "Reporta un problema", icon: CirclePlus, active: true },
  { title: "Mis reportes", subtitle: "Consulta seguimiento", icon: FileText },
  { title: "Cerca de ti", subtitle: "Ve problemas cercanos", icon: MapPin },
  { title: "Recomendaciones", subtitle: "Consejos útiles", icon: Sparkles },
  { title: "Cómo funciona", subtitle: "Guía rápida", icon: HelpCircle },
];

const categories: Category[] = [
  {
    title: "Seguridad ciudadana",
    icon: Shield,
    color: "rose",
    items: [
      { title: "Robos y asaltos", reports: 320, icon: Shield },
      { title: "Consumo de alcohol en vía pública", reports: 198, icon: Flame },
      { title: "Venta ambulante no autorizada", reports: 175, icon: Store },
      { title: "Personas sospechosas", reports: 142, icon: Users },
      { title: "Ruidos molestos", reports: 123, icon: Volume2 },
    ],
  },
  {
    title: "Ambiente y limpieza",
    icon: Trees,
    color: "green",
    items: [
      { title: "Acumulación de basura", reports: 1248, icon: Trash2 },
      { title: "Mal olor en la vía pública", reports: 421, icon: Flame },
      { title: "Contaminación de áreas verdes", reports: 311, icon: Trees },
      { title: "Residuos fuera de contenedores", reports: 278, icon: Trash2 },
      { title: "Quema de residuos", reports: 193, icon: Flame },
    ],
  },
  {
    title: "Infraestructura y servicios",
    icon: Building2,
    color: "amber",
    items: [
      { title: "Alumbrado público defectuoso", reports: 987, icon: Lightbulb },
      { title: "Pistas en mal estado", reports: 842, icon: Building2 },
      { title: "Veredas en mal estado", reports: 543, icon: TrafficCone },
      { title: "Semáforos inoperativos", reports: 312, icon: TrafficCone },
      { title: "Señalización dañada", reports: 256, icon: Bike },
    ],
  },
  {
    title: "Movilidad y tránsito",
    icon: Car,
    color: "blue",
    items: [
      { title: "Congestión vehicular", reports: 512, icon: Car },
      { title: "Estacionamiento en zonas prohibidas", reports: 398, icon: ParkingCircle },
      { title: "Transporte público deficiente", reports: 284, icon: Building2 },
      { title: "Autos abandonados", reports: 231, icon: Car },
      { title: "Exceso de velocidad", reports: 189, icon: Car },
    ],
  },
];

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="sectionHeader">
      <div className="sectionTitle">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      <button className="linkButton">Ver todos</button>
    </div>
  );
}

function ProblemItem({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <div className="problemItem">
      <div className="problemIcon">
        <Icon size={22} />
      </div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.reports.toLocaleString()} reportes</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboardPage">
      <header className="topbar">
        <div className="brand">
          reporta<span>Ya</span>
        </div>

        <button className="districtBtn">
          <MapPin size={16} />
          Miraflores
          <ChevronDown size={16} />
        </button>

        <div className="searchBox">
          <Search size={16} className="searchIcon" />
          <input placeholder="Buscar reportes, problemas o lugares..." />
        </div>

        <button className="notifBtn">
          <Bell size={18} />
          <span>Notificaciones</span>
          <span className="notifBadge">3</span>
        </button>

        <button className="userBtn">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80"
            alt="Usuario"
          />
          <div className="userInfo">
            <small>Hola,</small>
            <strong>Juan</strong>
          </div>
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="heroOverlay" />
          <div className="heroContent">
            <h1>Los 7 problemas más graves en Miraflores</h1>
            <p>Basado en reportes ciudadanos y análisis recientes</p>

            <div className="topGrid">
              {topProblems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.rank} className="topCard" style={{ backgroundImage: `url(${item.image})` }}>
                    <div className="topCardShade" />
                    <div className="rankBubble">{item.rank}</div>
                    <div className="topCardContent">
                      <span className="miniTag">
                        <Icon size={12} />
                        {item.category}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.reports}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="actionsSection">
          <div className="actionsCard">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  className={`actionItem ${action.active ? "active" : ""}`}
                >
                  <div className="actionIcon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="categoriesSection">
          {categories.map((section) => (
            <div key={section.title} className="categoryBlock">
              <SectionHeader title={section.title} icon={section.icon} />
              <div className="problemGrid">
                {section.items.map((item) => (
                  <ProblemItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}