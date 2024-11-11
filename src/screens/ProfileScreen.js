import React from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import ownProfile from '../constants/json/ownProfile.json';

const ProfileScreen = ({navigation}) => {
  const handleLogout = () => {
    // 로그아웃 로직 추가
    navigation.navigate('Login');
  };

  return (
    <Container>
      <LogoutButton onPress={handleLogout}>
        <LogoutText>Logout</LogoutText>
      </LogoutButton>
      <ScrollContainer>
        <ProfileImage source={{uri: ownProfile.profileImage}} />
        <UserName>{ownProfile.name}</UserName>
        <ButtonContainer>
          <FollowButton onPress={() => navigation.navigate('Following')}>
            <ButtonText>Following</ButtonText>
          </FollowButton>
          <FollowButton onPress={() => navigation.navigate('Followers')}>
            <ButtonText>Followers</ButtonText>
          </FollowButton>
        </ButtonContainer>
        <PlaylistTitle>Today's Shared Song</PlaylistTitle>
        <PlaylistContainer>
          <AlbumCover source={{uri: ownProfile.playlist[0].albumCover}} />
          <SongDetails>
            <SongTitle>{ownProfile.playlist[0].title}</SongTitle>
            <SongArtist>{ownProfile.playlist[0].artist}</SongArtist>
          </SongDetails>
        </PlaylistContainer>
      </ScrollContainer>
    </Container>
  );
};

export default ProfileScreen;

// 스타일 정의
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
