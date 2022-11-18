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
import { LIGHTGREY, TEXTINPUTBORDERCOLOR, GOOGLEBLUE, PRIMARYCOLOR, DARKGREY, HEIGHT, WIDTH, ROBOTOFONTFAMILY, EXTRALIGHT, MEDIUMGREY } from '../../../sharedUtils';


export const MapContainer = styled.View`
  width: ${WIDTH}px
  height: ${HEIGHT}px
  position: absolute
  top: 0px
  flex: 1
`
export const SearchInputContainerText = styled.Text`
  font-size: ${HEIGHT*0.02}px;
  color: ${DARKGREY};
  margin-left: ${WIDTH*0.02}px;
`

export const PlaceholderLogoTextContainer  = styled.Text`
  flex-direction: row;
  height: 100%
  width: 70%
  padding-left: ${WIDTH*0.02}px
  align-items: center  
  flex-direction: row
`

export const SearchContainer = styled.Pressable`
  padding-vertical: ${HEIGHT*0.01}px
  padding-horizontal: ${HEIGHT*0.01}px
  width: ${WIDTH*0.9}px
  marginLeft: ${WIDTH*0.05}px
  shadowColor: black
  shadowRadius: 10px
  shadowOpacity: 0.32
  shadowOffset: 0 0
  elevation: 7
  backgroundColor: white
  justify-content: space-between
  borderRadius: 30px

  flex-direction: row;
  align-items:center
`
export const SearchContainerPlaceholderText = styled(Text)`
  font-family: ${ROBOTOFONTFAMILY}
  width: ${WIDTH*0.6}px
  align-items: center
  padding-horizontal: ${WIDTH*0.005}px
  color : ${props=>(props.locationQuery == "Search Location ..." ? DARKGREY : 'black')}
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
  color: ${DARKGREY}
`

export const SearchResultContainer = styled.View`
  padding-left: 5%;
  margin-top: ${HEIGHT*0.02}px;
`

export const CancelGoBackText = styled.Text`
  font-size:${HEIGHT*0.015}px;
  color: ${DARKGREY}
  font-weight: 500;
`

export const LocationMainText = styled.Text`
  font-size:${HEIGHT*0.0175}px;
  font-weight: 500;
`
export const LocationSecondaryText = styled.Text`
  font-size:${HEIGHT*0.015}px;
  color: ${DARKGREY}
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
  color: ${DARKGREY}

`

export const SeachIconContainer = styled.View`
  padding-left: ${WIDTH*0.02}px
  align-items: center;
  justify-content: center
  flex-direction: row

`

export const DeleteIconContainer = styled.Pressable`
  padding: ${WIDTH*0.005}px
  align-items: center;
  justify-content: center
`

export const FilterAppliedIconBackground = styled.View`
  padding: 7px;
  border-radius: 100px;
  background-color: ${EXTRALIGHT}
  border-color: ${PRIMARYCOLOR} 
  border-width: 2px
`
export const NoFilterAppliedIconBackground = styled.View`
  padding: 7px;
  border-radius: 100px;
  background-color: ${EXTRALIGHT}
  border-width:0.5px
  border-color: ${MEDIUMGREY}
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
  align-self: center
  bottom: ${HEIGHT*0.2}px;
  
  padding-horizontal: ${WIDTH*0.03}px
  padding-vertical: ${HEIGHT*0.015}px
  border-radius: ${WIDTH*0.075}px
  background-color: white
  justify-content: center
  align-items: center
  shadow-color: black
  shadow-radius: 10px;
  shadow-offset: 0 0;
  shadow-opacity: 0.3;
`

export const SearchHereText = styled.Text`
  font-size: ${HEIGHT*0.013}px;
  color: ${GOOGLEBLUE}
  font-weight: 600
`

