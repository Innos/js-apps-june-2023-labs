export function setAccessToken(accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
}

export function getAccessToken() {
    return sessionStorage.getItem('accessToken');
}

export function clearAccessToken() {
    sessionStorage.removeItem('accessToken');
}

export function isUserLoggedIn(){
    return sessionStorage.getItem('accessToken') != undefined;
}