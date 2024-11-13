import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// 스크린 컴포넌트 불러오기
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ChartScreen from './src/screens/ChartScreen';
import ChartDetailScreen from './src/screens/ChartDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TestIcon from './src/screens/TestIcon'; // 아이콘 테스트용
import TodayPlaylistScreen from './src/screens/TodayPlaylistScreen';
import MyPlaylistScreen from './src/screens/MyPlaylistScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route, navigation}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'AddPost') {
          iconName = focused ? 'add' : 'add-outline';
        } else if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        } else if (route.name === 'Chart') {
          iconName = focused ? 'menu' : 'menu-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      /*아이콘 색상은 피그마와 동일하게 설정*/
      tabBarActiveTintColor: '#FFFFFF', // 활성화된 아이콘 색상
      tabBarInactiveTintColor: '#999999', // 비활성화된 아이콘 색상
      tabBarStyle: {
        backgroundColor: '#0A0A0A', // 탭 배경 색상
        height: 60, // 탭 높이 조절
      },
      headerShown: false,
    })}>
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="AddPost" component={AddPostScreen} />
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Chart" component={ChartScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen // 아이콘 테스트용
          name="TestIcon"
          component={TestIcon}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chart"
          component={ChartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChartDetail"
          component={ChartDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TodayPlaylist"
          component={TodayPlaylistScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPlaylist"
          component={MyPlaylistScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
