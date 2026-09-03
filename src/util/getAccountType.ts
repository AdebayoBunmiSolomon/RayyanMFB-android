function getAccountType(username: string): 'corp' | 'retail' {
  return username.includes(':') ? 'corp' : 'retail';
}

export default getAccountType;
