import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';

const AddPostScreen = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };
    getUserId();
  }, []); // userId를 로드

  useEffect(() => {
    if (userId) {
      loadRecentSearches();
    }
  }, [userId]); // userId가 변경될 때마다 최근 검색어 불러오기

  // 사용자별 최근 검색어 불러오기
  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(`recentSearches_${userId}`);
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  // 사용자별 최근 검색어 저장
  const saveRecentSearch = async term => {
    const updatedSearches = [
      term,
      ...recentSearches.filter(item => item !== term),
    ];
    setRecentSearches(updatedSearches);

    try {
      await AsyncStorage.setItem(
        `recentSearches_${userId}`,
        JSON.stringify(updatedSearches),
      );
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // 검색 처리 함수
  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true); // 검색 시작 시 로딩 상태로 변경

    try {
      const response = await fetch(
        `${BASE_URL}/spotify/search?song_name=${searchTerm}`,
      );
      const data = await response.json();
      setSearchResults(data.songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false); // 검색이 완료되면 로딩 상태 종료
    }
  };

  // 검색어 입력 필드 클리어
  const clearSearchField = () => {
    setSearchTerm('');
  };

  // 상세 페이지로 이동
  const navigateToDetail = uri => {
    navigation.navigate('Detail', {song_uri: uri});
  };

  // 검색어 입력 후 엔터치면 검색어 저장
  const handleSubmitEditing = () => {
    if (searchTerm) {
      saveRecentSearch(searchTerm); // 엔터를 칠 때만 저장
      handleSearch(); // 검색 처리
    }
  };

  const clearRecentSearch = async term => {
    const updatedSearches = recentSearches.filter(item => item !== term);
    setRecentSearches(updatedSearches);

    try {
      await AsyncStorage.setItem(
        `recentSearches_${userId}`,
        JSON.stringify(updatedSearches),
      );
    } catch (error) {
      console.error('Failed to delete recent search:', error);
    }
  };

  // 검색어 클릭 시 바로 검색 처리
  const handleQueryClick = async item => {
    setSearchTerm(item); // 검색어 입력
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(); // 검색어가 변경되면 자동으로 검색 처리
    }
  }, [searchTerm]);

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="어떤 것을 듣고 싶으세요?"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSubmitEditing}
          placeholderTextColor="#888"
        />
        {searchTerm ? (
          <ClearButton onPress={clearSearchField}>
            <ClearButtonText>X</ClearButtonText>
          </ClearButton>
        ) : null}
      </SearchContainer>

      <ListHeader>
        <ListHeaderText>
          {searchTerm ? '검색 결과' : '최근 검색 목록'}
        </ListHeaderText>
      </ListHeader>

      {loading ? (
        <Text>검색 중...</Text>
      ) : searchTerm ? (
        <ResultsList
          data={searchResults}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigateToDetail(item.uri)}>
              <SearchResultItem>
                <AlbumCover source={{uri: item.album_cover_url}} />
                <ResultTextContainer>
                  <Title>{item.title}</Title>
                  <Artist>{item.artist}</Artist>
                </ResultTextContainer>
              </SearchResultItem>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
          }
        />
      ) : (
        <RecentSearchesList
          data={recentSearches}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <RecentSearchItem>
              <TouchableOpacity onPress={() => handleQueryClick(item)}>
                <Text style={{color: '#fff'}}>{item}</Text>
              </TouchableOpacity>
              <ClearButton2 onPress={() => clearRecentSearch(item)}>
                <ClearButtonText2>X</ClearButtonText2>
              </ClearButton2>
            </RecentSearchItem>
          )}
        />
      )}
    </Container>
  );
};

export default AddPostScreen;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #000;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 8px 12px;
  margin-bottom: 20px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  padding: 0 10px;
  color: #000;
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -8px;
  padding: 5px;
`;

const ClearButton2 = styled.TouchableOpacity`
  position: absolute;
  right: 5px;
  padding: 5px;
`;

const ClearButtonText2 = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const ClearButtonText = styled.Text`
  color: #000;
  font-size: 16px;
`;

const ListHeader = styled.View`
  margin-bottom: 10px;
`;

const ListHeaderText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  margin-left: 10px;
`;

const ResultsList = styled(FlatList)`
  margin-top: 10px;
`;

const RecentSearchesList = styled(FlatList)`
  margin-top: 10px;
`;

const SearchResultItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const AlbumCover = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
`;

const ResultTextContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const Artist = styled.Text`
  color: #aaa;
`;

const RecentSearchItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 10px;
`;

const EmptyMessage = styled.Text`
  color: #aaa;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;
