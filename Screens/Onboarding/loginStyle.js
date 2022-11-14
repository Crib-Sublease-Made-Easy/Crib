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

import { HEIGHT, WIDTH, PRIMARYCOLOR,  } from '../../sharedUtils';
  
const TEXTINPUTBORDERCOLOR = '#989898'

import styled from 'styled-components/native';

import { MEDIUMGREY } from '../../sharedUtils';


export const Header = styled.View`
    width: ${WIDTH}px;
    padding-vertical: ${HEIGHT*0.015}px
    padding-horizontal: ${WIDTH*0.05}px
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
    align-self:center
    aling-items: center
    justify-content: space-between
  
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

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
    color: black
    
`
export const GeneralTextInput = styled.TextInput`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px
    font-size: ${HEIGHT*0.03}px
    border-bottom-width: 2px;
    padding-left: ${WIDTH*0.025}px
    border-color: ${TEXTINPUTBORDERCOLOR}
    align-self: center   
    
`
export const TextInputContainer = styled.View`
    padding-top: ${HEIGHT*0.025}px
`

export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.025}px;
    font-weight: 500
    color: white
`
export const ContinueButton = styled.Pressable`
    width: ${WIDTH*0.7}px;
    height: ${ HEIGHT*0.07}px;
    backgroundColor:  ${props=>(props.loading ? MEDIUMGREY : PRIMARYCOLOR)}}
    align-self: center
    border-radius: 25px
    justify-content: center
    align-items: center
    margin-bottom: ${HEIGHT*0.025}px;
`
