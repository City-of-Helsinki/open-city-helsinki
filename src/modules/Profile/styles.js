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
  profileTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '$colors.max',
  },
  infoTitle: {
    fontSize: 16,
    color: '$colors.max',
    marginRight: 12,
  },
  linkTitle: {
    color: 'royalblue',
    fontSize: 16,
    marginRight: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: '$colors.max',
    marginRight: 8,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: '$colors.min',
    padding: 16,
    marginVertical: 2,
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    // padding: 20,
    backgroundColor: '$colors.min',
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '$colors.copper',
    flex: 1,
  },
  button: {
    marginVertical: 20,
  },
  buttonIcon: {
    marginRight: 8,
    height: 32,
    width: 32,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
  subHeader: {
    backgroundColor: '$colors.min',
    marginVertical: 60,
    marginHorizontal: 24,
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
  row: {
    marginTop: 24,
    flexDirection: 'row',
    marginHorizontal: 12,
  },
});

export default styles;
