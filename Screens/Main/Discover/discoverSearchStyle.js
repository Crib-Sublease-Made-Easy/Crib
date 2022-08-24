import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,

} from 'react-native';


import styled from 'styled-components/native';
import { DARKGREY, EXTRALIGHT } from '../../../sharedUtils';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'
const TEXTGREY = '#969696'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const TopContainer = styled.View`
  height: ${HEIGHT*0.065}px;
  width: ${WIDTH}px;
  flex-direction: row
  justify-content: space-between
  align-items: center
  padding-horizontal: ${WIDTH*0.05}px

`

export const CancelContainer = styled.View`
  width: 10%;
  height: 100%
  flex-direction: row;
  align-items: center
`

export const SearchContainer = styled.TextInput`
  height: 100%
  width: 80%
  background-color: white
  
  border-width: 1px;
  border-radius: 25px
  border-color: ${EXTRALIGHT}
  padding-horizontal: ${WIDTH*0.035}px
  shadow-offset: 0 0
  shadow-color: ${DARKGREY};
  shadow-radius: 5px;
  shadow-opacity: 0.2;
  elevation: 5
`
export const  SearchResultContainer = styled.View`
  height: ${HEIGHT*0.4}px;
  width: 100%
  padding-top: ${HEIGHT*0.025}px
`

export const SearchResultTitle = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600;
  width: ${WIDTH};
  padding-horizontal: ${WIDTH*0.05}px
`