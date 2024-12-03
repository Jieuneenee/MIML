import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
    fetchData(chartType, error =>
      console.error(`${chartType} Chart Error:`, error),
    );
  }, []); // 빈 배열은 컴포넌트 마운트 시 한번만 실행됨

  const fetchData = async chartType => {
    try {
      // chartType에 따라 데이터 가져옴
      const data = await fetchChartData(chartType, error =>
        console.error(`${chartType} Chart Error:`, error),
      );

      if (chartType === 'daily') {
        setDailyChartData(data);
      } else if (chartType === 'weekly') {
        setWeeklyChartData(data);
      } else if (chartType === 'monthly') {
        setMonthlyChartData(data);
      } else if (chartType === 'yearly') {
        setYearlyChartData(data);
      }
      console.log(`fetchData() 호출됨... 차트 타입: ${chartType}`);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleChartSelect = chartType => {
    console.log('차트타입을 변경했습니다...');
    setChartType(chartType); // 차트타입 변경
    setSelectedSong([]); // 선택된 노래 초기화
    setAllButton(false); // 전체 선택 버튼 초기화
    fetchData(chartType); // 차트 데이터를 새로 불러오는 함수 호출
  };

  // 차트 데이터가 비었는지 확인하는 함수
  const checkData = data => {
    // 데이터가 배열인지 확인하고, 배열이 아니면 빈 배열 반환
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  };

  // 차트 타입 버튼 스타일 정의
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
        dailyChartData={checkData(dailyChartData)}
        weeklyChartData={checkData(weeklyChartData)}
        monthlyChartData={checkData(monthlyChartData)}
        yearlyChartData={checkData(yearlyChartData)}
        playlistData={[]}
      />
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
    justifyContent: 'center',
    marginTop: -20,
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
    marginLeft: 0,
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
    marginBottom: 10,
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
