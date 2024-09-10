import jwtDecode from 'jwt-decode';

// Define a type for the decoded token payload
interface JwtPayload {
    exp: number; // expiration time as a Unix timestamp
    [key: string]: any; // other fields in the token
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getUsername = (): string | null => {
    return localStorage.getItem('username');
};

export const isTokenValid = (token: string): boolean => {
    if (!token) return false;

    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds
        localStorage.setItem("inspectorId", decodedToken.inspectorId);

        if (decodedToken.exp < currentTime) {
            // Token is expired, clear it from local storage
            clearToken();
            return false;
        }

        return true;
    } catch (e) {
        // If an error occurs while decoding the token, assume it's invalid
        clearToken();
        return false;
    }
};

// Function to clear the token
export const clearToken = () => {
    localStorage.removeItem('token');
};
