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
    submitrating: async (obj) => {
        const result = await axios.post(`${api}/submit-rating`, obj);
        return result.data;
    },
    submittextpost: async (obj) => {
        const result = await axios.post(`${api}/textpost`, obj);
        return result.data;
    },
    gettextpost: async (obj) => {
        const result = await axios.post(`${api}/gettextposts`, obj);
        return result.data;
    },
    createcomment: async (obj) => {
        const result = await axios.post(`${api}/create-comment`, obj);
        return result.data;
    },
    toggleFavs: async (obj) => {
        const result = await axios.post(`${api}/favorites`, obj);
        return result.data;
    },
    getFavs: async (obj) => {
        const result = await axios.post(`${api}/getfavorites`, obj);
        return result.data;
    },
    archiveFavorite: async (obj) => {
        const result = await axios.post(`${api}/archivefavorite`, obj);
        return result.data;
    },
    getvotd: async (obj) => {
        const result = await axios.get(`${api}/getvotd`, obj);
        return result.data;
    },
}

export default helpers;