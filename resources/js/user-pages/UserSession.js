export const setSessionToken = (token) =>{
    localStorage.setItem("ghrAdopterToken", token)
}
export const getSessionToken = () =>{
    if(localStorage.getItem("ghrAdopterToken") === null){
        return null;
    }else{
        return localStorage.getItem("ghrAdopterToken");
    }
}

export const removeSessionToken = () =>{
    localStorage.removeItem("ghrAdopterToken")
}


