import React, {useState, useEffect, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RenderSongs from '../components/renderSongs.js';

import {fetchChartData} from '../utils/fetchChartData.js';

const ChartDetailScreen = ({navigation}) => {
  // 각 차트 데이터를 별도로 관리할 상태
  const [dailyChartData, setDailyChartData] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  const [chartType, setChartType] = useState('daily');
  const [allButton, setAllButton] = useState(false); //전체선택 버튼 상태
  const [selectedSong, setSelectedSong] = useState([]); // selectedSong 상태 관리

  // 컴포넌트가 처음 렌더링될 때 'daily' 차트 데이터를 불러옵니다.
  useEffect(() => {
    fetchData('daily');
  }, []); // 빈 배열은 컴포넌트 마운트 시 한번만 실행됨

  const fetchData = async chartType => {
    try {
      // chartType에 따라 적절한 데이터를 가져오도록 수정
      const [daily, weekly, monthly, yearly] = await fetchChartData(); // API 함수 호출
      if (chartType === 'daily') {
        setDailyChartData(daily);
      } else if (chartType === 'weekly') {
        setWeeklyChartData(weekly);
      } else if (chartType === 'monthly') {
        setMonthlyChartData(monthly);
      } else if (chartType === 'yearly') {
        setYearlyChartData(yearly);
      }
      console.log(`fetchData() 호출됨... 차트 타입: ${chartType}`);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleBackPress = () => {
    navigation.navigate('Chart');
  };

  const handleChartSelect = chartType => {
    console.log('버튼을 눌렀습니다...');
    setChartType(chartType); // 차트 타입 설정
    setSelectedSong([]); // 선택된 노래 초기화
    setAllButton(false); // 전체 선택 버튼 초기화
    fetchData(chartType); // 차트 데이터를 새로 불러오는 함수 호출
  };

  // 전체선택 버튼 함수
  const toggleAllSelectButton = () => {
    setAllButton(!allButton);
    if (!allButton) {
      // 선택된 차트 타입에 따라 각 차트 데이터 배열을 참조
      let chartData;
      if (chartType === 'daily') {
        chartData = dailyChartData;
      } else if (chartType === 'weekly') {
        chartData = weeklyChartData;
      } else if (chartType === 'monthly') {
        chartData = monthlyChartData;
      } else if (chartType === 'yearly') {
        chartData = yearlyChartData;
      }

      // 전체 선택 상태로 변경 시 해당 차트 데이터의 모든 곡 ID를 선택
      setSelectedSong(chartData.map(song => song.songId));
      console.log(`전체 선택됨: ${selectedSong.length}곡`);
    } else {
      // 전체 선택 해제 시 모든 곡 선택 해제
      setSelectedSong([]);
      console.log(`전체 선택 해제됨: ${selectedSong.length}곡`);
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

  // 차트 타입 버튼 스타일 정의(이걸 아예 StyleSheet으로 바꿀 순 없나..?)
  const selectedButtonStyle = {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    flexShrink: 0,
    backgroundColor: '#E8B4B4', // 선택된 버튼 배경색
  };

  const unselectedButtonStyle = {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    flexShrink: 0,
    borderColor: '#FFF', // 선택되지 않은 버튼 테두리 색
    borderWidth: 2,
    backgroundColor: 'transparent', // 배경은 투명
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
        <Text style={styles.title2}>Music Chart</Text>
      </View>

      {/* 버튼들 */}
      <View style={styles.chartTypeContainer}>
        <TouchableOpacity
          style={
            chartType === 'daily' ? selectedButtonStyle : unselectedButtonStyle
          }
          onPress={() => handleChartSelect('daily')}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            chartType === 'weekly' ? selectedButtonStyle : unselectedButtonStyle
          }
          onPress={() => handleChartSelect('weekly')}>
          <Text style={styles.buttonText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            chartType === 'monthly'
              ? selectedButtonStyle
              : unselectedButtonStyle
          }
          onPress={() => handleChartSelect('monthly')}>
          <Text style={styles.buttonText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            chartType === 'yearly' ? selectedButtonStyle : unselectedButtonStyle
          }
          onPress={() => handleChartSelect('yearly')}>
          <Text style={styles.buttonText}>Yearly</Text>
        </TouchableOpacity>
      </View>

      {/* 선택된 차트를 화면에 렌더링 */}
      {/* renderChart 컴포넌트에 상태와 함수 전달 */}
      <RenderSongs
        chartType={chartType}
        dailyChartData={dailyChartData}
        weeklyChartData={weeklyChartData}
        monthlyChartData={monthlyChartData}
        yearlyChartData={yearlyChartData}
        playlistData={[]}
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
    marginTop: 20,
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
    marginLeft: 60,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
    marginBottom: 10,
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
    marginBottom: 25,
  },
  buttonText: {
    color: 'white', // 글씨색을 흰색으로 설정
    fontSize: 14,
    fontWeight: 'bold',
  },
  gobackButton: {
    color: 'white', // 글씨색을 흰색으로 설정
    fontSize: 14,
    marginTop: 15,
    marginLeft: 10,
  },
});

export default ChartDetailScreen;
