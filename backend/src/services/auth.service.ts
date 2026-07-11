import { UserRepository } from "../repositories/user.repository";
import { UserFactory } from "../factories/user.factory";
import { EmailService } from "./email.service";
import { isValidEmailFormat, hasValidEmailDomain } from "../utils/validateEmail";
import { generateEmailToken, hashEmailToken } from "../utils/emailToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private userRepository = new UserRepository();
  private emailService = new EmailService();
  private validateStrongPassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
    }
  }
  async register(data: { email: string; firstName: string; lastName: string; password: string }) {
    if (!isValidEmailFormat(data.email)) {
      throw new Error("El formato del correo electrónico no es válido");
    }

    const validDomain = await hasValidEmailDomain(data.email);

    if (!validDomain) {
      throw new Error("El dominio del correo no existe o no puede recibir correos");
    }

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const { token, hashedToken } = generateEmailToken();

        await this.userRepository.updateVerificationToken(
          existingUser.id,
          hashedToken,
          new Date(Date.now() + 60 * 60 * 1000)
        );

        await this.emailService.sendVerificationEmail(existingUser.email, token);
      }

      return {
        message:
          "Si el correo existe, te llegará un enlace de verificación para activar tu cuenta.",
      };
    }

    this.validateStrongPassword(data.password);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const { token, hashedToken } = generateEmailToken();

    const newUser = UserFactory.create({
      ...data,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    await this.userRepository.create(newUser);

    await this.emailService.sendVerificationEmail(data.email, token);

    return {
      message: "Si esta cuenta existe, te llegará una verificación a tu correo.",
    };
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

    if (!user.emailVerified) {
      throw new Error("Debes verificar tu correo antes de iniciar sesión");
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
      },
    };
  }

  async verifyEmail(token: string) {
    const hashedToken = hashEmailToken(token);

    const user = await this.userRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw new Error("El enlace de verificación es inválido o ha expirado");
    }

    await this.userRepository.verifyEmail(user.id);

    return {
      message: "Correo verificado correctamente. Ya puedes iniciar sesión.",
    };
  }
  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const { token, hashedToken } = generateEmailToken();

      await this.userRepository.updatePasswordResetToken(
        user.id,
        hashedToken,
        new Date(Date.now() + 60 * 60 * 1000)
      );

      await this.emailService.sendPasswordResetEmail(user.email, token);
    }

    return {
      message: "Si el correo existe, te llegará un enlace para restablecer tu contraseña.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    this.validateStrongPassword(newPassword);

    const hashedToken = hashEmailToken(token);

    const user = await this.userRepository.findByPasswordResetToken(hashedToken);

    if (!user) {
      throw new Error("El enlace para restablecer contraseña es inválido o ha expirado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(user.id, hashedPassword);

    return {
      message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    };
  }
}
