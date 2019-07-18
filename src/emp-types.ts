import axios, {AxiosResponse} from "axios";

import {Row} from "components/intersection";

import {UseState} from "components/util";

export interface Emp extends Row {
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

export type UseEmp = UseState<readonly Emp[]>;

export const fetchEmps = async (): Promise<readonly  Emp[]> => {
    const r: AxiosResponse<readonly Emp[]> = await axios.request<readonly Emp[]>({
        method: "get",
        url: "/emps.json"
    });
    return r.data;
};