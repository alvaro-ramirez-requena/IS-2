import { UserRepository } from "../repositories/user.repository";
import { UserFactory } from "../factories/user.factory";

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    // verificar si ya existe
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El usuario ya está registrado con ese correo");
    }

    // crear usuario con factory
    const newUser = UserFactory.create(data);

    // guardar en BD
    return await this.userRepository.create(newUser);
  }

  async login(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }
}