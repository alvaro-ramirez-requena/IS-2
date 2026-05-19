const problems = [
    {
        id: 1,
        title: "Acumulación de basura",
        reports: 1248,
        image:
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    },

    {
        id: 2,
        title: "Alumbrado defectuoso",
        reports: 987,
        image:
            "https://images.unsplash.com/photo-1507914372368-b2b085b925a1",
    },

    {
        id: 3,
        title: "Pistas dañadas",
        reports: 842,
        image:
            "https://images.unsplash.com/photo-1518391846015-55a9cc003b25",
    },

    {
        id: 4,
        title: "Graffitis",
        reports: 715,
        image:
            "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    },

    {
        id: 5,
        title: "Animales callejeros",
        reports: 612,
        image:
            "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    },

    {
        id: 6,
        title: "Veredas dañadas",
        reports: 543,
        image:
            "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    },

    {
        id: 7,
        title: "Congestión vehicular",
        reports: 512,
        image:
            "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    },
];

export default function ProblemBanner() {

    return (

        <section className="mb-12">

            <h2 className="
        text-5xl
        font-bold
        mb-4
      ">
                Los 7 problemas más graves
                en Miraflores
            </h2>

            <p className="
        text-gray-500
        text-xl
        mb-8
      ">
                Basado en reportes ciudadanos
                y análisis recientes
            </p>

            <div className="
        grid
        grid-cols-7
        gap-4
      ">

                {problems.map((problem) => (

                    <div
                        key={problem.id}
                        className="
      relative
      h-[420px]
      rounded-3xl
      overflow-hidden
      text-white
      p-4
      flex
      flex-col
      justify-end
      shadow-lg
      bg-cover
      bg-center
    "
                        style={{
                            backgroundImage:
                                `linear-gradient(
                to top,
                rgba(0,0,0,0.8),
                rgba(0,0,0,0.2)
            ),
            url(${problem.image})`,
                        }}
                    >

                        <div className="
              absolute
              top-4
              left-4
              bg-white
              text-black
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              font-bold
            ">
                            {problem.id}
                        </div>

                        <h3 className="
              text-3xl
              font-bold
            ">
                            {problem.title}
                        </h3>

                        <p className="
              text-xl
              mt-2
            ">
                            {problem.reports} reportes
                        </p>

                    </div>
                ))}

            </div>

        </section>
    );
}