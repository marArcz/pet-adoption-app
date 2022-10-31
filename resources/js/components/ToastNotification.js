import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        icon: true,
        draggable: true,
        progress: undefined,
        theme:'dark'
    });
}
export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        icon: true,
        draggable: true,
        progress: undefined,
        theme:'dark'
    });
}
