import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {
    ScrollView,
    Text,
    View,
    Dimensions,
    Image,
    Animated as RNAnimated,
    SafeAreaView,
    Pressable,
    Linking
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
Ionicons.loadFont()


export default function LoadingScreen({navigation, route}){
    useEffect(()=>{
        useLastLocation()
    })

    async function useLastLocation(){
        let LastSearched = await EncryptedStorage.getItem("lastSearchedCoor")
        let LastSearchedLocation = await EncryptedStorage.getItem("lastSearchedLocation")
      
        navigation.navigate("DiscoverTabs",{LastSearched: LastSearched, LastSearchedLocation: LastSearchedLocation})
    }
        return(
            <View>

            </View>
        )
}