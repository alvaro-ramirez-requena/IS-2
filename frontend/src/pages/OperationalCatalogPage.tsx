import CategorySection
    from "../components/operationalCatalog/CategorySection";

import ProblemTypeSection
    from "../components/operationalCatalog/ProblemTypeSection";

import ClosureReasonSection
    from "../components/operationalCatalog/ClosureReasonSection";

import SlaConfigurationSection
    from "../components/operationalCatalog/SlaConfigurationSection";

export default function OperationalCatalogPage() {

    return (

        <div
            className="
                max-w-7xl
                mx-auto
                p-8
            "
        >

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-8
                "
            >
                Catálogo Operativo
            </h1>

            <CategorySection />

            <div className="mt-12">

                <ProblemTypeSection />

            </div>

            <div className="mt-12">

                <ClosureReasonSection />

            </div>


            <div className="mt-12">

                <SlaConfigurationSection />

            </div>



        </div>

    );

}