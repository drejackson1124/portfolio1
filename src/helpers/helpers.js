import axios from "axios";

const api = 'https://kr38mcaqla.execute-api.us-east-1.amazonaws.com/UpNextFM-Beta';

const helpers = {
    getAds: async () => {
        const result = await axios.get(`${api}/get-ads`);
        return result.data.body;
    },
    signup: async (obj) => {
        const result = await axios.post(`${api}/signup`, obj);
        return result.data;
    },
    signin: async (obj) => {
        const result = await axios.post(`${api}/signin`, obj);
        return result.data;
    },
    createpost: async (obj) => {
        const result = await axios.post(`${api}/create-post`, obj);
        return result.data;
    },
    uploadfile: async (obj) => {
        const result = await axios.post(`${api}/upload`, obj);
        return result.data;
    },
    getposts: async (obj) => {
        const result = await axios.post(`${api}/posts`, obj);
        return result.data;
    },
}

export default helpers;