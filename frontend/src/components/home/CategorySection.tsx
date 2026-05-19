import CategoryCard
    from "./CategoryCard";

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
                title: "Consumo alcohol",
                reports: 168,
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
                title: "Acumulación basura",
                reports: 1248,
            },

            {
                title: "Mal olor",
                reports: 433,
            },

            {
                title: "Contaminación",
                reports: 311,
            },
        ],
    },

    {
        title: "Infraestructura",

        color: "bg-yellow-50",

        problems: [
            {
                title: "Pistas dañadas",
                reports: 842,
            },

            {
                title: "Alumbrado",
                reports: 987,
            },

            {
                title: "Veredas",
                reports: 543,
            },
        ],
    },

    {
        title: "Movilidad",

        color: "bg-blue-50",

        problems: [
            {
                title: "Congestión",
                reports: 512,
            },

            {
                title: "Autos abandonados",
                reports: 231,
            },

            {
                title: "Exceso velocidad",
                reports: 189,
            },
        ],
    },
];

export default function CategorySection() {

    return (

        <section className="space-y-12">

            {sections.map((section) => (

                <div key={section.title}>

                    <div className="
            flex
            items-center
            justify-between
            mb-6
          ">

                        <h2 className="
              text-3xl
              font-bold
            ">
                            {section.title}
                        </h2>

                        <button className="
              text-blue-700
              font-semibold
            ">
                            Ver todos
                        </button>

                    </div>

                    <div className="
            grid
            grid-cols-3
            gap-6
          ">

                        {section.problems.map((problem) => (

                            <CategoryCard
                                key={problem.title}
                                title={problem.title}
                                reports={problem.reports}
                                color={section.color}
                            />
                        ))}

                    </div>

                </div>
            ))}

        </section>
    );
}