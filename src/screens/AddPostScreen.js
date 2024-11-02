import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AddPostScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AddPostScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddPostScreen;
