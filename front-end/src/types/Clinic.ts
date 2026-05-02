export type Clinic = {
    _id: string,
    userId: string,
    clinicName: string,
    description: string,
    phoneNumber?: string,
    email?: string,
    address?: string
    slug: string
    logo?: string
    createdAt: string
    validTo: string
    workingHours?: WorkingHours
}

export type WorkingHours = {
    day: number,
    isOpen: boolean,
    start: string,
    end: string
}[]