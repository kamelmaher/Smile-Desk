export type Clinic = {
    _id: string;
    userId: string;
    clinicName: string;
    slug: string;
    phoneNumber?: string;
    logo?: string;
    description?: string;
    email?: string;
    address?: string;
    workingHours: WorkingHours[];
    subscription: ClinicSubscription;
    createdAt: string;
    updatedAt: string;
}

export type ClinicSubscription = {
    plan: "trial" | "monthly" | "annual" | "lifetime";
    status: "active" | "expired" | "canceled";
    startedAt: string;
    trialEndsAt?: string;
    currentPeriodEnd?: string;
}

export type WorkingHours = {
    day: number;
    isOpen: boolean;
    start?: string;
    end?: string;
}