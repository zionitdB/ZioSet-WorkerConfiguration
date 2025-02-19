import { ToastTypes, showToast } from "./toast";

export const handleError = (error) => {
  if (error.code === "ERR_NETWORK") {
    showToast("Server down! Please try again later!", ToastTypes.error);
  } else {
    showToast("Something went wrong!", ToastTypes.error);
  }
};
