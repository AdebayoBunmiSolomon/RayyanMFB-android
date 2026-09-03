import Moment from 'moment';

export const formatToDecimal = (amount: number) => {
  return Number(amount)
    .toFixed(1)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const formatToCurrency = (value: number) => {
  // Ensure the value is a number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Format the number to currency without decimals
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);

  return formattedValue;
};

export const formatToNaira = (amount: number) => {
  let formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);

  return formattedAmount;
};

export const parseAmount = (amount?: string) => {
  return Number(amount?.replace(/,/g, '') || 0);
};

export const kFormatter = (num: number) => {
  return Math.abs(num) > 999
    ? (Math.sign(num) * Math.round(Math.abs(num) / 100)) / 10 + 'k'
    : Math.sign(num) * Math.abs(num);
};

export function replaceCharacters(str: string): string {
  if (str?.length === 10) {
    str = str
      .split('')
      .map((char: string, index: number) => {
        if (index >= 2 && index < 8) {
          return '*';
        } else {
          return char;
        }
      })
      .join('');
  }
  return str;
}

export const clearFormatAmount = (amount?: string) => {
  return parseFloat(amount?.replaceAll?.(',', '') ?? '');
};

export const Capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseTransactionDate = (item: any) => {
  // Try postedDate first (format: "2026-01-27 10:25:22")
  if (item?.postedDate) {
    return Moment(item.postedDate, 'YYYY-MM-DD HH:mm:ss');
  }

  // Try postDate (format: "27-Jan-2026")
  if (item?.postDate) {
    return Moment(item.postDate, 'DD-MMM-YYYY', true); // strict parsing
  }

  // Try tranDate as fallback (format: "27-Jan-2026")
  if (item?.tranDate) {
    return Moment(item.tranDate, 'DD-MMM-YYYY', true);
  }

  return null;
};
