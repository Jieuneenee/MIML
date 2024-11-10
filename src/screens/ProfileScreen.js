import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import ownProfile from '../constants/json/ownProfile.json';

const ProfileScreen = ({navigation}) => {
  return (
    <Container>
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
    </Container>
  );
};

export default ProfileScreen;

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

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
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
