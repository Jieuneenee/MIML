import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {fetchTodayPlaylist} from '../utils/fetchTodayPlaylist.js';
import RenderPlaylist from '../components/renderPlaylist.js';

const TodayPlaylistScreen = ({navigation}) => {
  // 각 차트 데이터를 별도로 관리할 상태
  const [playlistData, setPlaylistData] = useState([]);
  const [allButton, setAllButton] = useState(false); //전체선택 버튼 상태
  const [selectedSong, setSelectedSong] = useState([]); // selectedSong 상태 관리
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null); // 토큰, 유저아이디 상태

  // 처음 렌더링될 때 오늘의 플레이리스트를 불러옵니다.
  useEffect(() => {
    fetchData();
  }, []); // 빈 배열은 컴포넌트 마운트 시 한번만 실행됨

  const fetchData = async () => {
    const UserId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('token');
    console.log(`userId: ${UserId}, token: ${token}`);

    try {
      // API 함수 호출
      const playlistType = 'today'; // chartType 변수 선언
      const data = await fetchTodayPlaylist(
        token,
        playlistType,
        UserId,
        error => console.error(`${chartType} Playlist Error:`, error),
      );
      console.log(data);
      setPlaylistData(data);

      console.log(`오늘의 플레이리스트 호출...`);
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
        <Text style={styles.title2}>오늘의 PlayList</Text>
      </View>

      {/* 선택된 차트를 화면에 렌더링 */}
      {/* renderChart 컴포넌트에 상태와 함수 전달 */}
      <RenderPlaylist chartType={'todayPlaylist'} playlistData={playlistData} />
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

export default TodayPlaylistScreen;
