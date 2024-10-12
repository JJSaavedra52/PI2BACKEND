import { Llama } from 'langchain'; // Import the Llama class from Langchain
import { fetchAdsFromDB } from '../ads/store.mjs'; // Import the function to fetch ads from the DB

// Initialize the Llama AI model
const llama = new Llama({
    apiKey: process.env.LLAMA_API_KEY, // Ensure you have your API key set in environment variables
});

// Function to query the AI model
const queryAIModel = async (query) => {
    try {
        const response = await llama.query(query);
        return response;
    } catch (error) {
        throw new Error(`Error querying AI model: ${error.message}`);
    }
};

// Function to get ads based on AI query
const getAdsByAIQuery = async (query) => {
    try {
        const ads = await fetchAdsFromDB();
        const aiResponse = await queryAIModel(query);

        // Process AI response and filter ads
        const filteredAds = ads.filter(ad => aiResponse.includes(ad.title));
        return filteredAds;
    } catch (error) {
        throw new Error(`Error getting ads by AI query: ${error.message}`);
    }
};

// Controller function to handle the AI query endpoint
const getAdsByAI = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const ads = await getAdsByAIQuery(query);
        return res.status(200).json(ads);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { getAdsByAI };