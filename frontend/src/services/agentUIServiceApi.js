import axios from "axios";

export const BASE_URL = "https://zensar-agent.zioset.com/";
// export const BASE_URL = "http://localhost:8085/";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});


export const getAgentRequest = async (endPoint) => {
  try {
    const response = await instance.get(endPoint);
    return { data: response.data, status: response.status };
  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
};


export const postAgentRequest = async (endPoint, data) => {
  try {
    const response = await instance.post(endPoint, data);
    return { ...response };
  } catch (error) {
    return { error: error };
  }
};


export const postFileUpload = async (file, uploadedBy = "system") => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await instance.post(
      `/api/script-files/upload?uploadedBy=${uploadedBy}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
    const response = await instance.patch(endPoint, data);
    return { data: response.data, status: response.status };

  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
};

export const deleteAgentRequest = async (endPoint) => {
  try {
    const response = await instance.delete(endPoint);
    return { data: response.data, status: response.status };

  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
};

