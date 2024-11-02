import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TestIcon = () => (
  <View
    style={{flexDirection: 'row', justifyContent: 'space-around', padding: 20}}>
    <Icon name="menu-outline" size={30} color="#900" />
  </View>
);

export default TestIcon;
