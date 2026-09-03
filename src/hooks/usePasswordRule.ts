import { useEffect, useState } from 'react';

type passwordRules = {
  isEightStringLongerOrMore: boolean;
  isContainAtLeastOneDigit: boolean;
  isContainAtLeastOneUppercase: boolean;
  isContainAtLeastOneSpecialCharacter: boolean;
};

export const usePasswordRule = () => {
  const [isRuleHasError, setIsRuleHasError] = useState<boolean>(false);
  const [passwordVal, setPasswordVal] = useState<string>('');
  const [passwordRules, setPasswordRules] = useState<passwordRules>({
    isEightStringLongerOrMore: false,
    isContainAtLeastOneDigit: false,
    isContainAtLeastOneUppercase: false,
    isContainAtLeastOneSpecialCharacter: false,
  });

  const checkPasswordRules = (val: string) => {
    setPasswordVal(val);
  };

useEffect(() => {
  const updatedRules: passwordRules = {
    isEightStringLongerOrMore: passwordVal.length >= 8,
    isContainAtLeastOneDigit: /\d/.test(passwordVal),
    isContainAtLeastOneUppercase: /[A-Z]/.test(passwordVal),
    isContainAtLeastOneSpecialCharacter: /[@#$&!+]/.test(passwordVal),
  };

  setPasswordRules(updatedRules);
  setIsRuleHasError(!Object.values(updatedRules).every(Boolean));
}, [passwordVal]);

  return {
    passwordRules,
    checkPasswordRules,
    isRuleHasError,
  };
};
