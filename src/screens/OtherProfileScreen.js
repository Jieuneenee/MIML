import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const OtherProfileScreen = ({route}) => {
  const {userId} = route.params; // userId 받아오기
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 여부
  const navigation = useNavigation();

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
  const handleFollowToggle = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const currentUserId = await AsyncStorage.getItem('userId'); // AsyncStorage에서 현재 사용자의 userId 가져오기

      if (!token || !currentUserId) {
        console.error('Token or userId not found');
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: '로그인이 필요합니다.',
        });
        return;
      }

      const parsedUserId = parseInt(currentUserId, 10); // currentUserId를 숫자로 변환

      if (isNaN(parsedUserId)) {
        console.error('Invalid userId');
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: '잘못된 사용자 ID입니다.',
        });
        return;
      }

      if (!isFollowing) {
        console.log(
          'profile.user.userId:',
          profile.user.userId,
          'Type:',
          typeof profile.user.userId,
        );
        console.log(
          'currentUserId:',
          currentUserId,
          'Type:',
          typeof currentUserId,
        );

        // 팔로우 요청
        const url = `${BASE_URL}/users/${profile.user.userId}/follow`;
        await axios.post(
          url,
          {follower_id: currentUserId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        Toast.show({
          type: 'success',
          text1: `${profile.user.name}님을 팔로우합니다.`,
          text2: `${profile.user.name}님의 공유 노래를 들어보세요!!`,
        });
        setTimeout(() => {
          navigation.navigate('Home', {reloadFeed: true});
        }, 3000);
      } else {
        Toast.show({
          type: 'info',
          text1: '알림',
          text2: '언팔로우 기능은 아직 구현되지 않았습니다.',
        });
      }

      // 상태 업데이트
      setIsFollowing(prev => !prev);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      Toast.show({
        type: 'error',
        text1: '오류',
        text2: '팔로우 요청 처리 중 문제가 발생했습니다.',
      });
    }
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
