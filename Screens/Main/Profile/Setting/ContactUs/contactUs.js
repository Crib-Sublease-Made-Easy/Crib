import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, HeaderContainer, Header,BackButtonContainer,ResetButtonContainer, NameContainer, GetFAIconWithColor } from '../../../../../sharedUtils';

import { RowContainer,CategoryName, TitleContainer,DescriptionInput  } from './contactusStyle';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

export default function ContactUsScreen({navigation, route}){
    const [title, setTitle ] = useState("")
    const [email, setEmail] = useState(route.params.email)
    const [description, setDescription] = useState("")

    async function send(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        await fetch('https://crib-llc.herokuapp.com/contact', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accessToken,
            },
            
            body: JSON.stringify({
                email: email,
                title: title,
                description: description
            })
        }) 
        .then(res => {
            if (res.status == 200){
                alert("Message successfully sent!")
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
                        {GetFAIconWithColor("ArrowLeft", "black")}
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Contact Us</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={send}>
                        {GetFAIconWithColor("Check", "black")}
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainer>
                <CategoryName>Title</CategoryName>
                <TitleContainer onChangeText={(value)=> setTitle(value)} value={title} />
            </RowContainer>
            <RowContainer>
                <CategoryName>Email to contact you</CategoryName>
                <TitleContainer onChangeText={(value)=> setEmail(value)} value={email} />
            </RowContainer>
            <RowContainer>
                <CategoryName>Description</CategoryName>
                <DescriptionInput multiline value={description} onChangeText={(value)=>setDescription(value)}/>
            </RowContainer>


        </SafeAreaView>
    )
}