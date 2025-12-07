import axios from "axios";

const BASE_URL = "http://localhost:8085/";
//  export const BASE_URL = "http://20.219.1.165:8085/";

// const BASE_URL = "https://zensar-agent.zioset.com/";
//const BASE_URL = "https://ador-agent.zionit.in/";

//export const LOGIN_BASE_URL = "http://localhost:8085/user/loginWithOutOTP";
export const LOGIN_BASE_URL = "https://zensar-agent.zioset.com/user/loginWithOutOTP";
// export const LOGIN_BASE_URL = "https://ador-agent.zionit.in/user/loginWithOutOTP";


const instance = axios.create({ baseURL: BASE_URL });


// export const getAgentRequest = async (endPoint) => {
//   try {
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }

//     const response = await instance.get(endPoint);
//     return { data: response.data, status: response.status };
//   } catch (error) {
//     return { error: error.message || 'An error occurred' };
//   }
// };

export const getAgentRequest = async (endPoint) => {
  try {

    delete instance.defaults.headers.common["Authorization"];

    const response = await instance.get(endPoint);

    return { data: response.data, status: response.status };
  } catch (error) {
    return { error: error.message || "An error occurred" };
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




export const postFileUpload = async (file, uploadedBy = "system") => {
  try {
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const response = await instance.post(
      `/api/script-files/upload?uploadedBy=${uploadedBy}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // contains fileId, fileName etc.
  } catch (error) {
    console.error("Script file upload failed:", error);
    return { error };
  }
};

export const patchAgentRequest = async (endPoint, data) => {
  try {
    const token = sessionStorage.getItem("token");

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.patch(endPoint, data);
    return { data: response.data, status: response.status };

  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
};

export const deleteAgentRequest = async (endPoint) => {
  try {
    const token = sessionStorage.getItem("token");

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.delete(endPoint);

    return { data: response.data, status: response.status };

  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
};

