export type ReportFormValues = {
  title: string;
  description: string;
  location: string;
  category: string;
};

export type CreateReportDTO = {
  title: string;
  description: string;
  location: string;
  userId: string;
  category: string;
};

export type ApiReport = {
  id: string;
  title: string;
  description: string;
  location: string;

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