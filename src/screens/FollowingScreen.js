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

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
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

          // 404 상태 코드 또는 팔로워가 없다는 메시지가 올 경우
          if (
            response.status === 404 ||
            response.data.detail === 'No followers found'
          ) {
            setFollowingList([]);
            setError('팔로잉 목록이 없습니다.'); // 에러 메시지
          } else {
            setFollowingList(response.data);
            console.log('Following:', response.data);
            setError(null); // 에러 없으면 에러 상태 초기화
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
      }
    };

    fetchFollowers();
  }, []);

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
                ? item.profileImageUrl // 유효한 이미지 URL
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' // 기본 이미지 URL
            }
            userId={item.userId}
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
