import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { UserContext } from '../../../../../UserContext'

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editOccupationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditOccupationScreen({navigation, route}){
    const {USERID} = useContext(UserContext);

    const [occupation, setOccupation] = useState('')
    

    async function update(){
        const accessToken = await SecureStorage.getItem("accessToken");
        fetch('https://crib-llc-dev.herokuapp.com/users/' + USERID, {
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
            
            console.log(data)

            navigation.navigate('ProfileEdit', {userData:data})
        })
        .catch(e => {
            console.log(e)
        })
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Change Occupation</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update}>
                        <Ionicons name='checkmark' size={25} style={{paddingHorizontal:WIDTH*0.02}} color='black' />
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>
            <RowContainer>
                <CategoryName>Latest Occupation</CategoryName>
                <PhoneNumberContainer onChangeText={(value)=> setOccupation(value)}  value={occupation} />
            </RowContainer>
           
        </SafeAreaView>
    )
}