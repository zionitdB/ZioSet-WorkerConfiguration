
export const saveInLocalStorage = (key, value)=>{
    sessionStorage.setItem(key, value);
}

export const getFromLocalStorage = (key) =>{
    const value = sessionStorage.getItem(key);
    return value;
}

// export const saveInSessionStorage = (key, value) => {
//     sessionStorage.setItem(key, value);
// }

// export const getFromSessionStorage = (key) => {
//     const value = sessionStorage.getItem(key);
//     return value;
// }
