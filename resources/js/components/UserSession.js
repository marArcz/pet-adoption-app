export const setSessionToken = (token) =>{
    localStorage.setItem("ghrUserToken", JSON.stringify(token))
}
export const getSessionToken = () =>{
    if(localStorage.getItem("ghrUserToken") === null){
        return null;
    }else{
        return JSON.parse(localStorage.getItem("ghrUserToken"));
    }
}

export const removeSessionToken = () =>{
    localStorage.removeItem("ghrUserToken")
}
