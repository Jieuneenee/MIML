import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList, TouchableOpacity, Linking, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../env';

const SongCard = ({item, userId}) => {
  const [reactionCount, setReactionCount] = useState(
    item.Song[0]?.reaction || 0, // 안전하게 접근
  );

  const handleReaction = () => {
    setReactionCount(reactionCount + 1);
  };

  const handleSpotifyClick = (spotifyUrl, spotifyUri) => {
    Linking.canOpenURL(spotifyUri)
      .then(supported => {
        if (supported) {
          Linking.openURL(spotifyUri);
        } else {
          Linking.openURL(spotifyUrl);
        }
      })
      .catch(err => console.error('Error checking URL support:', err));
  };

  return (
    <Card MyId={item.id === userId}>
      {item.id !== userId ? (
        <ProfileImage
          source={{
            uri:
              item.profileImage && item.profileImage !== 'default_image_url'
                ? item.profileImage
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
        />
      ) : null}
      <ContentContainer>
        {item.id !== userId && <UserName>{item.name}</UserName>}
        <SongBox>
          <AlbumCover
            source={{
              uri:
                item.Song[0]?.album_cover_url &&
                item.Song[0]?.album_cover_url !== ''
                  ? item.Song[0]?.album_cover_url
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
          />
          <SongInfo>
            <SongTitle>{item.Song[0]?.title || 'Unknown Title'}</SongTitle>
            <SongArtist>{item.Song[0]?.artist || 'Unknown Artist'}</SongArtist>
          </SongInfo>
          <TouchableOpacity
            onPress={() =>
              handleSpotifyClick(
                item.Song[0]?.spotify_url || '#',
                item.Song[0]?.uri || '#',
              )
            }>
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
            {item.Song[0]?.shared_at
              ? new Date(item.Song[0].shared_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unknown Date'}
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
  const [userId, setUserId] = useState(null);
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // errorMessage 상태 정의

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        if (!storedUserId || !token) {
          setErrorMessage('User ID or Auth Token is missing.');
          setLoading(false);
          return;
        }

        setUserId(parseInt(storedUserId, 10));

        const response = await axios.get(`${BASE_URL}/feed/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeedData(response.data);
        if (response.data.length === 0) {
          setErrorMessage('아직 공유된 노래가 없습니다'); // 데이터가 없으면 메시지 설정
        }
      } catch (error) {
        setErrorMessage('공유된 노래가 없습니다'); // 에러 발생 시 메시지 설정
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // 로딩 중 메시지
  }

  return (
    <Container>
      <HeaderContainer>
        <Header>My Feed</Header>
      </HeaderContainer>
      <ListContainer>
        {errorMessage ? (
          <ErrorText>{errorMessage}</ErrorText> // 에러 메시지 렌더링
        ) : (
          <FlatList
            data={feedData}
            renderItem={({item}) => <SongCard item={item} userId={userId} />}
            keyExtractor={item => `${item.id}`}
            extraData={feedData}
          />
        )}
      </ListContainer>
    </Container>
  );
};

export default HomeScreen;

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
  padding: 8px;
  border-radius: 15px;
  margin-top: -15px;
`;

const Card = styled.View`
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: flex-start;
  margin-left: ${({MyId}) => (MyId ? '100px' : '0')};
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
  width: 230px;
  height: 60px;
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
  margin-top: 3px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: #5f5f5f;
`;

const ReactionButton = styled.TouchableOpacity`
  flex-direction: row;
  position: absolute;
  align-items: center;
  background-color: #d19e9e;
  padding: 2px 10px;
  border-radius: 10px;
  width: 50px;
  justify-content: space-around;
  left: 175px;
  top: 2px;
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

const ErrorText = styled.Text`
  color: #222;
  text-align: center;
  margin-top: 80px;
`;
