import axios from "axios";
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from "./auth";
import { BASE_URL } from "./constants";

import Cookies from "js-cookie";


/**
 * Creates an Axios instance configured with an interceptor to handle
 * token expiration. The instance uses the access token from cookies 
 * for authorization. If the access token is expired, the interceptor 
 * refreshes the tokens and updates the authorization header with the 
 * new access token.
 * 
 * @returns {Promise<AxiosInstance>} An Axios instance with a request 
 * interceptor for token refresh.
 */

const useAxios = async () => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");

    const axiosInstance = axios.create({
        baseURL : BASE_URL,
        headers : {
            Authorization: `Bearer ${access_token}`
        }
    })

    axiosInstance.interceptors.request.use(async (req) => {
        if (!isAccessTokenExpired(access_token)) {
            return req
        }

        const response = await getRefreshToken(refresh_token)

        setAuthUser(response.access, response.refresh)

        req.headers.Authorization = `Bearer ${response.data.access}`

        return req
    })

    return axiosInstance
}

export default useAxios