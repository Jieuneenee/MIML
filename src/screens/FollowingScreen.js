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
            profileImageUrl={item.profileImageUrl}
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
