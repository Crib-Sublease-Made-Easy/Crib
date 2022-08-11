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

import {  HEIGHT, WIDTH, PRIMARYCOLOR } from '../../../sharedUtils';

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
<<<<<<< HEAD
    //font-family: ${FONTFAMILY}
=======
    
>>>>>>> f8e198cdc361109d6e42b5cc31e879271b653fad
`

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
<<<<<<< HEAD
    //font-family: ${FONTFAMILY}
=======
    
>>>>>>> f8e198cdc361109d6e42b5cc31e879271b653fad
`

export const GenderInputContainer = styled.View`
    margin-top: ${HEIGHT*0.05}px
    align-items: center
`


export const GenderRowContainer = styled.Pressable`
   
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.07}px;
    align-self: center
    flex-direction: row;
    justify-content: space-between;
    align-items: center
`
export const GenderName = styled.Text`
    font-size: ${HEIGHT*0.02}px
    margin-left: ${WIDTH*0.025}px
<<<<<<< HEAD
    //font-family: ${FONTFAMILY}
=======
    
>>>>>>> f8e198cdc361109d6e42b5cc31e879271b653fad
`

