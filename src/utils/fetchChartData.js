import {BASE_URL} from '../../env';
import Toast from 'react-native-toast-message'; // 토스트 메시지 라이브러리

export async function fetchChartData(endpoint, onError) {
  try {
    const response = await fetch(`${BASE_URL}/charts/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`Response Status for ${endpoint}:`, response.status);

    const responseBody = await response.text(); // 응답 본문 가져오기

    if (response.ok) {
      const data = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
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

      return {};
    }
  } catch (error) {
    // 네트워크 또는 기타 오류 처리
    onError(`Network Error: ${error.message}`);
  }
}
