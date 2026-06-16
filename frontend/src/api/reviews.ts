import api from "./axios";

export function getReviews(companyId: number, page = 1) {
    return api.get(`/api/company/${companyId}/reviews?page=${page}`);
}