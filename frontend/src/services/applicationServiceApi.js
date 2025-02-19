import axios from "axios";

const BASE_URL = "https://zensar.zioset.com/";

const instance = axios.create({ baseURL: BASE_URL });

export const getApplicationRequest = async (endPoint) => {
  try {
    const token = sessionStorage.getItem("token");
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get(endPoint);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { error: error.message || 'An error occurred' };
  }
};


export const postApplicationRequest = async (endPoint, data) => {
  try {
    const token = sessionStorage.getItem("token");
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await instance.post(endPoint, data);
    return { ...response };
  } catch (error) {
    return { error: error };
  }
};