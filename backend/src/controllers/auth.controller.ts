import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const token = req.query.token as string;

      if (!token) {
        return res.status(400).json({
          message: "Token no proporcionado",
        });
      }

      const result = await authService.verifyEmail(token);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "No se pudo verificar el correo",
      });
    }
  }
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Correo no proporcionado",
        });
      }

      const result = await authService.forgotPassword(email);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "No se pudo enviar el correo de recuperación",
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          message: "Token o nueva contraseña no proporcionados",
        });
      }

      const result = await authService.resetPassword(token, newPassword);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "No se pudo restablecer la contraseña",
      });
    }
  }
}