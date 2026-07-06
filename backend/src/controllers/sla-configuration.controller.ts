import { Request, Response } from "express";
import { Priority } from "@prisma/client";
import { SlaConfigurationService } from "../services/sla-configuration.service";

const slaConfigurationService =
    new SlaConfigurationService();

export class SlaConfigurationController {

    static async getAll(
        req: Request,
        res: Response
    ) {
        try {

            const configurations =
                await slaConfigurationService.getAll();

            res.json(configurations);

        } catch (error: any) {

            res.status(400).json({
                message: error.message,
            });

        }
    }

    static async getById(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                req.params.id as string;

            const configuration =
                await slaConfigurationService.getById(id);

            res.json(configuration);

        } catch (error: any) {

            res.status(400).json({
                message: error.message,
            });

        }
    }

    static async getByPriority(
        req: Request,
        res: Response
    ) {
        try {

            const priority =
                req.params.priority as Priority;

            const configuration =
                await slaConfigurationService.getByPriority(priority);

            res.json(configuration);

        } catch (error: any) {

            res.status(400).json({
                message: error.message,
            });

        }
    }

    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const id =
                req.params.id as string;

            const configuration =
                await slaConfigurationService.update(
                    id,
                    req.body
                );

            res.json(configuration);

        } catch (error: any) {

            res.status(400).json({
                message: error.message,
            });

        }
    }

}