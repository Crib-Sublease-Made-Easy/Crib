import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import DatePicker from 'react-native-date-picker'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY} from '../../../../../sharedUtils'

import { DescriptionInput, RowContainer, CategoryName } from './editPropertyDescriptionStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Router } from 'express';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
FontAwesome.loadFont()

import EncryptedStorage from 'react-native-encrypted-storage';



export default function EditPropertyDescriptionScreen({navigation, route}){

    const [description, setDescription] = useState(route.params.description);

    async function update(){
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined){
                fetch('https://crib-llc.herokuapp.com/properties/' + route.params.uid, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    },
                    body: JSON.stringify({
                        description: description
                    })
                })
                .then((response) => response.json()).then(data => {
                    navigation.navigate('EditProperty', {propertyData: route.params.propertyData})
                })
                .catch(e => {
                    console.log(e)
                })
            }
        }
        catch{
            alert("Error. Please try again later!")
        }        
    }

    return(
        <SafeAreaView style={{flex:1}}>
            
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                        <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Edit Description</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={update}>
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainer >
                <CategoryName>Property Description</CategoryName>
                <DescriptionInput multiline value={description} onChangeText={(value)=>setDescription(value)}>
                        
                </DescriptionInput>
            </RowContainer>
           
        </SafeAreaView>
    )
}