import Navbar
    from "../components/home/Navbar";

import ProblemBanner
    from "../components/home/ProblemBanner";

import CategorySection
    from "../components/home/CategorySection";

export default function HomePage() {

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

                <CategorySection />

            </main>

        </div>
    );
}