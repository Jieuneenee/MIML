import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {fetchMyPlaylist} from '../utils/fetchMyPlaylist.js';
import RenderPlaylist from '../components/renderPlaylist.js';

const MyPlaylistScreen = ({navigation}) => {
  // 현재 노래 데이터를 관리할 상태
  const [playlistData, setPlaylistData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // 처음에 데이터 불러오기

  const fetchData = async () => {
    const UserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    console.log(`userId: ${UserId}, token: ${token}`);

    try {
      // API 함수 호출
      const playlistType = 'my'; // playlistType 변수 선언
      const data = await fetchMyPlaylist(token, playlistType, UserId, error =>
        console.error(`My Playlist Error:`, error),
      );
      console.log(data);
      setPlaylistData(data);

      console.log(`나만의 플레이리스트 호출...`);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Text style={styles.gobackButton}>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title2}>나만의 PlayList</Text>
      </View>

      {/* 나만의 플레이리스트를 화면에 렌더링 */}
      {/* renderChart 컴포넌트에 상태와 함수 전달 */}
      <RenderPlaylist chartType={'myPlaylist'} playlistData={playlistData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#111111', // 어두운 배경
  },
  titleContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
  },
  gobackButton: {
    color: 'white', // 글씨색을 흰색으로 설정
    fontSize: 14,
    marginTop: 40,
    marginLeft: 10,
  },
  title1: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
  title2: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
    marginBottom: 29,
  },
  checkmark: {
    fontSize: 14, // 원하는 크기로 설정
    color: 'white', // 체크마크 색상 흰색으로 설정
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5, // 버튼과 텍스트 사이의 간격을 조금만 띄움
  },
  chartTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 버튼들 간의 간격을 균등하게 배치
    width: '100%', // 부모 요소가 화면 전체를 차지하도록 설정
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // 글씨색을 흰색으로 설정
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyPlaylistScreen;
