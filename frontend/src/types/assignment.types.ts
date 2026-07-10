export type TechnicianProfile = {
    id: string;
    userId: string;
    municipalityId?: string | null;
    municipality?: {
        id: string;
        name: string;
        district?: string | null;
        province?: string | null;
        department?: string | null;
    } | null;
    district?: string | null;
    skills: string[];
    available: boolean;
    crewName?: string | null;
};

export interface Technician {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    technicianProfile?: TechnicianProfile | null;
}

export interface ReportAssignment {
    id: string;
    reportId: string;
    technicianId: string;
    assignedById: string;
    assignedAt: string;
    notes?: string | null;
    active: boolean;

    technician: Technician;
}

export interface AssignmentRequest {
    reportId: string;
    technicianId: string;
    assignedById: string;
    notes?: string;
}