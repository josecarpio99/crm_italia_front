import ModelService from "@/services/ModelService";

export default class UserService extends ModelService {

    constructor() {
        super();
        this.url = 'v1/user';
    }

    public updateAvatar(id, payload) {
        const formData = new FormData();
        formData.append("avatar", payload.avatar);
        formData.append('_method', 'put');
        return this.post(`/users/${id}/avatar`, formData);
    }

}
