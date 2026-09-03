import { StyleSheet } from 'react-native';
import colors from './color';

const global = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: colors.white,
    // alignItems: 'center' // added to position the Rayyan text logo
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.lightBackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },

  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  formContainer: { justifyContent: 'space-between', flex: 1 },

  row: {
    flexDirection: 'row',
  },

  column: {
    flexDirection: 'column',
  },

  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerOne: {
    justifyContent: 'center',
  },

  centerTwo: {
    alignItems: 'center',
  },

  itemsEnd: {
    alignItems: 'flex-end',
  },

  width100: {
    width: '100%',
  },

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },

  flexCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexRowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },

  widthCenter: {
    alignItems: 'center',
    width: '100%',
  },

  width100flex: {
    flexDirection: 'row',
    width: '100%',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flexEnd: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  columnEnd: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default global;
