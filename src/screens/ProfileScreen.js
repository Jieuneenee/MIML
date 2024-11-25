import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {BASE_URL} from '../../env';

const ProfileScreen = ({navigation}) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null); // 프로필 데이터
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const UserId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      setUserId(UserId);
      setToken(token);

      if (UserId && token) {
        try {
          const response = await fetch(`${BASE_URL}/users/profile/${UserId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Profile data:', data); // 데이터 확인
            setProfile(data); // 전체 데이터를 profile로 설정
            setLoading(false); // 데이터 로딩 완료 후 로딩 상태 업데이트
          } else {
            const data = await response.json();
            Toast.show({
              type: 'error',
              text1: '프로필 정보를 가져오는 데 실패했습니다.',
              text2: data.msg || 'Failed to fetch profile.',
            });
            setLoading(false);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: '프로필 정보를 가져오는 데 오류가 발생했습니다.',
          });
          setLoading(false);
        }
      } else {
        setLoading(false); // 유효한 userId나 token이 없으면 로딩 종료
      }
    };

    fetchData();
  }, []);

  // 로딩중일때
  if (!profile) {
    return <LoadingText>Loading...</LoadingText>;
  }

  const handleLogout = async () => {
    // 로그아웃 처리
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: '토큰을 찾을 수 없습니다.',
        });
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${BASE_URL}/auths/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem('token'); // 토큰 삭제
        const token = await AsyncStorage.getItem('token'); // 삭제 후 다시 가져와서 확인
        console.log('Token after removal:', token); // null이어야 함
        Toast.show({
          type: 'success',
          text1: '로그아웃 되었습니다.',
        });
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.msg || 'Failed to log out.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: '로그아웃 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <Container>
      <LogoutButton onPress={handleLogout}>
        <LogoutText>Logout</LogoutText>
      </LogoutButton>
      <ScrollContainer>
        <ProfileImage
          source={{
            uri:
              profile.user.profile_image_url !== 'default_image_url'
                ? profile.user.profile_image_url
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
        />
        <UserName>{profile.user.name}</UserName>
        <ButtonContainer>
          <FollowButton onPress={() => navigation.navigate('Followers')}>
            <ButtonText>Followers</ButtonText>
          </FollowButton>
          <FollowButton onPress={() => navigation.navigate('Following')}>
            <ButtonText>Following</ButtonText>
          </FollowButton>
        </ButtonContainer>
        <PlaylistTitle>Today's Shared Song</PlaylistTitle>
        <PlaylistContainer>
          {profile.recent_shared_song ? (
            <>
              <AlbumCover
                source={{uri: profile.recent_shared_song.album_cover_url || ''}}
              />
              <SongDetails>
                <SongTitle>{profile.recent_shared_song.title}</SongTitle>
                <SongArtist>{profile.recent_shared_song.artist}</SongArtist>
              </SongDetails>
            </>
          ) : (
            <NoSongText>공유된 노래가 없습니다.</NoSongText>
          )}
        </PlaylistContainer>
      </ScrollContainer>
    </Container>
  );
};

export default ProfileScreen;

const Container = styled.View`
  flex: 1;
  background-color: #000;
  padding-top: 40px;
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const LogoutButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 1;
`;

const LogoutText = styled.Text`
  color: #888;
  text-decoration: underline;
  font-size: 16px;
`;

const ProfileImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 70px;
  align-self: center;
  margin-top: 50px;
  margin-bottom: 16px;
`;

const UserName = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 0px;
`;

const FollowButton = styled.TouchableOpacity`
  background-color: #b08385;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  height: 40px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
`;

const PlaylistTitle = styled.Text`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 40px;
  padding-left: 20px;
`;

const PlaylistContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #333;
  padding: 10px;
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
`;

const AlbumCover = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 10px;
`;

const SongDetails = styled.View`
  flex: 1;
`;

const SongTitle = styled.Text`
  font-size: 16px;
  color: #fff;
`;

const SongArtist = styled.Text`
  font-size: 14px;
  color: #aaa;
`;

const LoadingText = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-top: 50px;
`;

const NoSongText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 0px;
`;
