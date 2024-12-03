import React, {useState} from 'react';
import styled from 'styled-components/native';
import {BASE_URL} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    // 검색어가 변경되면 다시 필터링된 데이터를 초기화
    if (!searchQuery) {
      setFilteredData([]);
      setErrorMessage('');
    }
  }, [searchQuery]);

  const handleSearch = async name => {
    setSearchQuery(name);
    if (!name) {
      setFilteredData([]);
      setErrorMessage('');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch(`${BASE_URL}/users/search?name=${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredData(data);
      } else if (response.status === 404) {
        setFilteredData([]);
        setErrorMessage('사용자를 찾을 수 없습니다.');
      } else {
        throw new Error('검색 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Search Error:', error);
      setErrorMessage('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredData([]);
    setErrorMessage('');
  };

  const handleProfileView = userId => {
    // 'OtherProfile' 페이지로 userId를 넘기면서 이동
    navigation.navigate('OtherProfile', {userId});
  };

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <ClearButton onPress={clearSearch}>
            <ClearButtonText>X</ClearButtonText>
          </ClearButton>
        ) : null}
      </SearchContainer>

      <ListHeader>
        <ListHeaderText>{searchQuery ? '검색 결과' : null}</ListHeaderText>
      </ListHeader>

      {loading && <MessageText>검색 중...</MessageText>}

      {errorMessage ? (
        <MessageText>{errorMessage}</MessageText>
      ) : (
        <UserList
          data={filteredData}
          keyExtractor={item => item.userId.toString()}
          renderItem={({item}) => (
            <UserContainer>
              <ProfileImage
                source={{
                  uri: item.profileImage
                    ? item.profileImage
                    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                }}
              />
              <UserInfo>
                <UserName>{item.name}</UserName>
                <ProfileButton onPress={() => handleProfileView(item.userId)}>
                  <ButtonText>View Profile</ButtonText>
                </ProfileButton>
              </UserInfo>
            </UserContainer>
          )}
        />
      )}
    </Container>
  );
};

export default SearchScreen;

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding: 20px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 8px 12px;
  margin-bottom: 20px;
  height: 44px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  padding: 0 10px;
  color: #000;
  height: 100%;
`;

const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  padding: 5px;
  top: 6px;
`;

const ClearButtonText = styled.Text`
  color: #000;
  font-size: 16px;
`;

const MessageText = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 20px;
`;

const UserList = styled.FlatList`
  flex: 1;
`;

const UserContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
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

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const UserName = styled.Text`
  color: #fff;
  font-size: 16px;
  flex: 1;
`;

const ProfileButton = styled.TouchableOpacity`
  padding: 5px;
`;

const ButtonText = styled.Text`
  color: #808080;
  font-size: 14px;
  text-decoration: underline;
`;
