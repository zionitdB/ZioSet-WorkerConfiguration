// export const BASE_URL = "http://localhost:8085";
// export const BASE_URL = "http://4.213.97.72:8085";

export const BASE_URL_SAM = "https://zensar.zioset.com";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || "header") as "header" | "cookie";


export const fetchData = async (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options?.body instanceof FormData;


  const headers: Record<string, string> = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ? options.headers as Record<string, string> : {}),
  };

    if (AUTH_MODE === "header") {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }


  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: AUTH_MODE === "cookie" ? "include" : "omit",
    cache: "no-store"
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    const message = errorResponse.message || response.statusText || "Something went wrong";
    throw new Error(message);
  }

  return await response.json();
}





export const fetchDataSam = async (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options?.body instanceof FormData;


  const headers: Record<string, string> = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ? options.headers as Record<string, string> : {}),
  };

    if (AUTH_MODE === "header") {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }


  const response = await fetch(`${BASE_URL_SAM}${endpoint}`, {
    ...options,
    headers,
    credentials: AUTH_MODE === "cookie" ? "include" : "omit",
    cache: "no-store"
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    const message = errorResponse.message || response.statusText || "Something went wrong";
    throw new Error(message);
  }

  return await response.json();
}








