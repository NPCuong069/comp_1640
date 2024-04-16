import axios from 'axios';

const API_BASE_URL = 'https://localhost:7002/api';

export const getAllContributions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Contributions/get-all-contributions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return [];
  }
};

export const getAcademicTerms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/AcademicTerms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching academic terms:', error);
    return [];
  }
};