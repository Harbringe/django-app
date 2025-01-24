import { useAuthStore } from '../store/auth';
import axios from './axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import Swal from 'sweetalert2';


// Configuring global toast notifications using Swal.mixin
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

/**
 * Logs a user in and returns an object containing the JWT access and refresh
 * tokens and an error message if any.
 * 
 * @param {string} email The email of the user to log in.
 * @param {string} password The password of the user to log in.
 * @returns {{ data: { access: string, refresh: string }, error: string | null }}
 */
export const login = async (email, password) => {

    try {

        const {data, status} = await axios.post("user/token/", {
            email,
            password,
        })

        if (status === 200) {
            setAuthUser(data.access, data.refresh);

            // Alert - Sign in successful
        }
        return { data, error : null};
    }catch (error) {
        return {
            data : null,
            error : error.response.data?.detail || "Something went wrong"
        }
    }

}

/**
 * Registers a new user with the provided details and logs them in.
 * 
 * @param {string} full_name The full name of the user to register.
 * @param {string} email The email of the user to register.
 * @param {string} phone The phone number of the user to register.
 * @param {string} password The password of the user to register.
 * @param {string} password2 The confirmation of the password.
 * @returns {{ data: object | null, error: string | null }} 
 * An object containing the server response data and any error message.
 */

export const register = async (full_name, email, phone, password, password2) => {
    try {
        // Making a POST request to register a new user
        const { data } = await axios.post('user/register/', {
            full_name,
            email,
            phone,
            password,
            password2,
        });

        // Logging in the newly registered user and displaying success toast
        await login(email, password);

        // Displaying a success toast notification
        Toast.fire({
            icon: 'success',
            title: 'Signed Up Successfully'
        });

        // Returning data and error information
        return { data, error: null };

    } catch (error) {
        // Handling errors and returning data and error information
        return {
            data: null,
            error: error.response.data || 'Something went wrong',
        };
    }
};


export const logout = () => {
/**
 * Removes the access and refresh tokens from the browser's cookies and 
 * resets the user to null in the store.
 * 
 * This function is meant to be called when the user wishes to log out.
 *
/******  e29a833a-68c2-4e1c-a389-52804ca00bb2  *******/    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().setUser(null);

    // Alert - Sign out successful
} 

/**
 * Sets the user in the application by checking and refreshing access tokens if necessary.
 * 
 * This function retrieves the access and refresh tokens from the browser's cookies.
 * If either token is missing, the function returns early. If the access token is expired,
 * it attempts to refresh the tokens using the refresh token. Finally, it sets the authenticated
 * user in the state.
 * 
 * Note: This function must be called in an environment with access to the necessary cookies.
 */

export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || !refreshToken) {
        return;
    }

    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);
    }else{
        setAuthUser(accessToken, refreshToken);
    }
}



/**
 * Sets the access and refresh tokens in the browser's cookies and updates 
 * the user state in the authentication store. It decodes the access token 
 * to retrieve user information and sets the user in the store if available.
 * 
 * @param {string} accessToken - The JWT access token.
 * @param {string} refreshToken - The JWT refresh token.
 */

export const setAuthUser = (accessToken, refreshToken) => {
    Cookies.set('access_token', accessToken, { 
        expires: 1, 
        secure: true 
    });

    Cookies.set('refresh_token', refreshToken, { 
        expires: 7, 
        secure: true 
    });

    const decodedToken = jwt_decode(accessToken);
    const user = {
        email: decodedToken.email,
        full_name: decodedToken.full_name,
        user_id: decodedToken.user_id,
        phone_number: decodedToken.phone_number
    };

    useAuthStore.getState().setUser(user);
}

/**
 * Retrieves a new access token using the refresh token. If the refresh token
 * is not found in the cookies, the function returns early. Otherwise, it
 * makes a POST request to the `/user/token/refresh/` endpoint with the
 * refresh token and returns the response data.
 * 
 * @returns {Promise<Object>} The response data containing the new access and
 * refresh tokens.
 */
export const getRefreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    const response = await axios.post("user/token/refresh/", {
        refresh : refresh_token
    })

    return response.data;
}

/**
 * Checks if the provided access token is expired.
 * 
 * This function decodes the JWT access token and compares its expiration 
 * time with the current time. If the token is expired or there is an error 
 * decoding it, the function returns true.
 *
 * @param {string} accessToken - The JWT access token to check.
 * @returns {boolean} True if the access token is expired or invalid, false otherwise.
 */

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 100;

    } catch (error) {
        console.log(error);
        return true;
    }
}