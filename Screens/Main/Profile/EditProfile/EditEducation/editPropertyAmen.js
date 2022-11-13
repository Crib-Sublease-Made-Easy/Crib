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

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY, amenitiesList,GetAmenitiesIcon} from '../../../../../sharedUtils'

import { RowContainer, CategoryName, AmenitiesContainer } from './editPropertyAmenStyle';

import EncryptedStorage from 'react-native-encrypted-storage';


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
            .then((response) => response.json()).then(data => {
                navigation.navigate('EditProperty', {propertyData: route.params.propertyData})
            })
            .catch(e => {
                console.log(e)
            })
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
                    <Header>Edit Amenities</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update} >
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainer>
                <CategoryName>Property Amenities</CategoryName>
                <ScrollView style={{height:HEIGHT*0.75}}>
                <AmenitiesContainer>
                {amenitiesList.map((value, index) => (
                    <View key={value.name + index + 'view'} style={{
                        minWidth: WIDTH * 0.35, width: value.name.length * 0.03 * WIDTH, height: HEIGHT * 0.055, justifyContent: 'center',
                        paddingRight: WIDTH * 0.03
                    }}>
                        <Pressable key={value.name + 'pressable'} onPress={() => updateAmenities(value.name)} style={{
                            borderWidth: 3, borderColor: propertyAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT * 0.045,
                            borderRadius: 20, justifyContent: 'center', backgroundColor: value.color, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Text key={value.name + 'text'} style={{ justifyContent: 'center', color: 'white' }}>
                                <Ionicons name={GetAmenitiesIcon(value.name)} size={15} />
                                {"   "}{value.name.replace("_"," ")}
                            </Text>
                        </Pressable>

                    </View>
                ))}
                </AmenitiesContainer>
                </ScrollView>
            </RowContainer>

        </SafeAreaView>
    )
}