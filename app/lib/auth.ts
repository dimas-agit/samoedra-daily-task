import jwt from "jsonwebtoken";
export function verifyToken(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) { 
            return null;
        }
        const token = authHeader.split(" ")[1];
         return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }   
};


export const getUserIdFromToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Decode JWT payload (bagian 10gah)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Common JWT userId fields
    return payload.userId || 
           payload.sub || 
           payload.id || 
           payload._id ||
           null;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

