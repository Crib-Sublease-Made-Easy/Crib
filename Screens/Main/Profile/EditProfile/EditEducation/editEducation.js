import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, GetFAIconWithColor, EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editEducationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditEducationScreen({navigation, route}){
   
    const [education, setEducation] = useState('')
    
    async function update(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        fetch('https://crib-llc.herokuapp.com/users/' + route.params.uid, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                school: education.trim(),
            })
        })
        .then((response) => response.json()).then(data => {
            navigation.navigate('ProfileEdit',{userData:data,})
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
                    <Header>Change Education</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={update}>
                        <Ionicons name='checkmark-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>


            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>

            <RowContainer>
                <CategoryName>Latest Education</CategoryName>
                <PhoneNumberContainer onChangeText={(value)=> setEducation(value)}  value={education} />
            </RowContainer>
           
        </SafeAreaView>
    )
}