/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { View } from 'tamagui';
import AdAferLoginCouple from '../../components/ads/AdAfterLoginCouple';
import randomNumber from '../../util/randomNumber';
import AdAferLoginPraying from '../../components/ads/AdAfterLoginPraying';

const AdvertScreen = () => {
  const [selectedAd] = useState(randomNumber(1, 2));

  return (
    <View flex={1}>
      {selectedAd === 1 ? <AdAferLoginPraying /> : <AdAferLoginCouple />}
    </View>
  );
};

export default AdvertScreen;
