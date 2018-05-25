import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MarkerPin from 'Helsinki/img/marker_pin_helsinki.png';

const MARKER_IMAGE_SIZE = 24;


const styles = EStyleSheet.create({
  markerImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  markerContainer: {
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
  },
});

export default CustomMarker = () => {
  return (
    <View
      style={styles.markerContainer}
    >
      <Image
        source={MarkerPin}
        style={[
          styles.markerImage,
        ]}
      />
    </View>
  );
};
