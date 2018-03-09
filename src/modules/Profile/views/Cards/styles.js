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
  },
  subHeader: {
    backgroundColor: '#D9DADD',
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
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 36,
    alignItems: 'flex-start'
  },
  buttonIcon: {
    marginHorizontal: 12
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '$colors.min',
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 0,

  },
  buttonText: {
    color: '$colors.min',
    fontSize: 24,
  },
  cardText: {
    color: '$colors.max',
    fontWeight: 'bold',
    fontSize: 24,
  },
  container: {
    padding: 20,
    backgroundColor: '#94C2E8',
    flex: 1,
  },
  button: {
    marginVertical: 20,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default styles;
