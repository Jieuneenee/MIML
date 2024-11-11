import React from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

const AccountListItem = ({name, profileImageUrl, userId}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('OtherProfile', {userId});
  };

  return (
    <Container>
      <ProfileImage source={{uri: profileImageUrl}} />
      <Name>{name}</Name>
      <ProfileButton onPress={handlePress}>
        <ButtonText>View Profile</ButtonText>
      </ProfileButton>
    </Container>
  );
};

export default AccountListItem;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px;
  border-bottom-width: 0.3px;
  border-bottom-color: #ccc;
`;

const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Name = styled.Text`
  font-size: 16px;
  color: #fff;
  flex: 1;
`;

const ProfileButton = styled.TouchableOpacity`
  padding: 5px;
`;

const ButtonText = styled.Text`
  color: #808080;
  font-size: 14px;
  text-decoration: underline;
`;
