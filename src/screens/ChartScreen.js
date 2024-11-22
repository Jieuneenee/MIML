import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {useSelectedSongs} from '../context/SelectedSongsContext.js';
import moment from 'moment';

import {fetchChartData} from '../utils/fetchChartData.js';

import renderChart from '../components/renderChart.js';
import RenderChart from '../components/renderChart.js';

const ChartScreen = ({navigation}) => {
  const [currentDate, setCurrentDate] = useState('');
  // 각 차트 데이터를 별도로 관리할 상태
  const [dailyChartData, setDailyChartData] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [yearlyChartData, setYearlyChartData] = useState([]);
  // 차트 타입 관리 상태
  const [chartType, setChartType] = useState('daily');

  const goToDetailScreen = () => {
    navigation.navigate('ChartDetail', {
      dailyChartData,
      weeklyChartData,
      monthlyChartData,
      yearlyChartData,
    });
  };
  const goTodayPlaylistScreen = () => {
    navigation.navigate('TodayPlaylist');
  };
  const goMyPlaylistScreen = () => {
    navigation.navigate('MyPlaylist');
  };

  useEffect(() => {
    // 처음 렌더링 될 때 날짜와 시간을 설정
    setCurrentDate(moment().format('HH:mm'));
  }, []);

  useFocusEffect(
    // 화면에 포커스될 때마다 시간과 차트 업데이트
    React.useCallback(() => {
      setCurrentDate(moment().format('HH:mm'));

      const fetchData = async () => {
        try {
          const [daily, weekly, monthly, yearly] = await fetchChartData(); // API 함수 호출에 await 사용
          setDailyChartData(daily);
          setWeeklyChartData(weekly);
          setMonthlyChartData(monthly);
          setYearlyChartData(yearly);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };

      fetchData(); // 비동기 함수 호출
    }, []),
  );

  const handleChartSelect = chartType => {
    console.log('버튼을 눌렀습니다...');
    switch (chartType) {
      case 'daily':
        setChartType('daily');
        break;
      case 'weekly':
        setChartType('weekly');
        break;
      case 'monthly':
        setChartType('monthly');
        break;
      case 'yearly':
        setChartType('yearly');
      default:
        break;
    }
  };

  // 각 차트 데이터를 4개로 제한
  const getLimitedData = data => {
    return data.slice(0, 4); // 배열의 첫 4개 항목만 반환
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
  // 플레이리스트 버튼 스타일
  const playlistButtonStyle = {
    width: 164,
    height: 164,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: 'linear-gradient(180deg, #FF6F61, #FF9B7F)', // 그래디언트 배경
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonTextStyle = {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListEmptyComponent={
        <>
          <View style={styles.container}>
            {/* 차트 렌더링 */}
            <Text style={styles.title1}>오늘 {currentDate} 기준</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title2}>Music Chart</Text>
              <TouchableOpacity onPress={goToDetailScreen}>
                <Text style={styles.title3}>전체보기</Text>
              </TouchableOpacity>
            </View>

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={
                  chartType === 'daily'
                    ? selectedButtonStyle
                    : unselectedButtonStyle
                }
                onPress={() => handleChartSelect('daily')}>
                <Text style={styles.buttonText}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  chartType === 'weekly'
                    ? selectedButtonStyle
                    : unselectedButtonStyle
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
                  chartType === 'yearly'
                    ? selectedButtonStyle
                    : unselectedButtonStyle
                }
                onPress={() => handleChartSelect('yearly')}>
                <Text style={styles.buttonText}>Yearly</Text>
              </TouchableOpacity>
            </View>

            {/* 선택된 차트를 화면에 렌더링 */}
            <RenderChart
              chartType={chartType}
              dailyChartData={getLimitedData(dailyChartData)}
              weeklyChartData={getLimitedData(weeklyChartData)}
              monthlyChartData={getLimitedData(monthlyChartData)}
              yearlyChartData={getLimitedData(yearlyChartData)}
            />

            {/* 플레이리스트 렌더링 */}
            <ScrollView>
              <Text style={styles.title4}>Playlist</Text>
              <View style={styles.playlistContainer}>
                <TouchableOpacity onPress={goTodayPlaylistScreen}>
                  <LinearGradient
                    colors={['#FF6F61', '#FF9B7F']}
                    style={playlistButtonStyle}>
                    <Text style={buttonTextStyle}>#Today</Text>
                    <Text style={buttonTextStyle}>PLAYLIST</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={goMyPlaylistScreen}>
                  <LinearGradient
                    colors={['#D19E9E', '#FDEEDE']}
                    style={playlistButtonStyle}>
                    <Text style={buttonTextStyle}>#나만의</Text>
                    <Text style={buttonTextStyle}>PLAYLIST</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 채우기 위한 설정
    flexGrow: 1, // ScrollView에서 스크롤 가능하도록 설정
    backgroundColor: '#111111', // 어두운 배경
  },
  titleContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
    marginLeft: 20,
  },
  title1: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  title2: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 5,
  },
  title3: {
    color: 'white',
    fontSize: 17,
    marginRight: 10,
    marginLeft: 95,
    marginTop: 12,
  },
  title4: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 30,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 버튼들 간의 간격을 균등하게 배치
    width: '100%', // 부모 요소가 화면 전체를 차지하도록 설정
    marginTop: 20,
    marginBottom: 17,
  },
  buttonText: {
    color: 'white', // 글씨색을 흰색으로 설정
    fontSize: 14,
    fontWeight: 'bold',
  },
  playlistContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'space-around', // 요소들을 균등하게 배치
    marginBottom: 40,
  },
});

export default ChartScreen;
