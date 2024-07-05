// import { ApiRoutes } from '@/constants/ApiRoutes';
// import { User } from '@/models/User';
import { ApiRoutes } from '@/constants/ApiRoutes';
import { useStore } from '@/store/store';
import { truncateQueryParamsFromCurrentUrl } from '@/utils/RouteUtils';
import axios from 'axios';

export const isSaasBuild = import.meta.env.VITE_IS_SAAS_BUILD?.toLocaleLowerCase() === 'true';

export const axiosService = axios.create();

export const AMUI_URL = isSaasBuild ? (window as any).NMUI_AMUI_URL : '';

export const INTERCOM_APP_ID = isSaasBuild ? (window as any).NMUI_INTERCOM_APP_ID : '';

export const NMUI_ACCESS_TOKEN_LOCALSTORAGE_KEY = 'nmui-at-lsk';
export const NMUI_USERNAME_LOCALSTORAGE_KEY = 'nmui-un-lsk';
export const NMUI_BASE_URL_LOCALSTORAGE_KEY = 'nmui-burl-lsk';
export const NMUI_TENANT_ID_LOCALSTORAGE_KEY = 'nmui-tid-lsk';
export const NMUI_TENANT_NAME_LOCALSTORAGE_KEY = 'nmui-tn-lsk';
export const NMUI_AMUI_USER_ID_LOCALSTORAGE_KEY = 'nmui-amuiuid-lsk';
export const NMUI_USER_LOCALSTORAGE_KEY = 'nmui-u-lsk';

// function to resolve the particular SaaS tenant's backend URL, ...
export async function setupTenantConfig(): Promise<void> {
  if (!isSaasBuild) {
    const dynamicBaseUrl = (window as any).NMUI_BACKEND_URL;
    const resolvedBaseUrl = dynamicBaseUrl ? `${dynamicBaseUrl}/api` : `${import.meta.env.VITE_BASE_URL}/api`;
    useStore.getState().setStore({
      baseUrl: resolvedBaseUrl,
      jwt: window?.localStorage?.getItem(NMUI_ACCESS_TOKEN_LOCALSTORAGE_KEY) ?? '',
      username: window?.localStorage?.getItem(NMUI_USERNAME_LOCALSTORAGE_KEY) ?? '',
      user: JSON.parse(window?.localStorage?.getItem(NMUI_USER_LOCALSTORAGE_KEY) ?? 'null'),
    });
    axiosService.defaults.baseURL = resolvedBaseUrl;
    return;
  }

  const url = new URL(window.location.href);
  const baseUrl = url.searchParams.get('backend');
  const accessToken = url.searchParams.get('token');
  const amuiAuthToken = url.searchParams.get('sToken') ?? '';
  const tenantId = url.searchParams.get('tenantId') ?? '';
  const tenantName = url.searchParams.get('tenantName') ?? '';
  const username = url.searchParams.get('username') ?? '';
  const amuiUserId = url.searchParams.get('userId') ?? '';
  const isNewTenant = url.searchParams.get('isNewTenant') === 'true';

  truncateQueryParamsFromCurrentUrl();

  // let user: User | undefined;
  // try {
  //   user = (
  //     await baseService.get(`${ApiRoutes.USERS}/${encodeURIComponent(username)}`, {
  //       headers: { Authorization: `Bearer ${accessToken || useStore.getState().jwt}`, user: username },
  //     })
  //   ).data;
  // } catch (err) {
  //   console.error(err);
  //   alert('Failed to fetch user details: ' + String(err));
  //   return;
  // }

  let resolvedBaseUrl;
  if (baseUrl) {
    resolvedBaseUrl = baseUrl?.startsWith('https') ? `${baseUrl}/api` : `https://${baseUrl}/api`;
    window?.localStorage?.setItem(NMUI_BASE_URL_LOCALSTORAGE_KEY, resolvedBaseUrl);
  } else {
    resolvedBaseUrl = window?.localStorage?.getItem(NMUI_BASE_URL_LOCALSTORAGE_KEY) ?? '';
  }
  axiosService.defaults.baseURL = resolvedBaseUrl;

  if (accessToken) {
    window?.localStorage?.setItem(NMUI_ACCESS_TOKEN_LOCALSTORAGE_KEY, accessToken);
  }
  if (username) {
    window?.localStorage?.setItem(NMUI_USERNAME_LOCALSTORAGE_KEY, username);
  }
  if (tenantId) {
    window?.localStorage?.setItem(NMUI_TENANT_ID_LOCALSTORAGE_KEY, tenantId);
  }
  if (tenantName) {
    window?.localStorage?.setItem(NMUI_TENANT_NAME_LOCALSTORAGE_KEY, tenantName);
  }
  if (amuiUserId) {
    window?.localStorage?.setItem(NMUI_AMUI_USER_ID_LOCALSTORAGE_KEY, amuiUserId);
  }

  useStore.getState().setStore({
    baseUrl: resolvedBaseUrl,
    jwt: accessToken || (window?.localStorage?.getItem(NMUI_ACCESS_TOKEN_LOCALSTORAGE_KEY) ?? ''),
    tenantId: tenantId || (window?.localStorage?.getItem(NMUI_TENANT_ID_LOCALSTORAGE_KEY) ?? ''),
    tenantName: tenantName || (window?.localStorage?.getItem(NMUI_TENANT_NAME_LOCALSTORAGE_KEY) ?? ''),
    amuiAuthToken,
    username: username || (window?.localStorage?.getItem(NMUI_USERNAME_LOCALSTORAGE_KEY) ?? ''),
    amuiUserId: amuiUserId || (window?.localStorage?.getItem(NMUI_AMUI_USER_ID_LOCALSTORAGE_KEY) ?? ''),
    isNewTenant: isNewTenant,
    // user,
  });
}

// token interceptor for axios
axiosService.interceptors.request.use((config) => {
  const token = useStore.getState().jwt;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosService.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const errReqUrl = err.config.url;
    // Check if the error is a 401 response and if the original request was not a login request
    if (err.response?.status === 401 && errReqUrl !== ApiRoutes.LOGIN) {
      useStore.getState().logout();
      // Full redirect the user to the login page or display a message
      window.location.href = '/login';
    }
    // Return the error so it can be handled by the calling code
    return Promise.reject(err);
  },
);
