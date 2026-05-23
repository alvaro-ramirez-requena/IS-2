export type ReportFormValues = {

  category: string;

  problemType: string;

  description: string;

  isAnonymous: boolean;

  latitude?: number;

  longitude?: number;

  images: File[];

  imageUrls: string[];
};

export type CreateReportDTO = {

  category: string;

  problemType: string;

  description: string;

  isAnonymous: boolean;

  latitude?: number;

  longitude?: number;

  imageUrls: string[];

  userId: string;
};

export type ApiReport = {

  id: string;

  category: string;

  problemType: string;

  description: string;

  isAnonymous: boolean;

  latitude?: number;

  longitude?: number;

  status:
  | "REGISTERED"
  | "VALIDATING"
  | "APPROVED"
  | "REJECTED"
  | "PRIORITIZED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED";

  userId: string;

  createdAt: string;

  updatedAt: string;
};