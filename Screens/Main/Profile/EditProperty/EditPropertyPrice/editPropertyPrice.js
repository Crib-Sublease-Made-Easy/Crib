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
import Modal from "react-native-modal";

import styled from 'styled-components/native';



import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';


const flatListTypes =
[{ name: "Room", image: require('../../../../../assets/room.jpg'), description: "Shared public space" },
{ name: "House", image: require('../../../../../assets/house.jpg'), description: "Entire House" },
{ name: "Apartment", image: require('../../../../../assets/apartment.jpg'), description: "2+ Bedroom Apartment" },
{ name: "Studio", image: require('../../../../../assets/room.jpg'), description: "Open-styled apartment" }
]

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import {RowContainer, CategoryName, FollowUpContainer, FollowUpText,PriceContainer, } from './editPropertyPriceStyle';

export default function EditPropertyPriceScreen({navigation, route}){
    const [propertyPrice, setPropertyPrice] = useState(route.params.price.toString())
    const [securityDeposit,setSecurityDeposit ] = useState(route.params.propertyData.securityDeposit == null ? 0 : route.params.propertyData.securityDeposit.toString())

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
                        price: propertyPrice.split("$")[1],
                        securityDeposit:  securityDeposit == 0 ? securityDeposit : securityDeposit.split("$")[1],
                    })
                })
                .then((response) => response.json()).then(async data => {
                    navigation.navigate('Profile', {propertyData: route.params.propertyData})
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

    function formatPrice(price){
        if (price == ""){
            return;
        }
        let val = price.replace("$","")
        return "$" + val
    }

    return(
    <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
        <HeaderContainer>
            <BackButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                    <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                </Pressable>
            </BackButtonContainer>
            <NameContainer>
                <Header>Edit Price</Header>
            </NameContainer>
            <ResetButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={update} >
                    <Ionicons name='checkmark-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                </Pressable>
            </ResetButtonContainer>
        </HeaderContainer>
        <RowContainer>
            <CategoryName>Property Price</CategoryName>
            <PriceContainer autoFocus onChangeText={(value)=> setPropertyPrice(value)}  placeholder={"$" + route.params.price.toString()}
            value={formatPrice(propertyPrice)} placeholderTextColor='black' keyboardType='number-pad'/>
        </RowContainer>
        <RowContainer>
            <CategoryName>Security Deposit</CategoryName>
            <PriceContainer autoFocus onChangeText={(value)=> setSecurityDeposit(value)}  placeholder={"$" + securityDeposit == null ? "0" : securityDeposit.toString()}
            value={securityDeposit == null ? 0 : formatPrice(securityDeposit)} placeholderTextColor='black' keyboardType='number-pad'/>
        </RowContainer>
        
    </SafeAreaView>   
    )
}