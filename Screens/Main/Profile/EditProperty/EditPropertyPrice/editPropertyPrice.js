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



import { HEIGHT, WIDTH, PRIMARYCOLOR,
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

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
    const [propertyPriceNego,setPropertyPriceNego ] = useState(false)

    async function update(){
       
        if(propertyPrice.split("$")[1] > 10000){
            alert("Property Price cannot be greater than $10000.")
        }
        else if(propertyPrice.split("$")[1] == undefined){
            //Checks if the property price is 0
            alert("Invalid property price.")
        }
        else{
        const accessToken = await EncryptedStorage.getItem("accessToken");
        fetch('https://crib-llc.herokuapp.com/properties/' + route.params.uid, {
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
            .then((response) => response.json()).then(async data => {
                await AsyncStorage.removeItem('postedProperty')
                navigation.navigate('EditProperty', {propertyData: route.params.propertyData})
            })
            .catch(e => {
                console.log(e)
            })

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
        <EditPagesHeaderContainer>
            <EditPageBackButtonContainer>
                <Pressable onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='black'/>
                </Pressable>
            </EditPageBackButtonContainer>
            <EditPageNameContainer>
                <Header>Property Price</Header>
            </EditPageNameContainer> 
            <EditPageForwardButtonContainer>
                <Pressable onPress={update}>
                    <Ionicons name='checkmark-outline' size={25}color={PRIMARYCOLOR}/>
                </Pressable>
            </EditPageForwardButtonContainer>
        </EditPagesHeaderContainer>
    
        <RowContainer>
            <CategoryName>Property Price</CategoryName>
            <PriceContainer onChangeText={(value)=> setPropertyPrice(value)}  placeholder={"$" + route.params.price.toString()}
            value={formatPrice(propertyPrice)} placeholderTextColor='black' keyboardType='number-pad'/>
        </RowContainer>
        
    </SafeAreaView>   
    )
}