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

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

import { UserContext } from '../../../../../UserContext';

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer, ContainsSpace } from '../../../../../sharedUtils';

import { RowContainer, CategoryName, EmailContainer } from './changeEmailStyle.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

export default function ChangeEmailScreen({navigation, route}){

    const [email, setEmail] = useState('')
    const {USERID} = useContext(UserContext);

    async function update(){
        let stringAfterAt = email.indexOf("@") == -1 ? undefined : email.substring(email.indexOf("@"));
        if(email == ""){
            alert("Email is required.")
        }
        else if(email.indexOf("@") == -1){
            alert("Please enter a valid email.")
        }
        else if(ContainsSpace(email.trim())){
            alert("Please enter a valid email.")
        }
        else if(stringAfterAt.indexOf(".") == -1){
            alert("Please enter a valid email.")
        }
        else if(email.substring(email.lastIndexOf(".")) == "."){
            alert("Please enter a valid email.")
        }
        else if(email.indexOf("@") != email.lastIndexOf("@")){
            alert("Please enter a valid email.")
        }
        else{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({
                    email: email
                })
            })
            .then((response) => response.json()).then(data => {
                navigation.goBack()
            })
            .catch(e => {
                console.log(e)
            })
        }
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
                    <Header>Change Email</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update}>
                        <Ionicons name='checkmark' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainer>
                <CategoryName>Old Email</CategoryName>
                <EmailContainer editable={false} value={route.params.email} />
            </RowContainer>
            <RowContainer >
                <CategoryName>New Email</CategoryName>
                <EmailContainer onChangeText={(value)=> setEmail(value)}  value={email} />
            </RowContainer>
        </SafeAreaView>
    )
}