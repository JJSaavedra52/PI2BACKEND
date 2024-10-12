import express from 'express';
import { getAdsByAI } from './aiController.mjs'; // Import the AI controller function

const router = express.Router();

// Route to get ads based on AI query
router.post('/ai-query', getAdsByAI);

export { router };