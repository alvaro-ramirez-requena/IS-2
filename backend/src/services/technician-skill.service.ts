import {
  TechnicianSkillRepository,
} from "../repositories/technician-skill.repository";

const technicianSkillRepository =
  new TechnicianSkillRepository();

export class TechnicianSkillService {
  async getAll() {
    return await technicianSkillRepository.findAll();
  }

  async getActive() {
    return await technicianSkillRepository.findActive();
  }

  async create(data: {
    name: string;
    description?: string;
  }) {
    const name =
      data.name?.trim();

    const description =
      data.description?.trim() || undefined;

    if (!name) {
      throw new Error(
        "El nombre de la habilidad es obligatorio."
      );
    }

    const existingSkill =
      await technicianSkillRepository.findByName(name);

    if (existingSkill) {
      throw new Error(
        "Ya existe una habilidad técnica con ese nombre."
      );
    }

    return await technicianSkillRepository.create({
      name,
      description,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      active?: boolean;
    }
  ) {
    if (!id) {
      throw new Error(
        "La habilidad técnica es obligatoria."
      );
    }

    const existingSkill =
      await technicianSkillRepository.findById(id);

    if (!existingSkill) {
      throw new Error(
        "La habilidad técnica no existe."
      );
    }

    const updateData: {
      name?: string;
      description?: string | null;
      active?: boolean;
    } = {};

    if (data.name !== undefined) {
      const name =
        data.name.trim();

      if (!name) {
        throw new Error(
          "El nombre de la habilidad no puede estar vacío."
        );
      }

      const skillWithSameName =
        await technicianSkillRepository.findByName(name);

      if (
        skillWithSameName &&
        skillWithSameName.id !== id
      ) {
        throw new Error(
          "Ya existe otra habilidad técnica con ese nombre."
        );
      }

      updateData.name =
        name;
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description.trim() || null;
    }

    if (data.active !== undefined) {
      updateData.active =
        data.active;
    }

    return await technicianSkillRepository.update(
      id,
      updateData
    );
  }

  async activate(
    id: string
  ) {
    return await technicianSkillRepository.activate(id);
  }

  async deactivate(
    id: string
  ) {
    return await technicianSkillRepository.deactivate(id);
  }
}