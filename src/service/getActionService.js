import axios from 'axios';

const getActionService = async () => {
    try {
        const response = await axios.get('http://localhost:3001/GetDataAction/fanlightlog/');
        return response.data;
    } catch (error) {
        console.error('Error fetching action service:', error);
        throw error;
    }
};

export default getActionService;