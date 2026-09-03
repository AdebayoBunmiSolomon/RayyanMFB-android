import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  colors,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../theme/metrics';
import Svg, { Path } from 'react-native-svg';
import { useAppSelector } from '../hooks/hook';

interface AccordionProps {
  title?: string;
  initialState: boolean;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  initialState,
  title,
  children,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  const [isExpanded, setIsExpanded] = useState(initialState || false);

  // const handleClick = React.memo(() => {
  //   children && setIsExpanded(isExpanded => !isExpanded); //prevent accordions without children from being expandable
  // });

  const handleClick = () => {
    children && setIsExpanded(isExpanded => !isExpanded); //prevent accordions without children from being expandable
  };

  return (
    <View
      style={{
        marginTop: verticalScale(15),
        paddingHorizontal: horizontalScale(10),
      }}
    >
      <TouchableOpacity onPress={() => handleClick()} style={styles.accordion}>
        <View style={styles.accordionView}>
          <View>
            <Text
              style={{
                ...styles.titleText,
                color:
                  currentTheme === 'dark' ? colors.white : colors.appPrimary,
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>

          {isExpanded ? (
            <View>
              {/* <Down /> */}
              <Svg width={14} height={9} fill="none">
                <Path
                  stroke={
                    currentTheme === 'dark' ? colors.white : colors.stroke
                  }
                  d="m13 1.5-6 6-6-6"
                />
              </Svg>
            </View>
          ) : (
            <View>
              {/* <Up /> */}
              <Svg width={14} height={8} fill="none">
                <Path
                  stroke={
                    currentTheme === 'dark' ? colors.white : colors.stroke
                  }
                  d="m1 7.5 6-6 6 6"
                />
              </Svg>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {isExpanded ? <View>{children}</View> : null}
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  accordionView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  accordion: {
    width: '100%',
  },

  titleText: {
    color: colors.appPrimary,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
  },
});
