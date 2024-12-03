import React, {useState} from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // 토스트 메시지 라이브러리
import {BASE_URL} from '../../env';

const Container = styled(LinearGradient).attrs({
  colors: ['#dec4fc', '#d19e9e'],
  start: {x: 0, y: 0},
  end: {x: 1, y: 1},
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 40px;
`;

const InputField = styled.TextInput`
  width: 80%;
  height: 45px;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 0 20px;
  margin-bottom: 10px;
  font-size: 13px;
`;

const Button = styled.TouchableOpacity`
  width: 80%;
  height: 45px;
  background-color: #000000;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const FooterButton = styled.TouchableOpacity`
  margin-top: 20px;
`;

const FooterText = styled.Text`
  color: #ffffff;
  font-size: 14px;
`;

const LinkText = styled.Text`
  color: #7f5af0;
  font-weight: bold;
`;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auths/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      console.log('Response Status:', response.status);
      const responseBody = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseBody); // 응답이 성공적인 경우 JSON으로 파싱

        // AsyncStorage에 저장
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('userId', data.userId.toString()); // userid 문자열로 저장
        await AsyncStorage.setItem('playlistId', data.playlistId.toString()); // playlistId 저장

        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const playlistId = await AsyncStorage.getItem('playlistId');

        console.log('Stored token:', token);
        console.log('Stored userId:', userId);
        console.log('Stored playlistId:', playlistId);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: '로그인 되었습니다.',
          visibilityTime: 1000,
          autoHide: true,
        });

        // 로그인 시 입력 필드 초기화
        setEmail('');
        setPassword('');

        // 로그인 성공 시 메인 페이지로 이동
        navigation.navigate('Main', {userId: data.userId});
      } else {
        const errorData = JSON.parse(responseBody);
        // 로그인 실패 시 입력 필드 초기화
        setEmail('');
        setPassword('');

        Toast.show({
          type: 'error',
          position: 'top',
          text1: '아이디 또는 비밀번호를 다시 확인해주세요',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      // 로그인 실패 시 입력 필드 초기화
      setEmail('');
      setPassword('');

      Toast.show({
        type: 'error',
        position: 'top',
        text1: '다시 시도해주세요',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <Container>
      <Title>Music Is My Life.</Title>
      <InputField
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button onPress={handleLogin}>
        <ButtonText>Login</ButtonText>
      </Button>
      <FooterButton onPress={() => navigation.navigate('SignUp')}>
        <FooterText>
          Don’t have an account? <LinkText>Sign up</LinkText>
        </FooterText>
      </FooterButton>
    </Container>
  );
};

export default LoginScreen;
