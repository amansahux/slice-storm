import axiosInstance from "../../../config/axiosInstance";

export const createGameAPI = () => {
    return axiosInstance.post("/games/create");
};

export const getGameHistoryAPI = () => {
    return axiosInstance.get("/games/history");
};

export const createSessionAPI = () => {
    return axiosInstance.post("/games/createSession");
};

export const updateSessionStatusAPI = (sessionId: string, status: string) => {
    return axiosInstance.put(`/games/session/${sessionId}/status`, { status });
};