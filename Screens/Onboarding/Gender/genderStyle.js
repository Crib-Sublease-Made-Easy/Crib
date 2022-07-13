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
  
const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#8559E3'
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
    font-size: ${HEIGHT*0.045}px;
    font-weight: 500;
    width: ${WIDTH*0.9}px
    padding-left: ${WIDTH*0.1}px
`

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
`

export const GenderInputContainer = styled.View`
    margin-top: ${HEIGHT*0.1}px
    align-items: center
`


export const GenderRowContainer = styled.View`
    
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.07}px;
    align-self: center
    flex-direction: row;
    justify-content: space-between;
`
export const GenderName = styled.Text`
    font-size: ${HEIGHT*0.025}px
    
`

export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.025}px;
    font-weight: 500
    color: white
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