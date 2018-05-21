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
    color: '$colors.max',
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: '$colors.med',
    padding: 16,
    marginVertical: 4,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: '#006FC2',
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    alignSelf: 'center',
    marginHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '$colors.min',
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 0,
    borderWidth: 2,
  },
  buttonText: {
    color: '$colors.min',
    fontSize: 18,
    marginLeft: 16,
  },
  cardText: {
    color: '$colors.max',
    fontWeight: 'bold',
    fontSize: 24,
  },
  container: {
    padding: 20,
    backgroundColor: '$colors.min',
    flex: 1,
  },
  scrollViewContainer: {
    // padding: 20,
    // flex: 1,
  },
  button: {
    marginVertical: 20,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default styles;
