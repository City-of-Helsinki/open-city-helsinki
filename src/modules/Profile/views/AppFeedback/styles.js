import { Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  innerContainer: {
    flexDirection: 'column',
    padding: 20,
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '$colors.max',
    marginBottom: 12,
  },
  titleText: {
    backgroundColor: '#9b9b9b1a',
    height: 40,
    padding: 8,
  },
  descriptionView: {
    flex: 1,
    marginTop: 8,
  },
  descriptionText: {
    height: 400,
    alignSelf: 'stretch',
    backgroundColor: '#9b9b9b1a',
    textAlignVertical: 'top',
    padding: 8,
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
