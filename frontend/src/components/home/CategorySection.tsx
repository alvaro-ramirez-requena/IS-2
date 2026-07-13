import { useRef, useEffect, useState } from "react";

import CategoryCard from "./CategoryCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type TopProblem = {
  problemType: string;

  _count: {
    problemType: number;
  };
};

const sections = [
  {
    title: "Seguridad ciudadana",

    color: "bg-red-50",

    problems: [
      {
        title: "Robos y asaltos",
        reports: 320,
      },

      {
        title: "Consumo de alcohol en la vía pública",
        reports: 168,
      },

      {
        title: "Venta ambulante no autorizada",
        reports: 175,
      },

      {
        title: "Personas sospechosas",
        reports: 142,
      },

      {
        title: "Ruidos molestos",
        reports: 123,
      },
    ],
  },

  {
    title: "Ambiente y limpieza",

    color: "bg-green-50",

    problems: [
      {
        title: "Acumulación de basura",
        reports: 1248,
      },

      {
        title: "Mal olor en la vía pública",
        reports: 433,
      },

      {
        title: "Contaminación de áreas verdes",
        reports: 311,
      },

      {
        title: "Residuos fuera de contenedores",
        reports: 276,
      },

      {
        title: "Quema de residuos",
        reports: 103,
      },
    ],
  },

  {
    title: "Infraestructura",

    color: "bg-yellow-50",

    problems: [
      {
        title: "Pistas en mal estado",
        reports: 842,
      },

      {
        title: "Alumbrado público defectuoso",
        reports: 987,
      },

      {
        title: "Veredas en mal estado",
        reports: 543,
      },

      {
        title: "Semáforos inoperativos",
        reports: 312,
      },

      {
        title: "Señalización dañada",
        reports: 256,
      },
    ],
  },

  {
    title: "Movilidad",

    color: "bg-blue-50",

    problems: [
      {
        title: "Congestión vehicular",
        reports: 512,
      },

      {
        title: "Autos abandonados",
        reports: 231,
      },

      {
        title: "Exceso de velocidad",
        reports: 189,
      },

      {
        title: "Estacionamiento en zonas prohibidas",
        reports: 398,
      },

      {
        title: "Transporte público deficiente",
        reports: 264,
      },
    ],
  },
];

export default function CategorySection() {
  const [topProblems, setTopProblems] = useState<TopProblem[]>([]);

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scroll = (index: number, direction: "left" | "right") => {
    const container = scrollRefs.current[index];

    if (!container) {
      return;
    }

    const scrollAmount = container.clientWidth;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,

      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchTopProblems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reports/top-problems`);

        const data = await response.json();

        setTopProblems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopProblems();
  }, []);

  return (
    <section className="space-y-12">
      {sections.map((section, index) => (
        <div key={section.title}>
          <div
            className="
    flex
    items-center
    justify-between
    mb-6
"
          >
            <h2
              className="
              text-3xl
              font-bold
            "
            >
              {section.title}
            </h2>

            <div
              className="
    flex
    items-center
    gap-4
"
            >
              <div
                className="
        flex
        items-center
        gap-3
    "
              >
                <button
                  onClick={() => scroll(index, "left")}

                  className="
                w-10
                h-10
                rounded-full
                border
                bg-white
                hover:bg-gray-100
                font-bold
            "
                >
                  ←
                </button>

                <button
                  onClick={() => scroll(index, "right")}

                  className="
                w-10
                h-10
                rounded-full
                border
                bg-white
                hover:bg-gray-100
                font-bold
            "
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              scrollRefs.current[index] = el;
            }}

            className="
        flex
        gap-6
        overflow-x-auto
        scrollbar-hide
        snap-x
        snap-mandatory
        pb-2
    "
          >
            {section.problems.map((problem) => (
              <div
                key={problem.title}

                className="
    min-w-[calc(33.333%-16px)]
    flex-shrink-0
    snap-start
"
              >
                <CategoryCard
                  title={problem.title}
                  reports={
                    topProblems.find((topProblem) => topProblem.problemType === problem.title)
                      ?._count.problemType || 0
                  }
                  color={section.color}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
