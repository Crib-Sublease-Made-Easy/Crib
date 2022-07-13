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
  Animated 
} from 'react-native';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'
const TEXTGREY = '#969696'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { Container } from '../Discover/discoverSearchStyle';
import { SharedElement } from 'react-navigation-shared-element';

export default function DiscoverSearchScreen({navigation}){
    return(
       <SafeAreaView style={{backgroundColor:'white'}}>
        
        
            <SharedElement id="searchBox">
            <Container >

            </Container>
            </SharedElement>

        
        
        </SafeAreaView>
    )
}