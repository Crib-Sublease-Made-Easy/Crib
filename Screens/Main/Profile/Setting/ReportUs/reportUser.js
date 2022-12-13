import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';

import SecureStorage from 'react-native-secure-storage'

import { HEIGHT, WIDTH, HeaderContainer, Header,BackButtonContainer,ResetButtonContainer, NameContainer } from '../../../../../sharedUtils';

import { RowContainer,CategoryName, TitleContainer,DescriptionInput  } from './reportUsStyle';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

export default function ReportUserScreen({navigation, route}){
    const [tenantName, setTenantName] = useState("")
    const [email, setEmail] = useState("")
    const [description, setDescription] = useState("")

    async function send(){
        const accessToken = await SecureStorage.getItem("accessToken");
        await fetch('https://crib-llc.herokuapp.com/reportUser', { // changed endpoint from contact to report
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accessToken,
            },
            
            body: JSON.stringify({
                email: email,
                tenant: tenantName,
                description: description
            })
        }) 
        .then(res => {
            if (res.status == 200){
                alert("Reported User Successfully!")
                navigation.goBack();
            }
            else{
                alert("An error has occured, please try again later!")
                navigation.goBack();
            }
        })
        .catch(e=>{
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
                    <Header>Report User</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={send}>
                        <Ionicons name='checkmark' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainer>
                <CategoryName>User/Tenant Name</CategoryName>
                <TitleContainer onChangeText={(value)=> setTenantName(value)} value={tenantName} />
            </RowContainer>
            <RowContainer>
                <CategoryName>Email to contact you</CategoryName>
                <TitleContainer onChangeText={(value)=> setEmail(value)} value={email} />
            </RowContainer>
            <RowContainer>
                <CategoryName>Please describe your issue with the user</CategoryName>
                <DescriptionInput multiline value={description} onChangeText={(value)=>setDescription(value)}/>
            </RowContainer>


        </SafeAreaView>
    )
}