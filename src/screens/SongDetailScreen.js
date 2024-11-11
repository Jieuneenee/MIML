import React from 'react';
import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';
import styled from 'styled-components/native';

const dummyData = {
  title: 'cut it out (Feat. meenoi)',
  artist: 'Gist',
  album: 'Gist The Artist',
  spotify_url: 'https://open.spotify.com/track/3HxPp7xKwisL004wmUCHdz',
  album_cover_url:
    'https://i.scdn.co/image/ab67616d0000b2739cfcb1a276742c79c9c584d3',
  uri: 'spotify:track:3HxPp7xKwisL004wmUCHdz',
};

const Container = styled.View`
  flex: 1;
  background-color: #222;
  padding: 20px;
`;

const AlbumCover = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  margin-bottom: 20px;
  margin-top: 0px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

const Artist = styled.Text`
  font-size: 18px;
  color: #aaa;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #555;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  flex: 1;
  margin-left: 5px;
  margin-right: 5px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
`;

const PlayButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  align-self: flex-end; /* 오른쪽으로 배치 */
  margin-right: 20px; /* 오른쪽 여백 */
`;

const PlayButtonImage = styled.Image`
  width: 100px;
  height: 100px;
`;

const MusicScreen = () => {
  const openSpotify = () => {
    Linking.openURL(dummyData.spotify_url);
  };

  return (
    <Container>
      <TouchableOpacity onPress={openSpotify}>
        <AlbumCover source={{uri: dummyData.album_cover_url}} />
      </TouchableOpacity>
      <Title>{dummyData.title}</Title>
      <Artist>{dummyData.artist}</Artist>
      <PlayButton onPress={openSpotify}>
        <PlayButtonImage
          source={{
            uri: 'https://cdn.pixabay.com/photo/2022/08/21/22/17/icon-7402243_1280.png',
          }}
        />
      </PlayButton>
      <ButtonContainer>
        <ActionButton>
          <ButtonText>Add to Playlist</ButtonText>
        </ActionButton>
        <ActionButton>
          <ButtonText>Upload this Music</ButtonText>
        </ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default MusicScreen;
