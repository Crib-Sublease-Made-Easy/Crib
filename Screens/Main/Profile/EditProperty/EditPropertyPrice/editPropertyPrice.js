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
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


const flatListTypes =
[{ name: "Room", image: require('../../../../../assets/room.jpeg'), description: "Shared public space" },
{ name: "House", image: require('../../../../../assets/house.jpeg'), description: "Entire House" },
{ name: "Apartment", image: require('../../../../../assets/apartment.jpeg'), description: "2+ Bedroom Apartment" },
{ name: "Studio", image: require('../../../../../assets/studio.jpeg'), description: "Open-styled apartment" }
]

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import {RowContainer, CategoryName, FollowUpContainer, FollowUpText,PriceContainer, } from './editPropertyPriceStyle';
export default function EditPropertyPriceScreen({navigation, route}){
    const [propertyPrice, setPropertyPrice] = useState(route.params.price.toString())
    const [propertyPriceNego,setPropertyPriceNego ] = useState(false)


    async function update(){
       
        console.log(route.params.propID)
        const accessToken = await SecureStorage.getItem("refreshToken");
        fetch('https://sublease-app.herokuapp.com/properties/' + route.params.uid, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                price: propertyPrice.split("$")[1]
            })
        })
            .then((response) => response.json()).then(data => {
                console.log("Update type reponse")
                console.log(data)
                navigation.navigate('EditProperty')
            })
            .catch(e => {
                console.log(e)
            })
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
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                </Pressable>
            </BackButtonContainer>
            <NameContainer>
                <Header>Edit Price</Header>
            </NameContainer>
            <ResetButtonContainer>
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update} >
                    <Ionicons name='checkmark-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                </Pressable>
            </ResetButtonContainer>
        </HeaderContainer>
        <RowContainer>
            <CategoryName>Property Price</CategoryName>
            <PriceContainer autoFocus onChangeText={(value)=> setPropertyPrice(value)}  placeholder={"$" + route.params.price.toString()}
            value={formatPrice(propertyPrice)} placeholderTextColor='black' keyboardType='number-pad'/>
        </RowContainer>
        
    </SafeAreaView>   
    )
}