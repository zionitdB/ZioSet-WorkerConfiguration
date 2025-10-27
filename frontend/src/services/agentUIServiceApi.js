import axios from "axios";

//const BASE_URL = "http://localhost:8085/";
const BASE_URL = "https://zensar-agent.zioset.com/";
//const BASE_URL = "https://ador-agent.zionit.in/";

//export const LOGIN_BASE_URL = "http://localhost:8085/user/loginWithOutOTP";
export const LOGIN_BASE_URL = "https://zensar-agent.zioset.com/user/loginWithOutOTP";
// export const LOGIN_BASE_URL = "https://ador-agent.zionit.in/user/loginWithOutOTP";


const instance = axios.create({ baseURL: BASE_URL });


export const getAgentRequest = async (endPoint) => {
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


export const postAgentRequest = async (endPoint, data) => {
  try {
    const token = sessionStorage.getItem("token");
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await instance.post(endPoint, data);
    return { ...response };
  } catch (error) {
    return { error: error };
  }
};
