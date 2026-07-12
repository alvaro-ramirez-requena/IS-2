import bcrypt from "bcryptjs";

import {
  AdminManagementRepository,
} from "../repositories/admin-management.repository";

const adminManagementRepository =
  new AdminManagementRepository();

export class AdminManagementService {
  async getMunicipalities() {
    return await adminManagementRepository.findMunicipalities();
  }

  async createMunicipality(data: {
    name: string;
    district?: string;
    province?: string;
    department?: string;
    aliases?: string[] | string;
  }) {
    const name =
      data.name?.trim();

    const district =
      data.district?.trim() || undefined;

    const province =
      data.province?.trim() || undefined;

    const department =
      data.department?.trim() || undefined;

    const aliases =
      Array.isArray(data.aliases)
        ? data.aliases
        : String(data.aliases || "")
            .split(",")
            .map((alias) => alias.trim())
            .filter(Boolean);

    if (!name) {
      throw new Error(
        "El nombre de la municipalidad es obligatorio."
      );
    }

    const existingMunicipality =
      await adminManagementRepository.findMunicipalityByName(name);

    if (existingMunicipality) {
      throw new Error(
        "Ya existe una municipalidad con ese nombre."
      );
    }

    return await adminManagementRepository.createMunicipality({
      name,
      district,
      province,
      department,
      aliases,
    });
  }

  async getOperators() {
    return await adminManagementRepository.findOperators();
  }

  async createOperator(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    municipalityId: string;
  }) {
    const firstName =
      data.firstName?.trim();

    const lastName =
      data.lastName?.trim();

    const email =
      data.email?.trim().toLowerCase();

    const password =
      data.password?.trim();

    const municipalityId =
      data.municipalityId?.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !municipalityId
    ) {
      throw new Error(
        "Todos los campos del operador son obligatorios."
      );
    }

    if (password.length < 8) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres."
      );
    }

    const municipality =
      await adminManagementRepository.findMunicipalityById(
        municipalityId
      );

    if (!municipality) {
      throw new Error(
        "La municipalidad seleccionada no existe."
      );
    }

    const existingUser =
      await adminManagementRepository.findUserByEmail(
        email
      );

    if (existingUser) {
      throw new Error(
        "Ya existe un usuario registrado con ese correo."
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    return await adminManagementRepository.createOperator({
      firstName,
      lastName,
      email,
      password:
        passwordHash,

      municipalityId,
    });
  }
}