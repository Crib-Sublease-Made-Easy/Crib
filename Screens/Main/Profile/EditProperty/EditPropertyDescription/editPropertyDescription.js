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

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

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

import { PropertyDescription } from '../../../Discover/discoverPDStyle';


export default function EditPropertyDescriptionScreen({navigation, route}){

    const [description, setDescription] = useState(route.params.description);

    async function update(){
    
        const accessToken = await EncryptedStorage.getItem("accessToken");
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

    return(
        <SafeAreaView style={{flex:1}}>
            
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Property Description</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={update}>
                        <Ionicons name='checkmark-outline' size={25}color={PRIMARYCOLOR}/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>
            <RowContainer >
                <CategoryName>Property Description</CategoryName>
                <DescriptionInput multiline value={description} onChangeText={(value)=>setDescription(value)}>
                        
                </DescriptionInput>
            </RowContainer>
           
        </SafeAreaView>
    )
}