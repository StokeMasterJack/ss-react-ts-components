export interface EmpFull {
    id: number;
    firstName: string | null;
    lastName: string | null;

    idFixed: string | null;  //computed
    name: string | null;     //computed

    dateOfBirth: string | null;
    street: string | null;
    city: string | null;
    zip: string | null;
    state: string | null;
    phone: string | null;

    active: boolean;
    allowPerm: boolean;
    allowAllJobs: boolean;
    workCategoryId: number | null;
    temp: boolean;

    wage: number | null;  //floats are represented as strings in view-model's

}
