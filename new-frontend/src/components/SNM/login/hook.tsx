import { fetchData } from "@/serviceAPI/serviceApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface LoginPayload {
  username: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<any> => {
      return await fetchData(`/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "Login successful");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login failed");
    },
  });
};




export const useLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<any> => {
      return await fetchData("/api/auth/signout", {
        method: "POST",
      });
    },
   
    onError: (error: any) => {
      toast.error(error?.message || "Logout failed");
    },
  });
};
