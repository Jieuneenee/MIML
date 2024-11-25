import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';

const OtherProfileScreen = ({route}) => {
  const {userId} = route.params; // userId 받아오기
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 여부

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // 토큰
        console.log('Token:', token);
        console.log('User ID:', userId);
        if (token && userId) {
          const url = `${BASE_URL}/users/profile/${userId}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // 받은 프로필 데이터를 상태에 저장
          setProfile(response.data);
          setIsFollowing(response.data.is_following); // 팔로우 상태 따로 가져오기
          console.log('Profile:', response.data);
          console.log('Is following:', response.data.is_following);
          console;
        } else {
          console.error('Token or User ID not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  // 로딩 중일 때
  if (!profile) {
    return <LoadingText>Loading...</LoadingText>;
  }

  // 팔로우 토글 처리
  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
  };

  return (
    <Container>
      <ProfileImage
        source={{
          uri:
            profile.user.profile_image_url !== 'default_image_url'
              ? profile.user.profile_image_url
              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', // 기본 이미지 URL
        }}
      />
      <UserName>{profile.user.name}</UserName>
      <FollowButton onPress={handleFollowToggle}>
        <ButtonText>{isFollowing ? 'Unfollow' : 'Follow'}</ButtonText>
      </FollowButton>
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
    </Container>
  );
};

export default OtherProfileScreen;

const Container = styled.View`
  flex: 1;
  background-color: #000;
  align-items: center;
  padding-top: 40px;
`;

const ProfileImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 70px;
  margin-top: 30px;
  margin-bottom: 16px;
`;

const UserName = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FollowButton = styled.TouchableOpacity`
  background-color: #b08385;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  height: 40px;
  justify-content: center;
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
  margin-right: 150px;
`;

const PlaylistContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #333;
  padding: 10px;
  border-radius: 10px;
  margin-top: 5px;
  width: 90%;
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
