import React from 'react';
import { Text } from 'tamagui';
import HighlightText from '@sanar/react-native-highlight-text';

interface SafeHighlightTextProps {
  highlightStyle: any;
  searchWords: string[];
  textToHighlight: string;
  style?: any;
}

const SafeHighlightText: React.FC<SafeHighlightTextProps> = ({
  highlightStyle,
  searchWords,
  textToHighlight,
  style,
}) => {
  try {
    // Check if HighlightText is available and working
    if (typeof HighlightText === 'undefined' || !HighlightText) {
      console.warn(
        'HighlightText is not available, falling back to regular text',
      );
      return <Text style={style}>{textToHighlight}</Text>;
    }

    // Check if searchWords is valid
    if (!Array.isArray(searchWords) || searchWords.length === 0) {
      return <Text style={style}>{textToHighlight}</Text>;
    }

    // Check if textToHighlight is valid
    if (!textToHighlight || typeof textToHighlight !== 'string') {
      return <Text style={style}>No text available</Text>;
    }

    return (
      <HighlightText
        highlightStyle={highlightStyle}
        searchWords={searchWords}
        textToHighlight={textToHighlight}
      />
    );
  } catch (error) {
    console.error('SafeHighlightText error:', error);
    return <Text style={style}>{textToHighlight}</Text>;
  }
};

export default SafeHighlightText;
