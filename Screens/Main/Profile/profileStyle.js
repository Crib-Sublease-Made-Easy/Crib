import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Pressable,
    Animated
  } from 'react-native';
  

import styled from 'styled-components/native';
import { DARKGREY, EXTRALIGHT, LIGHTGREY, MEDIUMGREY, TEXTINPUTBORDERCOLOR, PRIMARYCOLOR } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const HeaderContainer = styled.View`
  padding-vertical: ${HEIGHT*0.01}px;
  flex-direction: row;
  padding-horizontal: ${WIDTH*0.05}px
  height: ${WIDTH*0.25}px
`

export const ImageContainer = styled.View`
  width: ${WIDTH*0.25}px;
  height: ${WIDTH*0.25}px;
  justify-content: center;
  align-items: center
`

export const NameDateContainer = styled.View`
  
  height: 100%;
  justify-content: space-around;
  padding-left: ${WIDTH*0.05}px
`

export const NameText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
`
export const JoinedDateText = styled.Text`
    font-size: ${HEIGHT*0.015}px;
    color: ${DARKGREY}
    font-weight: 400;
    color: ${PRIMARYGREY}
`
export const SettingContainer = styled.View`
  flex: 1 
  align-items:flex-end
`

export const UpgradeContainer = styled.View`
  padding-vertical: ${HEIGHT*0.05}px
  align-self: center
`
export const UpgradeView = styled.View`
  flex-direction: row
  align-items: center
  padding-horizontal: ${WIDTH*0.05}px
  width: ${WIDTH*0.9}px;
  height: ${HEIGHT*0.15}px
  shadow-offset: 0 0
  border-radius: 15px
  background-color: white;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.15;
  elevation: 5
`

export const UpgradeTextHeader = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 500; 
  width: ${WIDTH*0.6}px
`

export const UpgradeText = styled.Text`
  margin-top: ${HEIGHT*0.01}px
  font-size: ${HEIGHT*0.015}px;
  font-weight: 400; 
  width: ${WIDTH*0.6}px
`

export const UpgradeImageContainer = styled.View`
  height: ${HEIGHT*0.12}px
  width: ${WIDTH*0.2}px;
  border-radius: 10px;
  background-color: ${MEDIUMGREY}
`

export const UpgradeTextContainer = styled.View`
  padding-left: ${WIDTH*0.025}px
  flex-direction: column
  flex: 1
`

export const OptionContainer = styled.View`

`

export const OptionRow = styled.Pressable`
  width: ${WIDTH*0.9}px;
  align-self: center
  padding-vertical: ${HEIGHT*0.015}px
  flex-direction: row
  justify-content: space-between
`

export const OptionName = styled.Text`
  margin-left: ${WIDTH*0.025}px
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 400; 
`

export const Header = styled.View`
  width: ${WIDTH*0.9}px;
  height: ${HEIGHT*0.05}px
  justify-content: center
  align-items: flex-end
  align-self:center
  background-color: pink
`

export const Container = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    align-items: center
    background-color:white
    
`

export const EditProfilePressable = styled.Pressable`
    margin-top: ${HEIGHT*0.03}px
    width: ${WIDTH*0.3}px;
    height: ${HEIGHT*0.04}px;
    border-radius: 20px;
    background-color: ${PRIMARYCOLOR};
    justify-content: center;
    align-items: center
    alignSelf: center
`
export const SlidingContainer = styled.View`  
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.1}px;
    flex-direction: row;
    justify-content: space-around
    align-items: center
    
`

export const PostContainer = styled.Pressable`
    width: ${WIDTH*0.35}px;
    height: ${HEIGHT*0.05}px
    border-radius: 25px;
    // background-color: ${props=>props.tabPressed == "Posted" ? 'rgba(133, 89, 227, 0.5)' : 'white'}
    justify-content: center;
    align-items:center
    flex-direction: row
`
export const FavContainer = styled.Pressable`
    width: ${WIDTH*0.35}px;
    height: ${HEIGHT*0.05}px
    border-radius: 25px;
    // background-color: ${props=>props.tabPressed == "Fav" ? 'rgba(133, 89, 227, 0.5)' : 'white'}
    justify-content: center;
    align-items:center
    flex-direction: row

`

export const PostedText = styled.Text`
    color: ${props=>props.tabPressed == "Posted" ? PRIMARYCOLOR : PRIMARYGREY};
    font-weight: 700
    margin-left: ${WIDTH*0.02}px;
`

export const FavText = styled.Text`
    color: ${props=>props.tabPressed == "Fav" ? PRIMARYCOLOR : PRIMARYGREY};
    font-weight: 700
    margin-left: ${WIDTH*0.02}px;
`
export const DefaultPostFavText = styled.Text`
    color: ${PRIMARYGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
`

export const PostedPropertyInfoContainer = styled.Pressable`
    width:${WIDTH*0.9}px;
    align-self: center;
    padding-vertical: ${HEIGHT*0.01}px;
`
export const PropertyName = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  padding-vertical: ${HEIGHT*0.005}px
  font-weight: 500;
`
export const DatePriceText = styled.Text`
  fontSize: ${HEIGHT*0.015}px;
  padding-vertical: ${HEIGHT*0.005}px
  color: #4d4b4b
  font-weight: 400;
`

export const InformationContainer = styled.View`
  width: ${WIDTH*0.9}px;
  justify-content: space-between
  align-items: center
  max-height: ${HEIGHT*0.15}px
  margin-top:${HEIGHT*0.015}px
  background-color: red

`

export const IconContainer = styled.Pressable`
  height: ${WIDTH*0.1}px
  width: ${WIDTH*0.1}px
  margin-top: ${HEIGHT*0.025}px
  border-radius:10px
  background-color: white
  justify-content: center;
  align-items: center
  shadow-offset: 0 0px
  shadow-color: ${DARKGREY};
  shadow-radius: 10px;
  shadow-opacity: 0.4;
  elevation: 10
`

export const IconsContainer = styled.View`
  width: ${WIDTH*0.7}px
  justify-content: space-around;
  align-items: center
  flex-direction: row
`

export const PriceEditContainer = styled.View`
  width:${WIDTH*0.9}px;
  align-self: center
  flex-direction: row
  justify-content: space-between
  align-items: center
`

export const EditPropertyPressable = styled.Pressable`
  width: ${WIDTH*0.2}px;
  border-radius: 15px;
  background-color: rgba(217,217,217,0.5)
  justify-content: center;
  align-items: center
`

export const EditText = styled.Text`
  font-size: ${HEIGHT*0.02}px
  color: ${PRIMARYCOLOR}
  font-weight: 500
  padding:${WIDTH*0.015}px
`

export const FavPropertyCard = styled.Pressable`
  width: ${WIDTH*0.9}px;
  height: ${HEIGHT*0.125}px;
  margin-top: ${HEIGHT*0.01}px
  border-radius: 10px;
  background-color:white;  
  flex-direction: row
  shadow-color: black;
  shadow-radius: 5px;
  shadow-offset: 0 4px;
  shadow-opacity: 0.2;
  elevation: 2
`
export const PostedPropertyCard = styled.Pressable`
  border-radius: 10px
  background-color: white
  max-height: 95%


  
`
export const FavPropertyCardContent = styled.Pressable`
  padding-horizontal: ${WIDTH*0.02}px
  padding-vertical: ${HEIGHT*0.01}px;
  width: 70%
  height: 100%;
  justify-content: space-around
  overflow: hidden  
  
`

export const FavPropertyCardName = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 500
`

export const FavPropertyCardDateText = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  color: ${DARKGREY}
  font-weight: 400
`
export const FavPropertyCardDateContainer = styled.View`
  align-items: center
  flex-direction: row
`
export const HeaderIndividualContainer = styled.View`
  
  justify-content: center
  align-items: center
  
  flex-direction: row
`

export const RowContainer = styled.Pressable`
  flex-direction: row;
  width: ${WIDTH*0.9}px
  align-self: center
  justify-content: flex-start
  align-items: center
  padding-vertical: ${HEIGHT*0.015}px
  border-bottom-width: 0.5px
  border-color: ${MEDIUMGREY}
`

export const RowItemName = styled.Text`
  margin-left: ${WIDTH*0.05}px
  font-size: ${HEIGHT*0.0175}px
  font-weight: 500
`

export const ProfileHeading = styled.Text`
  width: ${WIDTH*0.9}px
  font-size: ${HEIGHT*0.03}px
  padding-vertical: ${HEIGHT*0.025}px
  align-self: center
`
export const NoUserViewContainer = styled.View`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center 
`

export const LoginContainer = styled.Pressable`
  width: ${WIDTH*0.8}px;
  padding-vertical: ${HEIGHT*0.02}px
  border-radius: 20px;
  background-color: ${PRIMARYCOLOR}
  margin-top: ${HEIGHT*0.15}px
  justify-content: center;
  align-items: center
  shadowColor: ${MEDIUMGREY}
  shadowRadius: 10px
  shadowOpacity: 0.32
  shadowOffset: 0 0
  elevation: 7
`
export const SignupContainer = styled.Pressable`
  width: ${WIDTH*0.8}px;
  padding-vertical: ${HEIGHT*0.02}px
  border-radius: 20px;
  border-color: ${PRIMARYCOLOR}
  background-color: white
  margin-top: ${HEIGHT*0.02}px
  justify-content: center;
  align-items: center
  shadowColor: ${DARKGREY}
  shadowRadius: 10px
  shadowOpacity: 0.5
  shadowOffset: 0 0
  elevation: 7
`

export const LoginText = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600
  color: white
`
export const SignupText = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600
  color: ${PRIMARYCOLOR}
`

export const PostedFavContainer = styled.View`
  width: ${WIDTH}px
  height: ${HEIGHT*0.45}px
`
export const StyledView = styled.View`
  background-color: black;
  flex: 1;
  padding-bottom: ${({ insets }) => insets.bottom}px;
  padding-top: ${({ insets }) => insets.top}px;
`;

export const CribPremiumPressable = styled.Pressable`
  flex-direction: row
  width: ${WIDTH*0.9}px
  padding-vertical: ${HEIGHT*0.025}px
  background-color: white
  align-self: center
  border-radius: 10px
  shadow-offset: 0 5px
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
  border-width: 1px
  border-color: ${LIGHTGREY}
  padding-horizontal: ${WIDTH*0.075}px
  justify-content: space-between
  align-items: center
`

export const CribPremiumPressableLeft = styled.View`
  flex-direction: column
`

export const CribPremiumHeaderText = styled.Text`
  font-size: ${HEIGHT*0.02}px
  color: white
  font-weight: 700  
`
export const CribPremiumSubheaderText = styled.Text`
  font-size: ${HEIGHT*0.015}px
  font-weight: 500
  color: white
  margin-top: ${HEIGHT*0.01}px

`


