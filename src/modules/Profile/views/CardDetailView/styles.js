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
    flexDirection: 'row',
    marginVertical: 20,
    paddingLeft: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 64,
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
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
