export type ReportFormValues = {
  category: string;
  problemType: string;
  description: string;
  isAnonymous: boolean;
};

export type CreateReportDTO = {
  category: string;
  problemType: string;
  description: string;
  isAnonymous: boolean;
  userId: string;
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