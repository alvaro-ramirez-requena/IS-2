import {
    useRef,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

type TopProblem = {

    problemType: string;

    _count: {

        problemType: number;
    };
};

export default function ProblemBanner() {

    const scrollRef =



        useRef<HTMLDivElement | null>(
            null
        );

    const navigate =
        useNavigate();

    const [problems, setProblems] =
        useState<TopProblem[]>([]);

    const scroll = (
        direction: "left" | "right"
    ) => {

        const container =
            scrollRef.current;

        if (!container) {
            return;
        }

        const scrollAmount =
            container.clientWidth;

        container.scrollBy({

            left:
                direction === "left"
                    ? -scrollAmount
                    : scrollAmount,

            behavior: "smooth",
        });
    };

    useEffect(() => {

        const fetchTopProblems =
            async () => {

                try {

                    const response =
                        await fetch(

                            `${API_URL}/api/reports/top-problems`
                        );

                    const data =
                        await response.json();

                    setProblems(data);

                } catch (error) {

                    console.error(error);
                }
            };

        fetchTopProblems();

    }, []);

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

            <div className="relative">

                <button
                    onClick={() =>
                        scroll("left")
                    }

                    className="
            hidden
            md:flex
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            z-10
            w-12
            h-12
            rounded-full
            bg-white
            shadow-lg
            items-center
            justify-center
            font-bold
        "
                >
                    ←
                </button>

                <button
                    onClick={() =>
                        scroll("right")
                    }

                    className="
            hidden
            md:flex
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            z-10
            w-12
            h-12
            rounded-full
            bg-white
            shadow-lg
            items-center
            justify-center
            font-bold
        "
                >
                    →
                </button>

                <div

                    ref={scrollRef}

                    className="
            flex
            gap-4
            overflow-x-auto
            snap-x
            snap-mandatory
            scroll-smooth
            pb-2
        "
                >

                    {problems.map((
                        problem,
                        index
                    ) => (

                        <div
                            key={problem.problemType}

                            onClick={() =>

                                navigate(

                                    `/reports/problem/${encodeURIComponent(
                                        problem.problemType
                                    )}`
                                )
                            }

                            className="
                    min-w-full
                    sm:min-w-[48%]
                    md:min-w-[31%]
                    lg:min-w-[22%]
                    xl:min-w-[14%]
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
                    snap-start
                    flex-shrink-0
                    cursor-pointer
hover:scale-[1.02]
transition
                "

                            style={{
                                backgroundImage:
                                    `linear-gradient(
            to top,
            rgba(0,0,0,0.8),
            rgba(0,0,0,0.2)
        ),
        url(https://images.unsplash.com/photo-1518391846015-55a9cc003b25)`,
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
                                {index + 1}
                            </div>

                            <h3 className="
                    text-3xl
                    font-bold
                ">
                                {problem.problemType}
                            </h3>

                            <p className="
                    text-xl
                    mt-2
                ">
                                {
                                    problem._count.problemType
                                } reportes
                            </p>

                        </div>


                    ))}

                </div>

            </div>

        </section>
    );
}