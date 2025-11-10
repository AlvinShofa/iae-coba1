    // frontend/src/services/userService.js
    import axios from "axios";

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

    export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
    };

    export const register = async (username, password, role = "user") => {
    const response = await axios.post(`${API_URL}/register`, { username, password, role });
    return response.data;
    };
