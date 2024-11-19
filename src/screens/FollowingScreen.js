import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import styled from 'styled-components/native';
import AccountListItem from '../components/AccountListItem.js';
import followersData from '../constants/json/followingData.json';

const FollowingScreen = () => {
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    setFollowingList(followersData);
  }, []);

  return (
    <Container>
      <FlatList
        data={followingList}
        keyExtractor={item => item.userId}
        renderItem={({item}) => (
          <AccountListItem
            name={item.name}
            profileImageUrl={
              item.profileImageUrl
                ? item.profileImageUrl // 유효한 이미지 URL
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' // 기본 이미지 URL
            }
          />
        )}
      />
    </Container>
  );
};

export default FollowingScreen;

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  margin-bottom: 10px;
`;
