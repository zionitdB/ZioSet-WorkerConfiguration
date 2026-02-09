import { fetchData } from "@/serviceAPI/serviceApi"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

const onSuccess = (msg: string) => toast.success(msg || "Operation successful")
const onError = (err: any) => toast.error(err?.message || "Operation failed")


export const useForgetPasswordVerify = () => {
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/app/login/forgot_password/verify_otp`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      onSuccess(res.message)
    },
    onError,
  })
}
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (data: any) =>
      fetchData(`/app/login/forgot_password/request_otp`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res: any) => {
      onSuccess(res.message)
    },
    onError,
  })
}