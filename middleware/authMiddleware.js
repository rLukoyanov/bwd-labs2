const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is missing' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
};

export default validateApiKey;
