import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    const token = req.cookies.token; // ✅ read from cookie

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export { protect };