import { clearAccessToken, getAccessToken, setAccessToken } from "./authenticationService.js";
import { _internalJsonFetch } from "./internalFetchService.js";

let url = 'http://localhost:3030/users';

export async function login(user) {
    let settings = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    try {
        let result = await _internalJsonFetch(`${url}/login`, settings);
        setAccessToken(result.accessToken);
        return result;
    } catch (e) {
        if (e instanceof UserReadableError) {
            alert(e.message);
        }
    }
}

export async function register(user) {
    let settings = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    let result = await _internalJsonFetch(`${url}/register`, settings);
    setAccessToken(result.accessToken);
}


export async function logout(){
    let settings = {
        method: 'Get',
        headers: {
            'X-Authorization': getAccessToken()
        }
    };

    let result = await _internalJsonFetch(`${url}/logout`, settings);
    clearAccessToken();
    return;
}