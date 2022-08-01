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
    width: ${WIDTH*0.175}px;
    height: ${WIDTH*0.075}px;;
    backgroundColor: ${PRIMARYCOLOR};
    borderRadius: 30
    justify-content: center;
    align-items: center


`

export const FlatlistLeft = styled.View`
    width:${WIDTH*0.12}px
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
    font-size: ${HEIGHT*0.017}px;
    font-weight: 600
   
`
export const TextAndTime = styled.View`
    width: ${WIDTH*0.70}px;
    justify-content: space-between
    flex-direction: row;
    align-items: center
`

export const LastMessageTime = styled.Text`
    font-size: ${HEIGHT*0.015}px;
    color: ${DARKGREY};
    font-weight: 500
`
