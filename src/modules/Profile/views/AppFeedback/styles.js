import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,

  },
  labelText: {
    fontSize: 20,
    color: '$colors.max',
    marginBottom: 8,
  },
  contentContainer: {
    // padding: 16,
    flex: 1,
  },
  helpText: {
    color: '#7e8286',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleView: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 32,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '$colors.max',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    color: '$colors.max',
    paddingHorizontal: 4,
  },
  titleText: {
    backgroundColor: 'transparent',
    height: 40,
    padding: 8,
    borderBottomWidth: 2,
    marginBottom: 16,
  },
  descriptionView: {
    flex: 1,
    marginTop: 8,
  },
  descriptionText: {
    minHeight: 100,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderWidth: 2,
    textAlignVertical: 'top',
    padding: 8,
  },
  button: {
    marginVertical: 20,
    borderWidth: 2,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  buttonText: {
    color: '$colors.max',
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold',
  },
  attachmentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopColor: '#bfc0c3',
  },
  attachmentButton: {
    flex: 1,
    height: 46,
    backgroundColor: '#005eb8',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  attachmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thubmnailView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
