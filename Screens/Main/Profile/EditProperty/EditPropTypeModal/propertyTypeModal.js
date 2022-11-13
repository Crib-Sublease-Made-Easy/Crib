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

import EncryptedStorage from 'react-native-encrypted-storage';


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY, Header,
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

const flatListTypes =
[{ name: "Room", image: require('../../../../../assets/room.jpg'), description: "Shared public space" },
{ name: "House", image: require('../../../../../assets/house.jpg'), description: "Entire House" },
{ name: "Apartment", image: require('../../../../../assets/apartment.jpg'), description: "2+ Bedroom Apartment" },
{ name: "Studio", image: require('../../../../../assets/room.jpg'), description: "Open-styled apartment" }
]

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PropTypesScreen({navigation, route}){
    const [propertyTypes, setPropertyTypes] = useState(route.params.type)
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
                type: propertyTypes
            })
        })
            .then((response) => response.json()).then(async data => {
                await AsyncStorage.removeItem('postedProperty')
                navigation.navigate('EditProperty',{propertyData: route.params.propertyData})
            })
            .catch(e => {
                console.log(e)
            })
    }

    const renderItem = ({ item, index }) => (
       
        <Pressable onPress={() => setPropertyTypes(item.name)}
        
            style={{ alignSelf: 'center', width: WIDTH * 0.9, height: WIDTH * 0.2, backgroundColor: propertyTypes == item.name ? PRIMARYCOLOR : 'white', 
            borderRadius: 15, marginVertical: HEIGHT * 0.0125, flexDirection: 'row', shadowColor: MEDIUMGREY, shadowRadius:5, shadowOpacity:0.9, shadowOffset: {width:0,height:0}, elevation:5}}>
            
            <Image source={item.image} style={{ height: '100%', width: WIDTH * 0.45, borderBottomLeftRadius: 15, borderTopLeftRadius: 15,
            }} />

            <View style={{ height: '100%', width: WIDTH * 0.45, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ alignSelf: 'center', fontWeight: '700', color: propertyTypes == item.name ? 'white' : 'black' }}>{item.name}</Text>
                <Text style={{ color: propertyTypes == item.name ? 'white' : DARKGREY }}>{item.description}</Text>
            </View>
        </Pressable>
    );

    return(
       <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.navigate("EditProperty",{propertyData: route.params.propertyData})} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Property Type</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={update}>
                        <Ionicons name='checkmark-outline' size={25}color={PRIMARYCOLOR}/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>
           

            <View style={{ marginTop: HEIGHT * 0.015, width:WIDTH, alignSelf:'center',  }}>
                <FlatList style={{paddingVertical: HEIGHT*0.025}} key={() => flatListTypes.name} data={flatListTypes} renderItem={renderItem} />
            </View>

        </SafeAreaView>   
    )
}