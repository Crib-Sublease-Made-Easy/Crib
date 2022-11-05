import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, GetFAIconWithColor} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editEducationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditEducationScreen({navigation, route}){
   
    const [education, setEducation] = useState('')
    
    async function update(){
        const accessToken = await SecureStorage.getItem("accessToken");
        console.log("UID" , route.params.uid)
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
            console.log("Update education reponse")
            console.log(data)
            navigation.navigate('ProfileEdit',{userData:data,})
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
                        {GetFAIconWithColor("ArrowLeft", "black")}
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Change Education</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update}>
                        {GetFAIconWithColor("Check", "black")}
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>

            <RowContainer>
                <CategoryName>Latest Education</CategoryName>
                <PhoneNumberContainer onChangeText={(value)=> setEducation(value)}  value={education} />
            </RowContainer>
           
        </SafeAreaView>
    )
}