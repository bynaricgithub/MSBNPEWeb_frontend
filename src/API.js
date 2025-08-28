/* eslint-disable eqeqeq */
import axios from "axios";
import { en } from "./utils/Helper";

const serverPath = process.env.REACT_APP_SERVER_PROJPATH;

let API = axios.create({
  baseURL: serverPath,
  withCredentials: true,
  headers: {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "frame-ancestors 'none';",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    Server: "",
    //extra options
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "no-referrer-when-downgrade",
  },
});

API.interceptors.request.use(
  function (config) {
    // ------------------------------------ Setting token -----------------------------------------
    // const tokenName = en("token");
    // const token = window.atob(decodeURIComponent(JSON.parse(sessionStorage.getItem(tokenName))));
    const tokenName = "token";
    const token = decodeURIComponent(JSON.parse(sessionStorage.getItem(tokenName)));

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default API;
