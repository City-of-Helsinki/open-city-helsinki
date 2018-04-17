import EStyleSheet from 'react-native-extended-stylesheet';
import Color from 'color';

styles = EStyleSheet.create({
  $inputBackground: () => Color(EStyleSheet.value('$colors.max')).alpha(0.03),
  text: {
    fontSize: 20,
    color: '$colors.max',
  },
  description: {
    fontSize: 20,
    color: '$colors.max',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 16,
    color: '$colors.max',
  },
  subHeader: {
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: '$colors.med',
    padding: 16,
    marginVertical: 4,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: '$colors.med',
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '$colors.min',
    flex: 1,
  },
  button: {
    marginVertical: 20,
    borderWidth: 2,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  link: {
    color: 'royalblue',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
  },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInput: {
    lineHeight: 32,
    width: 32,
    fontSize: 16,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  pinCodeContainer: {
    width: 42,
    height: 42,
    marginHorizontal: 4,
    backgroundColor: '$inputBackground',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
