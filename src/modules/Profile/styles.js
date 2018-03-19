import EStyleSheet from 'react-native-extended-stylesheet';

styles = EStyleSheet.create({
  text: {
    fontSize: 20,
    color: '$colors.max',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '$colors.max',
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: '$colors.min',
    padding: 16,
    marginVertical: 4,
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#94C2E8',
    flex: 1,
  },
  button: {
    marginVertical: 20,
  },
  buttonIcon: {
    marginRight: 8
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
  subHeader: {
    backgroundColor: '#D9DADD',
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default styles;
