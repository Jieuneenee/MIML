import React, {useState} from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import axios from 'axios';
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

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    // 비밀버호와 비밀번호 확인이 일치하는지 확인
    if (password !== repeatPassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    try {
      // 회원가입 요청
      const response = await axios.post(`${BASE_URL}/auths/register`, {
        email: email,
        password: password,
        name: name,
      });

      if (
        response.data &&
        response.data.msg === 'User registered successfully'
      ) {
        // 회원가입 성공 시
        Toast.show({
          type: 'success',
          position: 'top',
          text1: '회원가입 성공!',
          text2: '로그인 화면으로 이동합니다.',
        });
        navigation.navigate('Login');
      }
    } catch (error) {
      // 회원가입 실패 시
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '사용자 이메일이 존재합니다.',
      });
    }
  };

  return (
    <Container>
      <Title>Sign Up</Title>
      <InputField
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <InputField
        placeholder="Repeat Password"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />
      <InputField placeholder="Name" value={name} onChangeText={setName} />
      <Button onPress={handleSignUp}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
      <FooterButton onPress={() => navigation.navigate('Login')}>
        <FooterText>
          Already have an account? <LinkText>Login</LinkText>
        </FooterText>
      </FooterButton>
    </Container>
  );
};

export default SignUpScreen;
