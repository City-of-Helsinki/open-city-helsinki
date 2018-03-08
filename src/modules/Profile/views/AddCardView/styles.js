import EStyleSheet from 'react-native-extended-stylesheet';

styles = EStyleSheet.create({
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
    justifyContent: 'center'
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold'
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
    justifyContent: 'center'
  },
  link: {
    color: 'royalblue',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default styles;
