import React, {useState} from 'react';
import styled from 'styled-components/native';
import {FlatList, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const data = [
  {
    id: '1',
    name: 'Alice',
    profileImage:
      'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg',
    Song: [
      {
        title: 'meow',
        artist: 'meovv',
        album_cover_url:
          'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg',
        shared_at: '2024-10-11T18:01:56',
        reaction: 8,
        spotify_url: 'https://open.spotify.com/track/4Q1mkQI9zKjEPsbI19hpsN',
        uri: 'spotify:track:4Q1mkQI9zKjEPsbI19hpsN',
      },
    ],
  },
  {
    id: '2',
    name: 'Bob',
    profileImage:
      'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg',
    Song: [
      {
        title: 'purr',
        artist: 'purrcat',
        album_cover_url:
          'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg',
        shared_at: '2024-10-12T14:01:56',
        reaction: 5,
        spotify_url: 'https://open.spotify.com/track/4Q1mkQI9zKjEPsbI19hpsN',
        uri: 'spotify:track:4Q1mkQI9zKjEPsbI19hpsN',
      },
    ],
  },
  {
    id: '3',
    name: 'Bob',
    profileImage:
      'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg',
    Song: [
      {
        title: 'purr',
        artist: 'purrcat',
        album_cover_url:
          'https://cdn.pixabay.com/photo/2016/02/10/16/37/cat-1192026_1280.jpg',
        shared_at: '2024-10-12T14:01:56',
        reaction: 5,
        spotify_url: 'https://open.spotify.com/track/4Q1mkQI9zKjEPsbI19hpsN',
        uri: 'spotify:track:4Q1mkQI9zKjEPsbI19hpsN',
      },
    ],
  },
];

const Container = styled.View`
  flex: 1;
`;

const HeaderContainer = styled.View`
  background-color: #000;
  padding: 30px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

const ListContainer = styled.View`
  flex: 1;
  background-color: #fedede;
  padding: 20px;
  border-radius: 15px;
  margin-top: -15px;
`;

const Card = styled.View`
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: flex-start;
`;

const ProfileImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 10px;
  margin-top: 5px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-weight: bold;
  color: #000;
  margin-bottom: 5px;
`;

const SongBox = styled.View`
  background-color: #e8b4b4;
  padding: 8px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0px;
  width: 100%;
`;

const AlbumCover = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;

const SongInfo = styled.View`
  flex: 1;
`;

const SongTitle = styled.Text`
  font-weight: bold;
  color: #000;
`;

const SongArtist = styled.Text`
  color: #5f5f5f;
`;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: #5f5f5f;
`;

const ReactionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #d19e9e;
  padding: 2px 10px;
  border-radius: 10px;
  width: 50px;
  justify-content: space-around;
`;

const ReactionIcon = styled.Text`
  font-size: 15px;
  color: #fff;
  margin-right: 3px;
`;

const ReactionText = styled.Text`
  font-size: 13px;
  color: #fff;
  font-weight: bold;
`;

const PlayButtonContainer = styled.View`
  width: 25px;
  height: 25px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const MusicPlayButton = styled.Image`
  width: 80px;
  height: 80px;
`;
const SongCard = ({item}) => {
  const [reactionCount, setReactionCount] = useState(item.Song[0].reaction);

  const handleReaction = () => {
    setReactionCount(reactionCount + 1);
  };

  const handleSpotifyClick = url => {
    Linking.openURL(url);
  };

  return (
    <Card>
      <ProfileImage source={{uri: item.profileImage}} />
      <ContentContainer>
        <UserName>{item.name}</UserName>
        <SongBox>
          <AlbumCover source={{uri: item.Song[0].album_cover_url}} />
          <SongInfo>
            <SongTitle>{item.Song[0].title}</SongTitle>
            <SongArtist>{item.Song[0].artist}</SongArtist>
          </SongInfo>
          <TouchableOpacity
            onPress={() => handleSpotifyClick(item.Song[0].spotify_url)}>
            <PlayButtonContainer>
              <MusicPlayButton
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2022/08/21/22/17/icon-7402243_1280.png',
                }}
              />
            </PlayButtonContainer>
          </TouchableOpacity>
        </SongBox>
        <RowContainer>
          <DateText>
            {new Date(item.Song[0].shared_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </DateText>
          <ReactionButton onPress={handleReaction}>
            <ReactionIcon>♥️</ReactionIcon>
            <ReactionText>{reactionCount}</ReactionText>
          </ReactionButton>
        </RowContainer>
      </ContentContainer>
    </Card>
  );
};

const HomeScreen = () => {
  return (
    <Container>
      <HeaderContainer>
        <Header>My Feed</Header>
      </HeaderContainer>
      <ListContainer>
        <FlatList
          data={data}
          renderItem={({item}) => <SongCard item={item} />}
          keyExtractor={item => item.id}
        />
      </ListContainer>
    </Container>
  );
};

export default HomeScreen;
