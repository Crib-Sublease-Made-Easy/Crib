import React, {useState, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';
import { withDecay } from 'react-native-reanimated';

import styled from 'styled-components/native';
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, EXTRALIGHT, MEDIUMGREY, DARKGREY } from '../../../sharedUtils'

const PRIMARYGREY = '#5e5d5d'

export const MessageContainer = styled.View`
    width: ${WIDTH*0.9}px;
    align-self:center
    margin-top: ${HEIGHT*0.01}px
    flex-direction:row
    justify-content: space-between
    align-items: center
    background-color: ${EXTRALIGHT};
    border-radius: 25px;
    padding-left: ${WIDTH*0.03}px
    padding-right: ${WIDTH*0.01}px
    border-width: 1px;
    border-color: ${LIGHTGREY}
    
`
export const MessageInput = styled.TextInput`
    width: ${WIDTH*0.7}px;
    height: ${HEIGHT*0.055}px;   
`

export const SendButton = styled.Pressable`
    height: ${WIDTH*0.1}px;
    width: ${WIDTH*0.1}px;
    border-radius: ${WIDTH*0.05}px
    background-color: #24a2fe
    justify-content: center;
    align-items: center
`

export const ChatImageSettingContainer = styled.View`
    width: ${WIDTH*0.25}px;
    padding-right: ${WIDTH*0.03}px
    height: 100%
    justify-content: space-between
    align-items: center
    flex-direction: row
`