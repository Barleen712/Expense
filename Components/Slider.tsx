import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import styles from '../Screens/Stylesheet';

const { width } = Dimensions.get('window');

export default function CustomSlider(){
  const [sliderValue, setSliderValue] = useState(20); 


  const thumbPosition = (sliderValue / 100) * (width - 60); 

  return (
    <View style={styles.container1}>
      
      <View style={styles.sliderWrapper}>
        <View style={styles.trackBackground} />
        <View style={[styles.trackFill, { width: `${sliderValue}%` }]} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent" 
        />
        <View
          style={[
            styles.customThumb,
            { left: thumbPosition - 12 },
          ]}
        >
          <Text style={styles.thumbText}>{Math.round(sliderValue)}%</Text>
        </View>
      </View>
    </View>
  );
};




