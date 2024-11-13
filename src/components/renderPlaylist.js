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
const RenderPlaylist = ({
  chartType,
  dailyChartData,
  weeklyChartData,
  monthlyChartData,
  yearlyChartData,
  playlistData,
}) => {
  console.log('노래렌더링 함수입니다...');
  const [allButton, setAllButton] = useState(false); //전체선택 버튼 상태
  const [selectedSong, setSelectedSong] = useState({}); // selectedSong 상태 관리

  useEffect(() => {
    // 차트 타입이 변경될 때 전체선택 버튼 해제
    setAllButton(false); // 전체선택 버튼을 해제 상태로 설정
    setSelectedSong({}); // 선택된 노래 초기화
  }, []); // chartType이 변경될 때마다 실행

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

  if (!data || data.length === 0) {
    console.log('렌더링 할 데이터가 없습니다...');
    return null;
  }
  // 데이터를 고유 ID가 포함된 데이터로 변환
  let dataWithIds = data.map((item, index) => ({
    ...item,
    //id: uuid.v4(), // 고유 ID를 각 항목에 추가 -> 이거 쓰면... id가 랜덤이라 리렌더링 문제 발생! id 넘겨달라고 해야함!!
    //rank: index + 1, // 1부터 시작하는 순위 추가
  }));

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

  // 전체선택 버튼 함수
  const toggleAllSelectButton = () => {
    const newAllButtonState = !allButton;
    setAllButton(newAllButtonState);

    if (newAllButtonState) {
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
      } else {
        chartData = playlistData;
      }

      // 전체 선택 상태로 변경 시 해당 차트 데이터의 모든 곡 ID를 선택
      const newSelectedSongs = {};

      chartData.forEach(song => {
        newSelectedSongs[song.songId] = true; // 모든 곡을 선택 상태로 설정
      });
      setSelectedSong(newSelectedSongs);
    } else {
      // 전체 선택 해제 시 모든 곡 선택 해제
      setSelectedSong({});
    }
  };

  // 선택 상태가 변경될 때 전체 선택 버튼 상태 업데이트 -> react hook 렌더링 오류...
  /*useEffect(() => {
    // 모든 곡이 선택되었으면 -> allButton 상태 true
    if (Object.keys(selectedSong).length === dataWithIds.length) {
      setAllButton(true);
      console.log(
        `모든 곡이 선택되었습니다... ${Object.keys(selectedSong).length}곡`,
      );
    } else if (
      allButton &&
      Object.keys(selectedSong).length !== dataWithIds.length
    ) {
      setAllButton(false);
      console.log(
        `전체 선택이 해지되었습니다...${Object.keys(selectedSong).length}곡`,
      );
    }
  }, [selectedSong, dataWithIds.length]);*/

  // 노래 선택 함수
  const handleSongSelect = songId => {
    setSelectedSong(prevState => {
      const newSelectedSongs = {...prevState};
      if (newSelectedSongs[songId]) {
        // 이미 선택된 노래라면
        delete newSelectedSongs[songId];
        setAllButton(false); // 전체선택 버튼 해제
      } else {
        // 선택되지 않은 노래라면
        newSelectedSongs[songId] = true;
      }
      return newSelectedSongs;
    });
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

  // Add to Playlist 버튼 클릭 시
  const handleAddToPlaylist = () => {
    // Add to Playlist 버튼 클릭 시 selectedSong, allButton 초기화
    console.log('Add to Playlist 클릭됨');
    setSelectedSong({});
    setAllButton(false);
  };

  return (
    <View>
      {/* AddtoPlaylist 버튼을 FlatList 위에 고정 */}
      {Object.keys(selectedSong).length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToPlaylist}>
          <Text style={styles.addButtonText}>Add to Playlist</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={dataWithIds}
        keyExtractor={item => item.songId}
        ListHeaderComponent={
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={allButtonStyle}
              onPress={toggleAllSelectButton}>
              {allButton && <Text style={styles.checkmark}>✔</Text>}
              {/* 체크 표시 */}
            </TouchableOpacity>
            <Text style={styles.allSelectedText}>
              {allButton ? '선택 해제' : '전체 선택'}
            </Text>
          </View>
        }
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
    </View>
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
  buttonContainer: {
    flexDirection: 'row', // 요소들을 가로로 나란히 배치
    justifyContent: 'flex-start', // 왼쪽 정렬
    marginBottom: 5,
    marginLeft: 10,
  },
  checkmark: {
    fontSize: 14, // 원하는 크기로 설정
    color: 'white', // 체크마크 색상 흰색으로 설정
  },
  allSelectedText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 10, // 버튼과 텍스트 사이의 간격을 조금만 띄움
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5, // 버튼과 텍스트 사이의 간격을 조금만 띄움
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
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 20,
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
  addButton: {
    width: 190,
    height: 60,
    backgroundColor: '#1ED760', // 피그마 색상 참조
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    top: 680, // 화면 상단에서 10픽셀 떨어지게 위치
    left: '50%', // 가로 중앙
    transform: [{translateX: -100}], // 버튼 크기 (200px)로 가정하고 가운데 배치
    zIndex: 1, // 다른 요소들 위에 오도록 설정
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
});

export default RenderPlaylist;
