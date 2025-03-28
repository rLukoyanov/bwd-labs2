"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.path} - Status: ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.default = customLogger;
