import { UserReadableError } from "./UserReadableError.js";

export async function _internalJsonFetch(url, settings) {
    try {
        let response = await fetch(url, settings);
        if (response.status === 200) {
            let result = await response.json();
            return result;
        } else if(response.status === 204) {
            return undefined;
        } else {
            let result = await response.json();
            throw new UserReadableError(JSON.stringify(result));
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}