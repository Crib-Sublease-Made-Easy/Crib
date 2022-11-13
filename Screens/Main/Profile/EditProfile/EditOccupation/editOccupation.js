import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';


import { HEIGHT, WIDTH, EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import EncryptedStorage from 'react-native-encrypted-storage';

import { UserContext } from '../../../../../UserContext'

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editOccupationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditOccupationScreen({navigation, route}){
    const {USERID} = useContext(UserContext);

    const [occupation, setOccupation] = useState('')
    

    async function update(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                occupation: occupation.trim(),
            })
        })
        .then((response) => response.json()).then(data => {
            
            navigation.navigate('ProfileEdit', {userData:data})
        })
        .catch(e => {
            console.log(e)
        })
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Change Occupation</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={update}>
                        <Ionicons name='checkmark-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>
            <RowContainer>
                <CategoryName>Latest Occupation</CategoryName>
                <PhoneNumberContainer onChangeText={(value)=> setOccupation(value)}  value={occupation} />
            </RowContainer>
           
        </SafeAreaView>
    )
}