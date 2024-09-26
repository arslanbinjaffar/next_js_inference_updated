import axios from "axios";
import { ElNotification } from "element-plus";

const backend_url = "http://localhost:4005";

const request = axios.create({
  baseURL: backend_url,
  timeout: 60000,
});

//@ts-ignore
const errorHandler = (error) => {
  const message = error?.response?.data?.message || error.message;
  ElNotification({
    title: "Request Failed",
    message,
    type: "error",
  });

  return Promise.reject(error);
};

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => response, errorHandler);

export default request;
