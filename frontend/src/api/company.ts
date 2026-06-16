import api from "./axios";

export function createCompany(url: string) {
    return api.post("/api/company", { url });
}

export function getCompany(id?: number) {
    if (id)
        return api.get(`/api/company/${id}`);
    return api.get(`/api/company`);
}

export function refreshCompany(id: number) {
    return api.post(`/api/company/${id}/refresh`);
}