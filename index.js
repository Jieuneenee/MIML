/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App'; // 경로가 맞는지 확인
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
