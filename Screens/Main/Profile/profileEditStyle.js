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

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const HeaderContainer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.075}px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
`
export const BackButtonContainer = styled.View`
    width: ${WIDTH*0.25}px;
    height: 100%
    justify-content: center;
    align-items:center;

`

export const NameContainer = styled.View`
    width: ${WIDTH*0.5}px;
    height: ${HEIGHT*0.075}px;
    justify-content: center;
    align-items:center
  `

export const DoneButtonContainer = styled.View`
    width: ${WIDTH*0.25}px;
    height: 100%
    justify-content: center;
    align-items:flex-end;
`
export const Header = styled.Text`
    font-size: ${HEIGHT*0.025}px;
    font-weight: 500;
`