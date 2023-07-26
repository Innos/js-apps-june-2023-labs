import { BaseApiService } from "./BaseApiService.js";

export class BaseCrudApiService extends BaseApiService {
    constructor(baseUrl, path, sessionService){
        super(baseUrl);
        this.resourceUrl = `${this.baseUrl}${path}`;
        this.sessionService = sessionService;
    }

    async getAll(){
        let options = {
            method: 'Get'
        };
        let url = `${this.resourceUrl}?sortBy=_createdOn%20desc`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async getAllByUser(){
        let options = {
            method: 'Get'
        };
        let userId = this.sessionService.getCurrentUserId();
        let url = `${this.resourceUrl}?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async getById(id){
        let options = {
            method: 'Get'
        };
        let url = `${this.resourceUrl}/${id}`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async getByBrand(brand){
        let options = {
            method: 'Get'
        };
        let url = `${this.resourceUrl}?where=brand%20LIKE%20%22${brand}%22`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async getByOrder(orderId){
        let options = {
            method: 'Get'
        };
        let value = encodeURI(`orderId LIKE "${orderId}"`)
        let url = `${this.resourceUrl}?where=${value}&load=item%3DitemId%3Ashoes`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async create(item){
        let options = {
            method: 'Post',
            headers: {
                'Content-Type': 'applicaiton/json',
                'X-Authorization': this.sessionService.getAccessToken()
            },
            body: JSON.stringify(item)
        };

        let result = await this._internalFetchJson(this.resourceUrl, options);
        return result;
    }

    async edit(id, item){
        let options = {
            method: 'Put',
            headers: {
                'Content-Type': 'applicaiton/json',
                'X-Authorization': this.sessionService.getAccessToken()
            },
            body: JSON.stringify(item)
        };
        let url = `${this.resourceUrl}/${id}`;

        let result = await this._internalFetchJson(url, options);
        return result;
    }

    async delete(id){
        let options = {
            method: 'Delete',
            headers: {
                'X-Authorization': this.sessionService.getAccessToken()
            }
        };
        let url = `${this.resourceUrl}/${id}`;
        let result = await this._internalFetchJson(url, options);
        return result;
    }
}