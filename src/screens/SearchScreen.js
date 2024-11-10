import React, {useState} from 'react';
import styled from 'styled-components/native';

const dummyData = [
  {
    id: '1',
    name: 'Alice',
    profileImage:
      'https://cdn.pixabay.com/photo/2023/01/04/13/21/animals-7696695_1280.jpg',
  },
  {
    id: '2',
    name: 'Bob',
    profileImage:
      'https://cdn.pixabay.com/photo/2023/01/04/13/21/animals-7696695_1280.jpg',
  },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const results = dummyData.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredData([]);
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

      {searchQuery && filteredData.length === 0 && (
        <MessageText>사용자를 찾을 수 없습니다.</MessageText>
      )}

      <UserList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <UserContainer>
            <ProfileImage source={{uri: item.profileImage}} />
            <UserInfo>
              <UserName>{item.name}</UserName>
              <ProfileButton>
                <ButtonText>View Profile</ButtonText>
              </ProfileButton>
            </UserInfo>
          </UserContainer>
        )}
      />
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
  background-color: #b08385;
  padding: 5px 10px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
`;
