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

export const Header = styled.View`
  width: ${WIDTH}px;
  height: ${HEIGHT*0.075}px
  justify-content: center
  align-items: flex-end
  padding-right: ${WIDTH*0.05}px
`

export const Container = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    align-items: center
    background-color:white
    
`

export const NameText = styled.Text`
    font-size: ${HEIGHT*0.03}px;
    width: ${WIDTH*0.8}px
    font-weight: 500;
    
    text-align:center
    margin-top: ${HEIGHT*0.03}px
    
`

export const OccupationText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    width: ${WIDTH*0.8}px
    font-weight: 300;
    color: ${PRIMARYGREY}
    text-align:center
`

export const EditProfilePressable = styled.Pressable`
    margin-top: ${HEIGHT*0.03}px
    width: ${WIDTH*0.3}px;
    height: ${HEIGHT*0.04}px;
    border-radius: 20px;
    background-color: ${PRIMARYCOLOR};
    justify-content: center;
    align-items: center
    alignSelf: center
`
export const SlidingContainer = styled.View`
    margin-top: ${HEIGHT*0.03}px    
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.1}px;
    flex-direction: row;
    justify-content: space-around
    align-items: center
`

export const PostContainer = styled.Pressable`
    width: ${WIDTH*0.35}px;
    height: ${HEIGHT*0.05}px
    border-radius: 25px;
    // background-color: ${props=>props.tabPressed == "Posted" ? 'rgba(133, 89, 227, 0.5)' : 'white'}
    justify-content: center;
    align-items:center
    flex-direction: row
`
export const FavContainer = styled.Pressable`
    width: ${WIDTH*0.35}px;
    height: ${HEIGHT*0.05}px
    border-radius: 25px;
    // background-color: ${props=>props.tabPressed == "Fav" ? 'rgba(133, 89, 227, 0.5)' : 'white'}
    justify-content: center;
    align-items:center
    flex-direction: row

`

export const PostedText = styled.Text`
    color: ${props=>props.tabPressed == "Posted" ? PRIMARYCOLOR : PRIMARYGREY};
    font-weight: 700
    margin-left: ${WIDTH*0.02}px;
`

export const FavText = styled.Text`
    color: ${props=>props.tabPressed == "Fav" ? PRIMARYCOLOR : PRIMARYGREY};
    font-weight: 700
    margin-left: ${WIDTH*0.02}px;
`
export const DefaultPostFavText = styled.Text`
    color: ${PRIMARYGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
`