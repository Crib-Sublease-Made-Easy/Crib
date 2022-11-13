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
  FlatList,
  ScrollView
} from 'react-native';

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header, GetFAIcons,
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer, GetFAIconsInBlack} from '../../../../../sharedUtils'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY, amenitiesList, GetFAIconWithColor} from '../../../../../sharedUtils'

import { RowContainer, CategoryName, AmenitiesContainer } from './editPropertyAmenStyle';

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditPropertyAmenitiesScreen({navigation, route}){
    const [propertyAmenities, setpropertyAmenities] = useState(route.params.amenities)

    function updateAmenities(name) {

        if (propertyAmenities.indexOf(name) != -1) {
            let tempindex = propertyAmenities.indexOf(name);
            setpropertyAmenities([...propertyAmenities.slice(0, tempindex), ...propertyAmenities.slice(tempindex + 1, propertyAmenities.length)])
        }
        else {
            setpropertyAmenities(prev => [...prev, name]);
        }
    }

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
                amenities: propertyAmenities
               
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

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Edit Amenities</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={update}>
                        <Ionicons name='checkmark-outline' size={25}color={PRIMARYCOLOR}/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>
            <RowContainer>
                <CategoryName>Property Amenities</CategoryName>
                <ScrollView style={{height:HEIGHT*0.75}}>
                <AmenitiesContainer>
               
                {amenitiesList.map((value, index) => (
                                   
                    <Pressable onPress={() => updateAmenities(value.name)} key={value.name + index + 'view'} style={{paddingVertical: HEIGHT*0.02, width:WIDTH*0.9,alignSelf:'center',justifyContent:'space-between'
                    , alignItems:'center', flexDirection:'row', paddingHorizontal: WIDTH*0.03}}>
                        <Pressable onPress={() => updateAmenities(value.name)} style={{flexDirection:'row', alignItems:'center'}}>
                            {GetFAIconsInBlack(value.name)}
                            <Text style={{color: 'black', marginLeft: WIDTH*0.025}}>{value.name.replace("_", " ").replace("_", " ")}</Text>
                        </Pressable>
                        <Pressable onPress={() => updateAmenities(value.name)} style={{padding: WIDTH*0.012, 
                            backgroundColor: propertyAmenities.indexOf(value.name) == -1 ? DARKGREY : PRIMARYCOLOR , borderRadius:3}}>
                            {GetFAIconWithColor("Check", "white")}
                        </Pressable>
                    </Pressable>
                ))}
                </AmenitiesContainer>
                </ScrollView>
            </RowContainer>

        </SafeAreaView>
    )
}