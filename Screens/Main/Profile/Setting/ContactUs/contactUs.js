import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, HeaderContainer, Header,BackButtonContainer,ResetButtonContainer, NameContainer, GetFAIconWithColor,
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer } from '../../../../../sharedUtils';

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
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Contact Us</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                    <Pressable onPress={send} >
                        <Ionicons name='checkmark-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>
           
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