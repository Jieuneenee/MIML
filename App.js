import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {View, Text, Button} from 'react-native';

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator();

// 스타일 컴포넌트 정의
const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

const StyledText = styled(Text)`
  font-size: 20px;
  color: #343a40;
`;

// 첫 번째 화면(HomeScreen)
const HomeScreen = ({navigation}) => (
  <StyledView>
    <StyledText>Hello, styled-components!</StyledText>
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate('Details')}
    />
  </StyledView>
);

// 두 번째 화면(DetailsScreen)
const DetailsScreen = ({navigation}) => (
  <StyledView>
    <StyledText>This is the Details Screen</StyledText>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </StyledView>
);

// App 컴포넌트
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
