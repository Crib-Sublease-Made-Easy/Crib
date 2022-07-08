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

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'
const TEXTGREY = '#969696'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const Container = styled.View`
  height: ${HEIGHT*0.6}px;
  width: ${WIDTH*0.9}px;
  padding-left: ${WIDTH*0.07}px;
  border-radius: ${HEIGHT*0.03}px;
  border-width: 1px;
  border-color: #E0E0E0
  justify-content: space-between;
  flex-direction: row;
  background-color: #F8F8F8
  align-items: center
  shadow-color: black;
  shadow-radius: 1px;
  shadow-offset: 0 3px;
  shadow-opacity: 0.2;
  elevation: 5
  
`