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
import { DARKGREY, EXTRALIGHT, LIGHTGREY, MEDIUMGREY, ROBOTOFONTFAMILY, TEXTINPUTBORDERCOLOR, PRIMARYCOLOR } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

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

export const NameText = styled.Text`
    font-size: ${HEIGHT*0.03}px;
    width: ${WIDTH*0.9}px
    font-weight: 500;
    text-align:center
    color: black
`

export const OccupationText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
   
    font-weight: 300;
    color: ${PRIMARYGREY}
    text-align:center
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
    justify-content: center;
    align-items:center
    flex-direction: row
`
export const FavContainer = styled.Pressable`
    width: ${WIDTH*0.35}px;
    height: ${HEIGHT*0.05}px
    border-radius: 25px;
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
  color: black
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
  color: black
`

export const FavPropertyCardDateText = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  color: ${DARKGREY}
  font-weight: 400
  
`
export const FavPropertyCardDateContainer = styled.View`
  padding-vertical: ${HEIGHT*0.01}px
  width: 50%;
  justify-content: space-between;
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
  color: black
`

export const ProfileHeading = styled.Text`
  font-family: ${ROBOTOFONTFAMILY}
  width: ${WIDTH*0.9}px
  font-size: ${HEIGHT*0.03}px
  padding-vertical: ${HEIGHT*0.025}px
  align-self: center
  color: black
`
export const NoUserViewContainer = styled.View`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center 
`

export const LoginContainer = styled.Pressable`
  width: ${WIDTH*0.8}px;
  height: ${HEIGHT*0.065}px;
  border-radius: 25px;
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
  height: ${HEIGHT*0.065}px;
  border-radius: 25px;
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
  padding-top: ${HEIGHT*0.02}px;
`;