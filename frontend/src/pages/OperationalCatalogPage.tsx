import CategorySection
    from "../components/operationalCatalog/CategorySection";

import ProblemTypeSection
    from "../components/operationalCatalog/ProblemTypeSection";

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



        </div>

    );

}