import { TechnicalClosureRepository } from "../repositories/technical-closure.repository";

import {
  isFollowUpReason,
  normalizeClosureResult,
  validateBasicClosureFields,
  validateFollowUpRequirement,
} from "../utils/technicalClosure.utils";

const technicalClosureRepository = new TechnicalClosureRepository();

type CreateTechnicalClosureInput = {
  reportId: string;
  technicianId: string;
  result?: string;
  closureReasonId?: string;
  observations: string;
  closureEvidenceUrl?: string;
  followUpNotes?: string;
};


export class TechnicalClosureService {
  async createClosure(data: CreateTechnicalClosureInput) {
    validateBasicClosureFields(data);

    let result = data.result?.trim();

    let followUpRequired = false;

    if (data.closureReasonId) {
      const closureReason = await technicalClosureRepository.findClosureReasonById(
        data.closureReasonId
      );

      if (!closureReason) {
        throw new Error("El motivo de cierre seleccionado no existe.");
      }

      if (!closureReason.active) {
        throw new Error("El motivo de cierre seleccionado está inactivo.");
      }

      result = closureReason.name;

      followUpRequired = isFollowUpReason(closureReason.name);
    }

    result = normalizeClosureResult(result);

    const followUpNotes =
      validateFollowUpRequirement(
        followUpRequired,
        data.followUpNotes
      );

    return await technicalClosureRepository.create({
      reportId: data.reportId,

      technicianId: data.technicianId,

      result,

      closureReasonId: data.closureReasonId,

      observations: data.observations.trim(),

      closureEvidenceUrl: data.closureEvidenceUrl,

      followUpRequired,

      followUpNotes,
    });
  }

  async getByReportId(reportId: string) {
    return await technicalClosureRepository.findByReportId(reportId);
  }
}
