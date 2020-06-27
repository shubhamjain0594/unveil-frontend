import axios from 'axios/index';

export function createAxiosInstance(token) {
    return axios.create({ headers: { 'token': token } });
}
