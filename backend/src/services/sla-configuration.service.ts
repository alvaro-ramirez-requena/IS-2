import { Priority } from "@prisma/client";
import { SlaConfigurationRepository } from "../repositories/sla-configuration.repository";

export class SlaConfigurationService {

    private slaConfigurationRepository =
        new SlaConfigurationRepository();

    async getAll() {
        return await this
            .slaConfigurationRepository
            .getAll();
    }

    async getById(id: string) {

        const configuration =
            await this
                .slaConfigurationRepository
                .getById(id);

        if (!configuration) {
            throw new Error(
                "Configuración SLA no encontrada"
            );
        }

        return configuration;
    }

    async update(
        id: string,
        data: {
            responseHours: number;
        }
    ) {

        const configuration =
            await this
                .slaConfigurationRepository
                .getById(id);

        if (!configuration) {
            throw new Error(
                "Configuración SLA no encontrada"
            );
        }

        if (data.responseHours <= 0) {
            throw new Error(
                "Las horas de respuesta deben ser mayores a cero"
            );
        }

        return await this
            .slaConfigurationRepository
            .update(id, data);
    }

    async getByPriority(
        priority: Priority
    ) {

        const configuration =
            await this
                .slaConfigurationRepository
                .getByPriority(priority);

        if (!configuration) {
            throw new Error(
                "Configuración SLA no encontrada"
            );
        }

        return configuration;
    }

}