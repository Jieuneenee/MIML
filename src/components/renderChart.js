/*

차트 화면에 4개씩 노래 목록을 렌더링 해주는 컴포넌트
순위 O, 노래 선택 버튼 X,

*/
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

// 차트 미리보기 를 렌더링하는 함수
const RenderChart = ({
  chartType,
  dailyChartData,
  weeklyChartData,
  monthlyChartData,
  yearlyChartData,
}) => {
  console.log(chartType);
  console.log('차트미리보기 렌더링 함수입니다...');

  let data =
    chartType === 'daily'
      ? dailyChartData
      : chartType === 'weekly'
      ? weeklyChartData
      : chartType === 'monthly'
      ? monthlyChartData
      : yearlyChartData;

  // 데이터를 고유 ID가 포함된 데이터로 변환
  let dataWithIds = data.map((item, index) => ({
    ...item,
    //id: uuid.v4(), // 고유 ID를 각 항목에 추가
    //rank: index + 1, // 1부터 시작하는 순위 추가 -> 둘다 필요없어짐.
  }));

  if (!data || data.length === 0) {
    console.log('렌더링 할 데이터가 없습니다...');
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>
          앗!! 아직 데이터가 많지 않나봐요...
        </Text>
        <Text style={styles.emptyMessage}>
          음악 공유를 더욱 활발히 해볼까요??
        </Text>
      </View>
    );
  }

  const handleSpotify = async item => {
    // item.uri가 있을 경우 해당 URI로 이동
    console.log('Spotify 버튼 onPress 실행됨');
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

  console.log(dataWithIds);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.rank}
        renderItem={({item}) => (
          <View style={styles.songContainer}>
            {/* 앨범 사진 */ console.log(item.albumImageUrl)}
            <Image style={styles.image} source={{uri: item.album_cover_url}} />

            {/* 노래 순위 */}
            <Text style={styles.rank}>{item.rank}</Text>

            {/* 노래 제목과 가수 이름 */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.title}>{item.artist}</Text>
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
    marginBottom: 40,
    marginLeft: 20,
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
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111', // 어두운 배경
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

export default RenderChart;
