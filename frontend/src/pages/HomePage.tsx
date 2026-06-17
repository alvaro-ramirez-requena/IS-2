import Navbar
    from "../components/home/Navbar";

import ProblemBanner
    from "../components/home/ProblemBanner";

import CategorySection
    from "../components/home/CategorySection";

import { useNavigate }
    from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();

    return (

        <div className="
      min-h-screen
      bg-[#F5F7FA]
    ">

            <Navbar />

            <main className="
  max-w-[1700px]
  mx-auto
  px-12
  py-10
  space-y-16
">

                <ProblemBanner />

                <div className="
    flex
    flex-wrap
    justify-center
    gap-6
    mb-12
">

                    <button
                        onClick={() => navigate("/reports/create")}
                        className="
    bg-red-700
    hover:bg-red-800
    text-white
    rounded-2xl
    p-6
    text-left
    transition
  ">

                        <p className="
      text-4xl
      font-bold
    ">
                            +
                        </p>

                        <h3 className="
      text-2xl
      font-semibold
      mt-4
    ">
                            Crear reporte
                        </h3>

                        <p className="mt-2 text-red-100">
                            Reporta un problema en tu distrito
                        </p>

                    </button>

                    <button

                        onClick={() =>
                            navigate("/my-reports")
                        }

                        className="
    bg-white
    hover:bg-gray-50
    border
    rounded-2xl
    p-6
    text-left
    transition
  "
                    >

                        <p className="
      text-4xl
      font-bold
    ">
                            📄
                        </p>

                        <h3 className="
      text-2xl
      font-semibold
      mt-4
    ">
                            Mis reportes
                        </h3>

                        <p className="
      mt-2
      text-gray-500
    ">
                            Consulta y da seguimiento
                        </p>

                    </button>

                </div>

                <CategorySection />

            </main>

        </div>
    );
}