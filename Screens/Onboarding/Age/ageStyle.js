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
  
const TEXTINPUTBORDERCOLOR = '#989898'

import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR } from '../../../sharedUtils';

export const Header = styled.View`
  width: ${WIDTH*0.9}px
  height: ${HEIGHT*0.05}px
  justify-content: center;
  align-items: flex-start;
  align-self: center
`

export const ProgressBarContainer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.05}px
`
export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.04}px;
    font-weight: 500;
    width: ${WIDTH*0.9}px
    padding-left: ${WIDTH*0.1}px
    color: black
    
`

export const GeneralTextInput = styled.TextInput`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px
    border-bottom-width: 2px;
    padding-left: ${WIDTH*0.025}px
    border-color: ${TEXTINPUTBORDERCOLOR}
    align-self: center   
    color: black
`

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
    color: black
    
`

export const AgeContainer = styled.Pressable`
    width: ${WIDTH*0.85}px
    height: ${HEIGHT*0.075}px;
    margin-top: ${HEIGHT*0.05}px
    border-radius: 20px;
   
    border-color: ${PRIMARYCOLOR}
    align-self: center
    justify-content: center;
    align-items: center
    background-color: 'rgba(133, 89, 227, 0.2)'
`

export const ContinueButton = styled.Pressable`
    width: ${WIDTH*0.7}px;
    height: ${ HEIGHT*0.07}px;
    background-color: ${PRIMARYCOLOR}
    align-self: center
    border-radius: 25px
    justify-content: center
    align-items: center
    margin-bottom: ${HEIGHT*0.025}px;
`
export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.025}px;
    font-weight: 500
    color: white
`
export const DatePlaceHolder = styled.Text`
    font-size:${HEIGHT*0.03}px;
    color: black
    
   
`