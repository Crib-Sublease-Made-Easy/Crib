import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  Image,
  Pressable,
  Animated
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../UserContext';

import ProfileEditModal from './profileEdit';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function SettingScreen(){
    return(
        <View>

        </View>
    )
}