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
import { DARKGREY, EXTRALIGHT, MEDIUMGREY } from '../../../sharedUtils';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const TopContainer = styled.View`
  padding-vertical: ${HEIGHT*0.01}px
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
  padding-horizontal: ${WIDTH*0.035}px
  color: black
`
export const  SearchResultContainer = styled.View`
  height: ${HEIGHT*0.4}px;
  width: 100%
  padding-top: ${HEIGHT*0.025}px
`

export const SearchResultTitle = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600;
  width: ${WIDTH}px;
  padding-horizontal: ${WIDTH*0.05}px
  color: black
`

export const AutocompleteResultItems = styled.Pressable`
  width: ${WIDTH}px;
  align-self: center
  flex-direction: row
  padding-vertical: ${HEIGHT*0.0125}px
  padding-horizontal: ${WIDTH*0.05}px
  align-items: center
  border-bottom-width: 1px
  border-color: ${MEDIUMGREY}
`

export const LocationPrimaryText = styled.Text`
  font-size: ${HEIGHT*0.0175}px
  max-width:${WIDTH*0.7}px
  font-weight: 500
  color: black
`

export const LocationSecondaryText = styled.Text`
  font-size: ${HEIGHT*0.015}px
  font-weight: 400
  color: ${DARKGREY}
`