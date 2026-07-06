import { ClosureReasonRepository } from "../repositories/closure-reason.repository";

export class ClosureReasonService {

  private closureReasonRepository =
    new ClosureReasonRepository();

  async getAll() {
    return await this
      .closureReasonRepository
      .getAll();
  }

  async getById(id: string) {

    const closureReason =
      await this
        .closureReasonRepository
        .getById(id);

    if (!closureReason) {
      throw new Error(
        "Motivo de cierre no encontrado"
      );
    }

    return closureReason;
  }

  async create(data: {
    name: string;
    description?: string;
  }) {

    const existingClosureReason =
      await this
        .closureReasonRepository
        .getByName(data.name);

    if (existingClosureReason) {
      throw new Error(
        "Ya existe un motivo de cierre con ese nombre"
      );
    }

    return await this
      .closureReasonRepository
      .create(data);
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {

    const closureReason =
      await this
        .closureReasonRepository
        .getById(id);

    if (!closureReason) {
      throw new Error(
        "Motivo de cierre no encontrado"
      );
    }

    if (data.name) {

      const existingClosureReason =
        await this
          .closureReasonRepository
          .getByName(data.name);

      if (
        existingClosureReason &&
        existingClosureReason.id !== id
      ) {
        throw new Error(
          "Ya existe un motivo de cierre con ese nombre"
        );
      }
    }

    return await this
      .closureReasonRepository
      .update(id, data);
  }

  async delete(id: string) {

    const closureReason =
      await this
        .closureReasonRepository
        .getById(id);

    if (!closureReason) {
      throw new Error(
        "Motivo de cierre no encontrado"
      );
    }

    return await this
      .closureReasonRepository
      .delete(id);
  }

}