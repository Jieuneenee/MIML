import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import RenderSongs from '../components/renderSongs.js';

import {fetchTodayPlaylistData} from '../utils/fetchTodayPlaylistData.js';

const MyPlaylistScreen = ({navigation}) => {
  // 각 차트 데이터를 별도로 관리할 상태
  const [playlistData, setPlaylistData] = useState([]);
  const [allButton, setAllButton] = useState(false); //전체선택 버튼 상태
  const [selectedSong, setSelectedSong] = useState([]); // selectedSong 상태 관리

  // 컴포넌트가 처음 렌더링될 때
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dailyData = await fetchTodayPlaylistData(); // 나중에 MyPlaylist API로 바꾸기!!
      setPlaylistData(dailyData);
      console.log(`fetchData() 호출됨... 오늘의 플레이리스트`);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleBackPress = () => {
    navigation.navigate('Chart');
  };

  // 전체선택 버튼 함수
  const toggleAllSelectButton = () => {
    setAllButton(!allButton);
    if (!allButton) {
      // 선택된 차트 타입에 따라 각 차트 데이터 배열을 참조
      let chartData = playlistData;
      // 전체 선택 상태로 변경 시 해당 차트 데이터의 모든 곡 ID를 선택
      setSelectedSong(chartData.map(song => song.id));
    } else {
      // 전체 선택 해제 시 모든 곡 선택 해제
      setSelectedSong([]);
    }
  };

  // 전체선택 버튼 스타일
  const allButtonStyle = {
    width: 20,
    height: 20,
    marginRight: 1, // 버튼과 텍스트 사이 간격 설정
    borderRadius: 15,
    borderWidth: 1,
    borderWidth: allButton ? 0 : 1, // allButton이 true일 때 테두리 없애기
    borderColor: allButton ? 'transparent' : 'white', // allButton이 true일 때 테두리 색상 없애기
    backgroundColor: allButton ? '#1ED760' : 'transparent', // 상태에 따라 배경색 변경
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.buttonText}>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title2}>나만의 PlayList</Text>
      </View>

      {/* 전체 선택/선택 해제 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={allButtonStyle}
          onPress={toggleAllSelectButton}>
          {allButton && <Text style={styles.checkmark}>✔</Text>}
          {/* 체크 표시 */}
        </TouchableOpacity>
        <Text style={styles.text}>{allButton ? '선택 해제' : '전체 선택'}</Text>
      </View>

      {/* 선택된 차트를 화면에 렌더링 */}
      {/* renderChart 컴포넌트에 상태와 함수 전달 */}
      <RenderSongs
        chartType={'playlist'}
        allButton={allButton} // 전체선택 상태
        setAllButton={setAllButton} // 전체선택 버튼 상태 변경 함수
        selectedSong={selectedSong}
        setSelectedSong={setSelectedSong}
        dailyChartData={[]}
        weeklyChartData={[]}
        monthlyChartData={[]}
        yearlyChartData={[]}
        playlistData={playlistData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#111111', // 어두운 배경
  },
  titleContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
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
    marginTop: 30,
    marginLeft: 60,
    marginBottom: 28,
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
