import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';
import { AuthUserMeta, authUserMeta } from '../db';

// Obtener la URL de Odoo desde variables de ambiente
// Fallback a localhost si no está definida
const ODOO_URL = import.meta.env.VITE_ODOO_URL || 'http://localhost:8069';

export const simApi = axios.create({
  baseURL: ODOO_URL,
});

export const setBaseUrl = (url: string) => {
  simApi.defaults.baseURL = url;
};

export const getBaseUrl = () => {
  return simApi.defaults.baseURL;
};

simApi.interceptors.response.use(
  async function (response) {
    if (response.data.error) {
      // Check for Odoo session expiry (code 100 or specific exception name)
      if (
        response.data.error.code === 100 ||
        response.data.error.message === 'Odoo Session Expired' ||
        response.data.error.data?.name === 'odoo.http.SessionExpiredException'
      ) {
        console.warn('Session expired, clearing token');
        await authUserMeta.deleteAuth();
      }

      const message = get(response, 'data.error.data.message', 'Request error');
      throw new Error(`${message} (${response.config.url})`);
    }

    return camelcaseKeys(get(response, 'data.result', {}), {
      deep: true,
    });
  },
  function (error) {
    if (error.response?.data?.includes('odoo.http.SessionExpiredException')) {
      throw new Error('Unauthorized error');
    }
    throw new Error('Uncaught error');
  },
);

export const updateSimApiToken = (meta: AuthUserMeta) => {
  if (!meta.accessToken) {
    console.warn('token is blank or undefined');
  }
  simApi.defaults.headers.common['Authorization'] =
    `Bearer ${meta.accessToken}`;
};
