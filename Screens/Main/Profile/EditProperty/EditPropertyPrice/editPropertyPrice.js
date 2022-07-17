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
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} >
                    <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                </Pressable>
            </ResetButtonContainer>
        </HeaderContainer>
        <RowContainer>
            <CategoryName>Property Price</CategoryName>
            <PriceContainer autoFocus onChangeText={(value)=> setPropertyPrice(value)}  placeholder={"$" + route.params.price.toString()}
            value={propertyPrice} placeholderTextColor='black' keyboardType='number-pad'/>
        </RowContainer>
        <FollowUpContainer>
            <Pressable onPress={() => setPropertyPriceNego(!propertyPriceNego)}>
                <Ionicons size={20} name={propertyPriceNego ? 'checkbox' : 'checkbox-outline'} color={DARKGREY} style={{ paddingVertical: HEIGHT * 0.01 }} />
            </Pressable>
            <FollowUpText>Negotiable</FollowUpText>
        </FollowUpContainer>    
    </SafeAreaView>   
    )
}