import React, {useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import uuid from 'react-native-uuid';

// 노래를 렌더링하는 함수
const RenderSongs = ({
  chartType,
  allButton,
  setAllButton,
  selectedSong,
  setSelectedSong,
  dailyChartData,
  weeklyChartData,
  monthlyChartData,
  yearlyChartData,
  playlistData,
}) => {
  console.log('노래렌더링 함수입니다...');

  let data =
    chartType === 'daily'
      ? dailyChartData
      : chartType === 'weekly'
      ? weeklyChartData
      : chartType === 'monthly'
      ? monthlyChartData
      : chartType === 'yearly'
      ? yearlyChartData
      : playlistData;

  // 데이터를 고유 ID가 포함된 데이터로 변환
  let dataWithIds = data.map((item, index) => ({
    ...item,
    //id: uuid.v4(), // 고유 ID를 각 항목에 추가 -> 이거 쓰면... id가 랜덤이라 리렌더링 문제 발생! id 넘겨달라고 해야함!!
    //rank: index + 1, // 1부터 시작하는 순위 추가
  }));

  if (!data || data.length === 0) {
    console.log('렌더링 할 데이터가 없습니다...');
    return null;
  }

  // allButton 상태가 변경될 때 모든 노래 선택/해제
  useEffect(() => {
    if (allButton) {
      // 모든 노래를 선택 상태로 설정
      const allSelectedSongs = {};
      dataWithIds.forEach(item => {
        allSelectedSongs[item.songId] = true;
      });
      setSelectedSong(allSelectedSongs);
    } else {
      // 모든 노래 선택 해제
      setSelectedSong({});
    }
  }, [allButton, chartType]);

  // 선택 상태가 변경될 때 전체 선택 버튼 상태 업데이트
  useEffect(() => {
    if (Object.keys(selectedSong).length !== dataWithIds.length && allButton) {
      setAllButton(false);
    }
  }, [selectedSong, dataWithIds.length, allButton, setAllButton]);

  // 노래 선택 함수
  const handleSongSelect = songId => {
    setSelectedSong(prevState => ({
      ...prevState,
      [songId]: !prevState[songId], // 해당 노래 선택 상태를 토글
    }));
  };

  // 노래 버튼 스타일링 함수
  const getButtonStyle = songId => {
    const isSelected = selectedSong[songId]; // 선택된 노래 확인
    return {
      width: 20,
      height: 20,
      marginRight: 1, // 버튼과 텍스트 사이 간격 설정
      borderRadius: 15,
      borderWidth: isSelected ? 0 : 1, // 선택된 버튼은 테두리 없앰
      borderColor: isSelected ? 'transparent' : 'white', // 선택된 버튼은 테두리 색상 없앰
      backgroundColor: isSelected ? '#1ED760' : 'transparent', // 선택된 버튼은 배경색을 녹색으로
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  return (
    <FlatList
      data={dataWithIds}
      keyExtractor={item => item.songId}
      renderItem={({item}) => (
        <View style={styles.container}>
          {/* 동그라미 선택 버튼 */}
          <TouchableOpacity
            style={getButtonStyle(item.songId)}
            onPress={() => handleSongSelect(item.songId)}></TouchableOpacity>

          {/* 앨범 사진 */}
          <Image
            style={styles.image}
            source={require('../asset/images/albumImage1.jpg')}
          />

          {/* 노래 순위 */}
          <Text style={styles.rank}>{item.rank}</Text>

          {/* 노래 제목과 가수 이름 */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.title}>{item.artist}</Text>
          </View>
          {/* 스포티파이 버튼 */}
          <TouchableOpacity onPress={() => console.log('스포티파이재생버튼')}>
            <Image
              source={{
                uri: 'https://cdn.pixabay.com/photo/2022/08/21/22/17/icon-7402243_1280.png',
              }}
              style={styles.spotifyImage}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#111111', // 어두운 배경
  },
  circleButton: {
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white', // 흰색 테두리 설정
    backgroundColor: 'transparent', // 배경색을 투명하게 설정 (필요에 따라 수정)
  },
  selectedCircle: {
    backgroundColor: '#4CAF50',
    borderColor: 'green',
  },
  unselectedCircle: {
    backgroundColor: 'transparent',
    borderColor: '#ddd',
  },
  rank: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  image: {
    width: 59,
    height: 59,
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  artist: {
    fontSize: 14,
    color: 'white',
  },
  spotifyImage: {
    marginLeft: 2,
    width: 100,
    height: 100,
  },
});

export default RenderSongs;
