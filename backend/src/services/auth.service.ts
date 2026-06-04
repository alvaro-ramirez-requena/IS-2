import { UserRepository } from "../repositories/user.repository";
import { UserFactory } from "../factories/user.factory";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    // verificar si ya existe
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("El usuario ya está registrado con ese correo");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña es débil. Sugerencia: utiliza al menos 8 caracteres.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);


    // crear usuario con factory
    const newUser = UserFactory.create({
      ...data,
      password: hashedPassword
    });

    // guardar en BD
    await this.userRepository.create(newUser);
    return { message: "¡Registro completado!" };
  }

  async login(credentials: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new Error("Correo o contraseña incorrectos");
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: "7d",
      }
    );

    return {

      message: "Acceso permitido",

      token,

      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
      }
    };
  }
}