import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import AccountListItem from '../components/AccountListItem.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_URL} from '../../env';

const FollowingScreen = () => {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFollowers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (token && userId) {
        const response = await axios.get(
          `${BASE_URL}/users/profile/${userId}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (
          response.status === 404 ||
          response.data.detail === 'No followers found'
        ) {
          setFollowingList([]);
          setError('팔로잉 목록이 없습니다.');
        } else {
          setFollowingList(response.data);
          setError(null);
        }
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('팔로잉 목록이 없습니다.');
        } else {
          setError(
            `Failed to load followers: ${err.response.status} ${err.response.statusText}`,
          );
        }
      } else {
        setError('Failed to load followers');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false); // 새로고침 완료
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true); // 새로고침 시작
    fetchFollowers();
  };

  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  if (error) {
    return (
      <ErrorTextContainer>
        <ErrorText>{error}</ErrorText>
      </ErrorTextContainer>
    );
  }

  return (
    <Container>
      <FlatList
        data={followingList}
        keyExtractor={item => item.userId.toString()}
        renderItem={({item}) => (
          <AccountListItem
            name={item.name}
            profileImageUrl={
              item.profileImageUrl
                ? item.profileImageUrl
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
            userId={item.userId}
          />
        )}
        refreshing={isRefreshing} // 새로고침 상태 연결
        onRefresh={handleRefresh} // 새로고침 동작 연결
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

const LoadingText = styled.Text`
  color: white;
  text-align: center;
  margin-top: 20px;
`;

const ErrorTextContainer = styled.View`
  flex: 1;
  background-color: #222;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 80px;
`;
