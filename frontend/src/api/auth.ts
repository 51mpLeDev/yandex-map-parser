import api from "./axios";

export async function csrf() {
    await api.get("/sanctum/csrf-cookie");
}

export async function login(email: string, password: string) {
    await csrf();

    return api.post("/login", {
        email,
        password,
    });
}

export async function logout() {
    return api.post("/logout");
}

export async function me() {
    return api.get("/api/me");
}