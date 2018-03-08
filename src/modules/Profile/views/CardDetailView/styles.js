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
  container: {
    padding: 20,
    backgroundColor: '$colors.min',
    flex: 1,
  },
  link: {
    color: 'royalblue',
    fontWeight: 'bold',
    fontSize: 16,
  },
  field: {
    marginVertical: 16,
  },
  fieldLabel: {
    color: '$colors.max',
    fontSize: 16,
    marginBottom: 4,
  },
  fieldText: {
    color: '$colors.max',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold'
  },
});

export default styles;
