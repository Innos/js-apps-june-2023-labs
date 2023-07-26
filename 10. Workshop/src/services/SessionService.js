const key = 'accessToken';
const userKey = 'userId';

export class SessionService {
    getAccessToken(){
        return sessionStorage.getItem(key);
    }

    setAccessToken(accessToken){
        sessionStorage.setItem(key, accessToken);
    }

    removeAccessToken(){
        sessionStorage.removeItem(key);
    }

    setCurrentUserId(userId){
        sessionStorage.setItem(userKey, userId);
    }

    getCurrentUserId(){
        return sessionStorage.getItem(userKey);
    }

    removeCurrentUserId(){
        sessionStorage.removeItem(userKey);
    }
}
