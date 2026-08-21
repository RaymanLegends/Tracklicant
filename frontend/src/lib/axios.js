import axios from "axios";

//no such thing as "local host" in production so it's just dynamic now
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;