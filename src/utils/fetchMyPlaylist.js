import {BASE_URL} from '../../env';
import Toast from 'react-native-toast-message'; // 토스트 메시지 라이브러리
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchMyPlaylist(token, playlistType, userId, onError) {
  try {
    const response = await fetch(
      `${BASE_URL}/playlists/${playlistType}/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 인증 토큰 추가
        },
      },
    );

    console.log(`Response Status for ${userId}:`, response.status);

    const responseBody = await response.text(); // 응답 본문 가져오기

    if (response.ok) {
      const todayData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴

      // 변환 로직
      const data = todayData.tracks.map(track => ({
        songId: track.songId,
        title: track.title,
        artist: track.artist,
        uri: track.uri,
        albumImageUrl: track.album_cover_url,
      }));

      return data;
    } else {
      const errorData = JSON.parse(responseBody); // 실패 응답 처리
      //onError(`Error from server: ${errorData.message || 'Unknown error'}`);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${errorData.message || '아직 불러올 데이터가 없습니다...'}`,
        visibilityTime: 3000,
        autoHide: true,
      });

      return [];
    }
  } catch (error) {
    // 네트워크 또는 기타 오류 처리
    onError(`Network Error: ${error.message}`);
  }
}

// 곡 추가 함수
export async function addToMyPlaylist(selectedSong, onError) {
  console.log(selectedSong);
  console.log('Request body:', JSON.stringify({uri: selectedSong}));
  const token = await AsyncStorage.getItem('token');
  const playlistId = await AsyncStorage.getItem('playlistId');
  try {
    const response = await fetch(`${BASE_URL}/playlists/${playlistId}/add`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 인증 토큰
      },
      body: JSON.stringify({uri: selectedSong}),
    });

    console.log(`Response Status for ${playlistId}:`, response.status);

    const responseBody = await response.text();

    if (response.ok) {
      console.log('곡이 플레이리스트에 추가됨:', selectedSong);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: `${
          responseBody.detail || '곡이 플레이리스트에 추가되었습니다.'
        }`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      const errorData = JSON.parse(responseBody); // 실패 응답 처리
      //onError(`Error from server: ${errorData.message || 'Unknown error'}`);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '해당 곡은 이미 플레이리스트에 있습니다.',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  } catch (error) {
    // 네트워크 또는 기타 오류 처리
    onError(`Network Error: ${error.message}`);
  }
}

// 곡 삭제 함수
export async function deletefromMyPlaylist(selectedSong, onError) {
  const token = await AsyncStorage.getItem('token');
  const playlistId = await AsyncStorage.getItem('playlistId');
  try {
    const response = await fetch(`${BASE_URL}/playlists/${playlistId}/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 인증 토큰
      },
      body: JSON.stringify({uri: selectedSong}),
    });

    console.log(`Response Status for ${playlistId}:`, response.status);

    const responseBody = await response.text();

    if (response.ok) {
      console.log('곡이 플레이리스트에서 삭제됨:', selectedSong);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: `${responseBody.message || '곡이 삭제되었습니다.'}`,
        visibilityTime: 3000,
        autoHide: true,
      });
      return response;
    } else {
      const errorData = JSON.parse(responseBody); // 실패 응답 처리
      //onError(`Error from server: ${errorData.message || 'Unknown error'}`);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: `${errorData.detail || '노래 추가에 실패했습니다.'}`,
        text2: '곡을 삭제하는 데 오류가 발생했습니다.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return response;
    }
  } catch (error) {
    // 네트워크 또는 기타 오류 처리
    onError(`Network Error: ${error.message}`);
  }
}
