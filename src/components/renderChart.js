import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import uuid from 'react-native-uuid';

// 차트를 렌더링하는 함수
const RenderChart = ({
  chartType,
  dailyChartData,
  weeklyChartData,
  monthlyChartData,
  yearlyChartData,
}) => {
  console.log(chartType);
  console.log('차트렌더링 함수입니다...');

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
    id: uuid.v4(), // 고유 ID를 각 항목에 추가
    rank: index + 1, // 1부터 시작하는 순위 추가
  }));

  if (!data || data.length === 0) {
    console.log('렌더링 할 데이터가 없습니다...');
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithIds}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.songContainer}>
            {/* 앨범 사진 */ console.log(item.albumImageUrl)}
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
    marginBottom: 49,
    marginLeft: 20,
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
