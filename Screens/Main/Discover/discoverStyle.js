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
  TouchableOpacity,
  Pressable
} from 'react-native';

import styled from 'styled-components/native';
import { LIGHTGREY, TEXTINPUTBORDERCOLOR } from '../../../sharedUtils';


const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'
const TEXTGREY = '#E0E0E0'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;


export const Container = styled.Pressable`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  align-items: center
  
  
`

export const Header = styled.View`
  width: ${WIDTH}px;
  flex-direction: row
`
export const ModalContainer = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
`

export const SearchInputContainerText = styled.Text`
  font-size: ${HEIGHT*0.02}px;
  color: ${TEXTGREY};
  margin-left: ${WIDTH*0.02}px;
 
`
// export const SearchContainerStyle = ({}) = { height: HEIGHT*0.067, width: WIDTH*0.9, paddingLeft:WIDTH*0.07, paddingRight: WIDTH*0.03,
// borderWidth: 1, borderColor: '#E0E0E0',  alignItems: 'center', shadowColor: 'black', shadowRadius: 1, shadowOpacity: 0.2, backgroundColor:'#F8F8F8',
// elevation: 5, borderRadius: 20, flexDirection: 'row', shadowOffset: {width: 0, height: 3}}

export const PlaceholderLogoTextContainer  = styled.TextInput`
  flex-direction: row;
  height: 100%
  width: 70%
  padding-left: ${WIDTH*0.02}px
  align-items: center  
`

export const ModalSearchContainer = styled.View`
    height: ${HEIGHT*0.06}px;
    width: ${WIDTH*0.9}px;
    justify-content: space-between;
    align-items: center
    flex-direction: row
    align-self: center
`

export const SearchInput = styled.TextInput`
  width: ${WIDTH*0.8}px;
  height: ${HEIGHT*0.075}px;
  border-radius: 20px;
 
`

export const FilterPressable  = styled.Pressable`
  width: ${WIDTH*0.1}px;
  height: ${WIDTH*0.1}px;
  border-radius: ${WIDTH*0.05}px;
  border-width: 2 gPpx
  border-color: ${TEXTINPUTBORDERCOLOR}
  justify-content: center
  align-items:center
`

export const Subheading = styled.Text`
  font-size: ${HEIGHT*0.02}px;
  font-weight: 700;
  color: ${PRIMARYGREY}
`

export const SearchResultContainer = styled.View`
  padding-left: 5%;
  margin-top: ${HEIGHT*0.02}px;
`

export const CancelGoBackText = styled.Text`
  font-size:${HEIGHT*0.015}px;
  color: ${PRIMARYGREY}
  font-weight: 500;
`

export const LocationMainText = styled.Text`
  font-size:${HEIGHT*0.0175}px;
  font-weight: 500;
`
export const LocationSecondaryText = styled.Text`
  font-size:${HEIGHT*0.015}px;
  color: ${PRIMARYGREY}
  font-weight: 300;
  margin-top: ${HEIGHT*0.005}px
`
export const LogoText = styled.Text`
  font-size : ${HEIGHT*0.045}px;
  color: ${PRIMARYCOLOR}
  text-align:center;
  align-content: center
  font-weight: 700
`

export const PressableContainer = styled.Pressable`
  height: ${HEIGHT*0.06}px;
  width: ${HEIGHT*0.06}px;
  border-radius: ${HEIGHT*0.03}px;
  background-color: #F8F8F8
  justify-content: center;
  align-items: center
  shadow-color: black;
  shadow-radius: 5px;
  shadow-offset: 0 4px;
  shadow-opacity: 0.2;
  elevation: 2
 
`

export const AutocompleteLocationContainer = styled(Pressable)`
  width: ${WIDTH*0.8}px;
  height: ${HEIGHT*0.075}px;
  border-top-width: 1px;
  border-color: #E0E0E0;
  align-items: center
  flex-direction: row
  padding-left: ${WIDTH*0.025}px;
  align-self: center
  overflow: hidden
  display: ${props=>(props.searching ? 'flex' : 'none')}

`

export const SearchInputCancelIconContainer = styled.View`
  flex-direction: row;
  height: ${HEIGHT*0.065}px
  align-items:center
`

export const ClosePreviewPressable = styled.Pressable`
  background-color: white;
  height:${HEIGHT*0.04}px;
  width:${HEIGHT*0.04}px;
  borderRadius: ${HEIGHT*0.02}px; 
  position: absolute ;
  right:${WIDTH*0.02}px;
  top: -${HEIGHT*0.05}px;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-offset: 0 4px;
  shadow-opacity: 0.2;
`

export const  PreviewBottomContainer = styled.Pressable`
  padding-vertical: ${HEIGHT*0.02}px
  height: ${HEIGHT*0.1}px;
  width: ${WIDTH*0.9}px;
  padding-horizontal: ${WIDTH*0.02}px;
  padding-top: ${HEIGHT*0.01}px
  align-self:center
  justify-content: space-around
  

 
`
export const  PreviewTopContainer = styled.View`
  height:${HEIGHT*0.175}px;
  width: ${WIDTH*0.9}px
 
 
`

export const PreviewCards = styled.Pressable`
  width: ${WIDTH*0.9}px;
  height: ${HEIGHT*0.3}px;
  border-radius:20px;
 
`

export const PreviewTopRightContaier = styled.View`
  width: ${WIDTH*0.36}px
  align-items: flex-end
`
export const PreviewNameText = styled.Text`
  font-size: ${HEIGHT*0.02}px;
  height: ${HEIGHT*0.04}px;
  font-weight: 400
  width: ${WIDTH*0.6}px
` 
export const PreviewPriceText = styled.Text`
  width: ${WIDTH*0.9}px
  padding-horizontal: ${WIDTH*0.025}px
  font-size: ${HEIGHT*0.014}px;
  color: ${PRIMARYGREY}

`
export const PreviewLocationText = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 500
  width: ${WIDTH*0.9}px
  max-height: ${HEIGHT*0.06}px;
  padding-horizontal: ${WIDTH*0.025}px
  overflow: hidden
  
`

export const SeachIconContainer = styled.View`
  width:15%
  align-items: center;
  justify-content: flex-end
  flex-direction: row
`

export const DeleteIconContainer = styled.Pressable`
width:15%
align-items: center;
justify-content: center
`

export const CustomMarker = styled.Pressable`
  padding-horizontal: ${WIDTH*0.02}px;
  padding-vertical: ${HEIGHT*0.01}px
  border-radius:10px
  background-color: ${PRIMARYCOLOR}
  shadow-color: ${LIGHTGREY};
  shadow-radius: 5px;
  shadow-offset: 0 0;
  shadow-opacity: 0.3;
  elevation: 2
  align-items: center;
  justify-content: center

`

export const SearchHerePressable = styled.Pressable`
  position: absolute;
  bottom: ${HEIGHT*0.2}px;
  left: ${WIDTH*0.05}px;
  width: ${WIDTH*0.15}px
  height: ${WIDTH*0.15}px
  border-radius: ${WIDTH*0.075}px
  background-color: white
  justify-content: center
  align-items: center
  shadow-color: black
  shadow-radius: 10px;
  shadow-offset: 0 0;
  shadow-opacity: 0.3;
`
