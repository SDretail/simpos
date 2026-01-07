import axios from 'axios';
import get from 'lodash.get';
import camelcaseKeys from 'camelcase-keys';
import { AuthUserMeta } from '../db';

// Obtener la URL de Odoo desde variables de ambiente
// Fallback a localhost si no está definida
const ODOO_URL = import.meta.env.VITE_ODOO_URL || 'http://localhost:8069';

export const simApi = axios.create({
  baseURL: ODOO_URL,
});

simApi.interceptors.response.use(
  async function (response) {
    if (response.data.error) {
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
