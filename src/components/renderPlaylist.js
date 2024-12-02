/*

플레이리스트 노래 목록을 렌더링 해주는 컴포넌트
순위 O, 노래 선택 버튼 O

*/
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  addToMyPlaylist,
  deletefromMyPlaylist,
} from '../utils/fetchMyPlaylist.js';
import Toast from 'react-native-toast-message'; // 토스트 메시지 라이브러리

// 노래를 렌더링하는 함수
const RenderPlaylist = ({chartType, playlistData}) => {
  console.log('플레이리스트 렌더링 함수입니다...');
  const [selectedSong, setSelectedSong] = useState(null); // selectedSong 상태 관리
  const [showAddButton, setShowAddButton] = useState(false); // Add / Delete 버튼 표시 여부
  const [playlist, setPlaylist] = useState(playlistData || []); // 초기 플레이리스트 데이터 설정

  useEffect(() => {
    setSelectedSong(null); // 선택된 노래 초기화
    setShowAddButton(false); // 버튼 초기화
    setPlaylist(playlistData);
  }, [playlistData]);

  if (!playlistData || playlistData.length === 0) {
    console.log('렌더링 할 데이터가 없습니다...');
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>
          앗!!
          {chartType === 'todayPlaylist'
            ? ' 아직 오늘의 플레이리스트가 생성되지 않았나봐요...'
            : ' 아직 나만의 플레이리스트에 추가한 노래가 없나봐요!!'}
        </Text>
        <Text style={styles.emptyMessage}>
          {chartType === 'todayPlaylist'
            ? '오늘 추천받은 노래는 18시에 생성됩니다!!'
            : '지금 추가해보는건 어떨까요?'}
        </Text>
      </View>
    );
  }

  // 노래 선택 함수
  const handleSongSelect = songId => {
    setSelectedSong(prevState => {
      if (prevState === songId) {
        // 이미 선택된 노래라면 선택 해제
        console.log(`노래 선택 해제됨: ${songId}`);
        setShowAddButton(false); // 버튼 숨기기
        return null;
      } else {
        // 새로운 노래 선택
        console.log(`노래 선택됨: ${songId}`);
        setShowAddButton(true); // 버튼 보이기
        return songId;
      }
    });
  };

  // 노래 버튼 스타일링 함수
  const getButtonStyle = songId => {
    const isSelected = selectedSong === songId ? true : false; // 선택된 노래 확인
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

  // 스포티파이 버튼 클릭 함수
  const handleSpotify = async item => {
    // item.uri가 있을 경우 해당 URI로 이동
    console.log('Spotify 버튼 실행됨');
    if (item && item.uri) {
      try {
        // item.uri로 URL을 엽니다.
        await Linking.openURL(item.uri);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    } else {
      console.log('item.uri가 없습니다.');
    }
  };

  // Add to Playlist 버튼 클릭 시
  const handleAddToPlaylist = async () => {
    console.log(selectedSong);
    console.log('Add to Playlist 클릭됨');

    // 선택된 곡이 있을 때만 처리
    if (selectedSong) {
      await addToMyPlaylist(selectedSong, error =>
        console.error(`add to My Playlist Error:`, error),
      );
    } else {
      Toast.show({
        type: 'error',
        text1: '곡을 선택해주세요.',
      });
    }

    setSelectedSong({});
    setShowAddButton(false); // Add to Playlist 버튼 클릭 시 selectedSong, 버튼 초기화
  };

  // Delete Songs 버튼 클릭 시
  const handleDeleteSongs = async () => {
    console.log(selectedSong);
    console.log('Delete Songs 클릭됨');

    // 선택된 곡이 있을 때만 처리
    if (selectedSong) {
      await deletefromMyPlaylist(selectedSong, error =>
        console.error(`delete from My Playlist Error:`, error),
      );
      // 삭제된 곡을 제외한 새로운 배열 생성
      setPlaylist(prevPlaylist =>
        prevPlaylist.filter(song => song.songId !== selectedSong),
      );
    } else {
      Toast.show({
        type: 'error',
        text1: '곡을 선택해주세요.',
      });
    }

    setSelectedSong({});
    setShowAddButton(false);
  };

  return (
    <View>
      {/* deleteFromPlaylist 버튼을 FlatList 위에 고정 */}
      {showAddButton && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={
            chartType === 'todayPlaylist'
              ? handleAddToPlaylist
              : handleDeleteSongs
          }>
          <Text style={styles.addButtonText}>
            {chartType === 'todayPlaylist' ? 'Add to Playlist' : 'Delete Songs'}
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={playlist}
        keyExtractor={item => item.songId}
        contentContainerStyle={{paddingBottom: 100}} // 마지막 항목 아래 여백 추가
        renderItem={({item}) => (
          <View style={styles.container}>
            {/* 동그라미 선택 버튼 */}
            <TouchableOpacity
              style={getButtonStyle(item.uri)}
              onPress={() => handleSongSelect(item.uri)}>
              {selectedSong === item.uri && ( // 선택된 노래일 때만 체크 표시
                <Text style={styles.checkmark}>✔</Text>
              )}
            </TouchableOpacity>

            {/* 앨범 사진 */}
            <Image style={styles.image} source={{uri: item.albumImageUrl}} />

            {/* 노래 순위 */}
            <Text style={styles.rank}>{item.rank}</Text>

            {/* 노래 제목과 가수 이름 */}
            <View style={styles.textContainer}>
              <Text
                style={styles.title}
                numberOfLines={1} // 한 줄로 제한
                ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text
                style={styles.title}
                numberOfLines={1} // 한 줄로 제한
                ellipsizeMode="tail">
                {item.artist}
              </Text>
            </View>
            {/* 스포티파이 버튼 */}
            <TouchableOpacity onPress={() => handleSpotify(item)}>
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
    padding: 7,
    backgroundColor: '#111111', // 어두운 배경
  },
  emptyContainer: {
    flex: 1,
    marginTop: 90,
    marginBottom: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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
