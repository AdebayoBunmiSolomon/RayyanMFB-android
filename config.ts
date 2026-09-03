import Config from 'react-native-config';

export const IS_RETAIL = Config.APP_TYPE === 'retail';
export const IS_CORPORATE = Config.APP_TYPE === 'corporate';
export const BASE_URL = 'https://ibank.rayyanbank.com.ng/api';
