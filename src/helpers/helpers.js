import axios from "axios";

const api = 'https://kr38mcaqla.execute-api.us-east-1.amazonaws.com/UpNextFM-Beta';

const helpers = {
    getAds: async () => {
        const result = await axios.get(`${api}/get-ads`);
        return result.data.body;
    }
}

export default helpers;