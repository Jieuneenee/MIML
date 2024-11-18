import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

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

const LoginScreen = ({navigation}) => (
  <Container>
    <Title>Login</Title>
    <InputField placeholder="Email" keyboardType="email-address" />
    <InputField placeholder="Password" secureTextEntry />

    <Button
      onPress={() => {
        navigation.navigate('Main');
      }}>
      <ButtonText>Login</ButtonText>
    </Button>
    <FooterButton
      onPress={() => {
        /* 비밀번호 찾기 로직 */
      }}>
      <FooterText>Forgot your password?</FooterText>
    </FooterButton>
    <FooterButton onPress={() => navigation.navigate('SignUp')}>
      <FooterText>
        Don’t have an account? <LinkText>Sign up</LinkText>
      </FooterText>
    </FooterButton>
  </Container>
);

export default LoginScreen;
