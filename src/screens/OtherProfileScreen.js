import React, {useState} from 'react';
import styled from 'styled-components/native';
import profile from '../constants/json/otherProfile.json';

const OtherProfileScreen = () => {
  const [isFollowing, setIsFollowing] = useState(profile.is_following); // 더미데이터에서 팔로우 여부 가져오기

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
  };

  return (
    <Container>
      <ProfileImage
        source={{
          uri: profile.user.profile_image_url
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
        <AlbumCover
          source={{uri: profile.shared_songs[0]?.spotify_url || ''}}
        />
        <SongDetails>
          <SongTitle>{profile.shared_songs[0]?.title}</SongTitle>
          <SongArtist>{profile.shared_songs[0]?.artist}</SongArtist>
        </SongDetails>
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
