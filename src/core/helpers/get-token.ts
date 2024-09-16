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
        const currentTime = Date.now() / 1000; 
        localStorage.setItem("inspectorId", decodedToken.inspectorId);

        if (decodedToken.exp < currentTime) {
            clearToken();
            return false;
        }

        return true;
    } catch (e) {
        clearToken();
        return false;
    }
};

export const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('inspectorId');

};
