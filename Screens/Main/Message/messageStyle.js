import React, {useState, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';

import styled from 'styled-components/native';
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, EXTRALIGHT, MEDIUMGREY, DARKGREY } from '../../../sharedUtils'

const PRIMARYGREY = '#5e5d5d'


export const InboxTitle = styled.Text`
    width: ${WIDTH*0.9}px;
    align-self: center;
    font-size: ${HEIGHT*0.035}px
    margin-top: ${HEIGHT*0.05}px
    font-weight: 500
    color: black
`

export const FlatlistItemContainer = styled.TouchableOpacity`
    height: ${HEIGHT*0.1}px;
    width: ${WIDTH*0.9}px;
    align-self: center
   
    flex-direction: row
    align-items: center
    border-bottom-width: 1px
    border-color: ${EXTRALIGHT}
`
export const FlatlistUnread = styled.TouchableOpacity`
    width: ${WIDTH*0.02}px;
    height: ${WIDTH*0.02}px;;
    backgroundColor: ${PRIMARYCOLOR};
    borderRadius: ${WIDTH*0.01}px;
    justify-content: center;
    align-items: center


`

export const FlatlistLeft = styled.View`
    width:${WIDTH*0.12}px
    margin-left: ${WIDTH*0.025}px
    height: 100%;
    justify-content: center;
    align-items: center
    
    
`
export const FlatlistRight = styled.View`
    width: ${WIDTH*0.73}px
    height: 100%;
    justify-content: center;
    padding-left: ${WIDTH*0.03}px
    padding-vertical: ${HEIGHT*0.02}px
    justify-content: space-around
`
export const LocationText = styled.Text`
    max-width: ${WIDTH*0.6}px
    font-size: ${HEIGHT*0.017}px;
    font-weight: 600
    color: black
   
`
export const TextAndTime = styled.View`
    width: ${WIDTH*0.70}px;
    justify-content: space-between
    flex-direction: row;
    align-items: center
`

export const LastMessageTime = styled(Text)`
    font-size: ${HEIGHT*0.015}px;
    color: ${DARKGREY};
    font-weight: ${props=>(props.unreadCount == 0 ? '500' : '700')};
    max-width: ${WIDTH*0.45}px
    max-height: ${HEIGHT*0.02}px
`
export const DefaultPostFavText = styled.Text`
    color: ${DARKGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
    width: ${WIDTH*0.6}px
    text-align: center
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

export const NoUserText = styled.Text`
    color: ${PRIMARYGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
`

export const StyledView = styled.View`
  background-color: black;
  flex: 1;
  padding-bottom: ${({ insets }) => insets.bottom}px;
  padding-top: ${HEIGHT*0.02}px;
`;