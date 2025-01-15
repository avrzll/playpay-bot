import axios from "axios";
import "dotenv/config";

const RAPID_API_URL = process.env.RAPI_URL;
const HEADERS = {
  "x-rapidapi-key": process.env.XRAPI_KEY,
  "x-rapidapi-host": process.env.XRAPI_HOST,
};

export const fetchGameData = async (endpoint) => {
  try {
    const url = `${RAPID_API_URL}${endpoint}`;
    const options = { method: "GET", url, headers: HEADERS };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching game data:", error.message);
    return {
      error: true,
      message: `Error fetching game data: ${error.message}`,
    };
  }
};
