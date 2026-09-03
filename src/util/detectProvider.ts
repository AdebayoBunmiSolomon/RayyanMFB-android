import { NetworkProvider } from '../types';

/**
 * @param phoneNumber - The phone number in string format (with or without country code).
 * @returns {NetworkProvider} - The detected network provider or 'Unknown'.
 */

const detectNetworkProvider = (phoneNumber: string): NetworkProvider => {
  const cleanedNumber = phoneNumber.replace(/\D/g, ''); // Handle numbers with or without the +234 or 234 country code
  const formattedNumber = cleanedNumber.startsWith('234')
    ? cleanedNumber.slice(3) // Remove '234'
    : cleanedNumber.startsWith('0')
    ? cleanedNumber.slice(1) // Remove leading '0'
    : cleanedNumber; // Define network provider prefixes

  const prefixes: { [key: string]: string } = {
    MTN: '0703,0706,0803,0806,0810,0813,0814,0816,0903,0906,0913,0916',
    Airtel: '0701,0708,0802,0808,0812,0901,0902,0907,0912',
    Glo: '0705,0805,0807,0811,0815,0905,0915',
    '9Mobile': '0809,0817,0818,0908,0909',
    Smile: '0702',
    NTEL: '0804',
  };

  for (const [provider, prefixList] of Object.entries(prefixes)) {
    const prefixArray = prefixList.split(',');

    if (prefixArray.some(prefix => `0${formattedNumber}`.startsWith(prefix))) {
      return provider as NetworkProvider;
    }
  }

  return 'Unknown'; // If no match found }
};

export default detectNetworkProvider;
