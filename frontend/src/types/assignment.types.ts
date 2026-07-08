export interface Technician {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  specialty?: string;

  zone?: string;

  availability: boolean;
}

export interface ReportAssignment {

  id: string;

  reportId: string;

  technicianId: string;

  assignedById: string;

  assignedAt: string;

  notes?: string;

  active: boolean;

  technician: Technician;
}

export interface AssignmentRequest {

  reportId: string;

  technicianId: string;

  assignedById: string;

  notes?: string;
}