export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "CITIZEN" | "OPERATOR" | "TECHNICIAN";
        districtId?: string | null;
      };
    }
  }
}