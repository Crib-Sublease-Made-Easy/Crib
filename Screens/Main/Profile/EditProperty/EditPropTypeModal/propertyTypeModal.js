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

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


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

import { HeaderContainer, BackButtonContainer, NameContainer, ResetButtonContainer , Header} from './propTypeModalStyle';
import { Updates } from 'expo';

export default function PropTypesScreen({navigation, route}){
    const [propertyTypes, setPropertyTypes] = useState(route.params.type)

    async function update(){
        console.log(propertyTypes)
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
                type: propertyTypes
            })
        })
            .then((response) => response.json()).then(data => {
                console.log("Update type reponse")
                console.log(data)
                navigation.navigate('EditProperty',{refresh: true})
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
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Property Type</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update}>
                        <Ionicons name='checkmark-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>

            <View style={{ marginTop: HEIGHT * 0.015, width:WIDTH, alignSelf:'center',  }}>
                <FlatList style={{paddingVertical: HEIGHT*0.025}} key={() => flatListTypes.name} data={flatListTypes} renderItem={renderItem} />
            </View>

        </SafeAreaView>   
    )
}