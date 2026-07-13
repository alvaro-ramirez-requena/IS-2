import type { RegisterDTO, LoginDTO } from "../types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class AuthService {
  static async register(dto: RegisterDTO) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message);
    }

    return response.json();
  }

  static async login(dto: LoginDTO) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message);
    }

    return response.json();
  }
}
