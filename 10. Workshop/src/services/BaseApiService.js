import { UserReadableError } from "../errors/UserReadableError.js";

export class BaseApiService {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    async _internalFetchJson(url, options) {
        try {
            let response = await fetch(url, options);
            if(response.status === 200){
                return await response.json();
            } else if(response.status === 204) {
                return undefined;
            } else {
                let result = await response.json();
                throw new UserReadableError(result.message);  
            }
        }catch(e){
            throw e;
        }

    }
}