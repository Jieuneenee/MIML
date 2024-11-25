import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import AccountListItem from '../components/AccountListItem.js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';

const FollowersScreen = () => {
  const [followersList, setFollowersList] = useState([]);
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
            `${BASE_URL}/users/profile/${userId}/followers`,
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
            setFollowersList([]);
            setError('팔로워 목록이 없습니다.'); // 에러 메시지
          } else {
            setFollowersList(response.data);
            setError(null); // 에러 없으면 에러 상태 초기화
          }
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError('팔로워 목록이 없습니다.');
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
        data={followersList}
        keyExtractor={item => item.userId.toString()}
        renderItem={({item}) => (
          <AccountListItem
            name={item.name}
            profileImageUrl={
              item.profileImageUrl ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            }
            userId={item.userId}
          />
        )}
      />
    </Container>
  );
};

export default FollowersScreen;

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding: 20px;
  justify-content: center;
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
