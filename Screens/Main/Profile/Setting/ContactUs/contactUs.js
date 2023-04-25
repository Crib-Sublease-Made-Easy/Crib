import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, HeaderContainer, Header,BackButtonContainer,ResetButtonContainer, NameContainer, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer } from '../../../../../sharedUtils';

import { RowContainer,CategoryName, TitleContainer,DescriptionInput  } from './contactusStyle';


import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ContactUsScreen({navigation, route}){
    const [title, setTitle ] = useState("")
    const [email, setEmail] = useState(route.params.email)
    const [description, setDescription] = useState("")

    async function send(){
        if(title.trim() == ""){
            alert("Please include a title.")
            return;
        }
        if(email.trim() == ""){
            alert("Please include an email.")
            return;
        }
        if(description.trim() == ""){
            alert("Please include a valid description.")
            return;
        }
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined){
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
        }
        catch{
            alert("Error. Please try again later!")
        }
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25}/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Contact Us</Header>
                </EditPageNameContainer>
                <EditPageForwardButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={send}>
                        <Ionicons name='checkmark' size={25}/>
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