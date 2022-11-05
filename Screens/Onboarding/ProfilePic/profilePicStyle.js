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
import { EXTRALIGHT, LIGHTGREY, MEDIUMGREY,  } from '../../../sharedUtils';

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

export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.025}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
    color: black
    
`

export const ProfilePicContainer = styled.Pressable`
    width: ${WIDTH*0.5}px
    height: ${WIDTH*0.5}px
    borderRadius: ${WIDTH*0.25}px
    align-self: center;
    background-color: ${EXTRALIGHT}
    margin-top: ${HEIGHT*0.05}px
    justify-content: center;
    align-items: center
`

