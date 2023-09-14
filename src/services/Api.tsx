import axios from "axios";

const API_URL = "https://randomuser.me/api/";

export const fetchRandomUserData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.results[0];
  } catch (error) {
    console.error("Error fetching random user data:", error);
    return null;
  }
};
