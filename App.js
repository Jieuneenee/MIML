import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {Keyboard} from 'react-native';
import Toast from 'react-native-toast-message';

// 스크린 컴포넌트 불러오기
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ChartScreen from './src/screens/ChartScreen';
import ChartDetailScreen from './src/screens/ChartDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
//import TestIcon from './src/screens/TestIcon'; // 아이콘 테스트용
import TodayPlaylistScreen from './src/screens/TodayPlaylistScreen';
import MyPlaylistScreen from './src/screens/MyPlaylistScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import FollowersScreen from './src/screens/FollowersScreen';
import OtherProfileScreen from './src/screens/OtherProfileScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 키보드 열림/닫힘 이벤트 감지
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AddPost') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chart') {
            iconName = focused ? 'menu' : 'menu-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          height: 60,
          display: isKeyboardVisible ? 'none' : 'flex', // 키보드가 열리면 탭 바 숨기기
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddPost" component={AddPostScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chart" component={ChartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

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
        <Stack.Screen
          name="Following"
          component={FollowingScreen}
          options={{
            headerTitle: false,
            headerStyle: {
              backgroundColor: '#000',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Followers"
          component={FollowersScreen}
          options={{
            headerTitle: false,
            headerStyle: {
              backgroundColor: '#000',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="OtherProfile"
          component={OtherProfileScreen}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#000',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={SongDetailScreen}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#222',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerBackTitleVisible: false,
          }}
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
      <Toast />
    </NavigationContainer>
  );
};

export default App;
