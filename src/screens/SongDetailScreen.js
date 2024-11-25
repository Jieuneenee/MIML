import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {BASE_URL} from '../../env';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const SongDetailScreen = ({route}) => {
  const {song_uri} = route.params; // 이전 페이지에서 전달된 song_uri
  const [songDetail, setSongDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    console.log('song_uri:', song_uri);
    const fetchSongDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/songs/${song_uri}`);
        setSongDetail(response.data);
      } catch (error) {
        console.error('Error fetching song details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetail();
  }, [song_uri]);

  const openSpotify = () => {
    if (songDetail) {
      const spotifyUri = songDetail.uri; // 앱
      const spotifyUrl = songDetail.spotify_url; //웹

      Linking.canOpenURL(spotifyUri) //URI가 장치에서 지원되는지 확인
        .then(supported => {
          // 지원여부로 Boolean 값 반환
          if (supported) {
            // Spotify 앱이 설치되어 있으면 URI로 열기
            Linking.openURL(spotifyUri);
          } else {
            // Spotify 앱이 설치되어 있지 않으면 웹 URL로 열기
            Linking.openURL(spotifyUrl);
          }
        })
        .catch(err => console.error('Error checking URL support:', err));
    }
  };

  const shareSong = async () => {
    try {
      const songData = {
        title: songDetail.title,
        artist: songDetail.artist,
        album: songDetail.album,
        spotify_url: songDetail.spotify_url,
        album_cover_url: songDetail.album_cover_url,
        uri: songDetail.uri,
      };

      // AsyncStorage에서 토큰 가져오기
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // 토큰이 없으면 사용자에게 알림을 주고 처리
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: '로그인 정보가 없습니다.',
        });
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/songs/${songDetail.uri}/share`,
        songData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        // 성공적으로 노래가 공유되었을 때 성공메세지 반환
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: '노래가 공유되었습니다.',
        });
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error sharing song:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '노래 공유 중 오류가 발생했습니다.',
        text2: '다시 시도해주세요.',
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#fff" />
      </Container>
    );
  }

  if (!songDetail) {
    return (
      <Container>
        <Text style={{color: '#fff'}}>Song details not found</Text>
      </Container>
    );
  }

  return (
    <Container>
      <TouchableOpacity onPress={openSpotify}>
        <AlbumCover source={{uri: songDetail.album_cover_url}} />
      </TouchableOpacity>
      <Title>{songDetail.title}</Title>
      <Artist>{songDetail.artist}</Artist>
      <PlayButton onPress={openSpotify}>
        <PlayButtonImage
          source={{
            uri: 'https://cdn.pixabay.com/photo/2022/08/21/22/17/icon-7402243_1280.png',
          }}
        />
      </PlayButton>
      <ButtonContainer>
        <ActionButton onPress={shareSong}>
          <ButtonText>Upload this Music</ButtonText>
        </ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default SongDetailScreen;

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
  margin-top: 15px;
  width: 100%;
  justify-content: center;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #555;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
  width: 180px;
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
  align-self: flex-end;
  margin-right: 10px;
`;

const PlayButtonImage = styled.Image`
  width: 100px;
  height: 100px;
`;
