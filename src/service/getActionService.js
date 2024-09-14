import axios from 'axios';

const getActionService = async (page, limit) => {
  try {
    const response = await axios.get(`http://localhost:3001/GetDataAction/fanlightlog?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching data');
  }
};

export default getActionService;