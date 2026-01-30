// const API_URL = import.meta.env.CINEMA_API_URL;
const API_URL: string = "http://localhost:3000";

/**
 * Function to auth user
 * @param email email typed
 * @param password password typed
 *
 */
const authUser = async(email: string, password: string): Promise<any> => {
    const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    });
    const data = await response.json();
    return data;
}

export const AuthBaseService = {
    authUser
};