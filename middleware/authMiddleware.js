"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenService_1 = require("@service/tokenService");
const validateBearerToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization format' });
    }
    const token = parts[1];
    try {
        const decoded = (0, tokenService_1.verifyAccessToken)(token);
        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' + String(error) });
    }
};
exports.default = validateBearerToken;
