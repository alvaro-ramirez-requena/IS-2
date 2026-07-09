import { useEffect, useState } from "react";

import { SlaConfigurationService } from "../../services/sla-configuration.service";

import type { SlaConfiguration } from "../../types/sla-configuration.types";

export default function SlaConfigurationSection() {

    const [
        configurations,
        setConfigurations,
    ] = useState<SlaConfiguration[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        loadConfigurations();

    }, []);

    async function loadConfigurations() {

        try {

            const data =
                await SlaConfigurationService.getAll();


            const priorityOrder: SlaConfiguration["priority"][] = [

                "ALTO",

                "MEDIO",

                "BAJO",

            ];

            data.sort(

                (a, b) =>

                    priorityOrder.indexOf(a.priority) -

                    priorityOrder.indexOf(b.priority)

            );

            setConfigurations(data);

        } catch (error: any) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    }

    function handleHoursChange(
        id: string,
        value: number
    ) {

        setConfigurations(

            configurations.map(

                (configuration) =>

                    configuration.id === id

                        ? {

                            ...configuration,

                            responseHours: value,

                        }

                        : configuration

            )

        );

    }

    async function handleSaveConfigurations() {

        try {

            for (const configuration of configurations) {

                await SlaConfigurationService.update(

                    configuration.id,

                    {

                        responseHours:
                            configuration.responseHours,

                    }

                );

            }

            alert(
                "Configuración SLA actualizada correctamente."
            );

            await loadConfigurations();

        } catch (error: any) {

            alert(error.message);

        }

    }

    if (loading) {

        return (
            <p>
                Cargando configuración SLA...
            </p>
        );

    }

    if (error) {

        return (
            <p className="text-red-600">
                {error}
            </p>
        );

    }

    return (

        <div>

            <h2
                className="
                text-2xl
                font-bold
                mb-6
            "
            >
                Configuración SLA
            </h2>

            <div
                className="
                space-y-4
            "
            >

                {

                    configurations.map(

                        (configuration) => (

                            <div
                                key={configuration.id}
                                className="
                                border
                                rounded-xl
                                p-4
                            "
                            >

                                <div
                                    className="
                                    flex
                                    justify-between
                                    items-center
                                "
                                >

                                    <h3
                                        className="font-semibold"
                                    >
                                        {
                                            configuration.priority
                                        }
                                    </h3>

                                    <input
                                        type="number"
                                        value={
                                            configuration.responseHours
                                        }
                                        onChange={(e) =>

                                            handleHoursChange(

                                                configuration.id,

                                                Number(e.target.value)

                                            )

                                        }
                                        className="
        border
        rounded-lg
        p-2
        w-24
    "
                                    />

                                </div>

                            </div>

                        )

                    )

                }

            </div>

            <div className="mt-6">

                <button

                    onClick={handleSaveConfigurations}

                    className="
            bg-green-600
            text-white
            px-6
            py-2
            rounded-lg
        "

                >

                    Guardar cambios

                </button>

            </div>

        </div>

    );

}