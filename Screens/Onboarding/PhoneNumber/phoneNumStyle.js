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

import { HEIGHT, WIDTH, PRIMARYCOLOR, MEDIUMGREY, DARKGREY } from '../../../sharedUtils';

const TEXTINPUTBORDERCOLOR = '#989898'

import styled from 'styled-components/native';


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
    
`

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.0175}px;
    align-self: center
    
`

export const CountryCodeText = styled.Text`
    font-size: ${HEIGHT*0.025}px
`
export const CountryCodeContainer = styled.View`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.06}px
    flex-direction: row
    align-self: center
    border-width: 1px;
    padding-left: ${WIDTH*0.025}px
    border-color: ${TEXTINPUTBORDERCOLOR}
    border-radius: 10px
    jusify-content: center
    align-items: center
    margin-top: ${HEIGHT*0.01}px
    
`
export const GeneralTextInput = styled.TextInput`
width: ${WIDTH*0.8}px;
height: ${HEIGHT*0.06}px
    font-size: ${HEIGHT*0.025}px
    border-width: 1px;
    padding-left: ${WIDTH*0.025}px
    border-color: ${TEXTINPUTBORDERCOLOR}
    align-self: center   
    border-radius: 10px
    
`
export const TextInputContainer = styled.View`
    padding-top: ${HEIGHT*0.01}px
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
export const FollowUpContainer = styled.View`
    margin-top: ${HEIGHT*0.02}px
    width: ${WIDTH*0.8}px;
    align-items: center
    flex-direction: row
    align-self: center
    
`
export const FollowUpText = styled.Text`
    font-size: ${HEIGHT*0.015}px;
    margin-left: ${WIDTH*0.05}px
    width: ${WIDTH*0.7}px
    color: black
`
