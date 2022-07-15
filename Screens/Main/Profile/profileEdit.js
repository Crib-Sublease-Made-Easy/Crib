import React, {useState, useRef, useEffect} from 'react'
import {
    SafeAreaView,
    Image,
    Pressable,
    Animated,
    Keyboard
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';



import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { DARKGREY, HEIGHT, LIGHTGREY, MEDIUMGREY, PRIMARYCOLOR, WIDTH, EXTRALIGHT } from '../../../sharedUtils';

import {HeaderContainer, Header, BackButtonContainer, NameContainer, ResetButtonContainer, TopContainer, ImageContainer
        ,NameJobContainer, JobText, RowContainer, CategoryName, AboutMeInput, RowName, RowContainerCol} from './profileEditStyle';

export default function ProfileEditScreen({navigation, route}){
    const userData = route.params.userData
    console.log(userData)
   

    return(
        
        <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
            
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Edit Profile</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}}>
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>

            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
            <TopContainer>
                    <ImageContainer>
                        <Image style={{width: WIDTH*0.35, height:WIDTH*0.35, borderRadius:WIDTH*0.175, backgroundColor: EXTRALIGHT}}/>
                    </ImageContainer>
                    <NameJobContainer>
                        <Header>{userData.firstName}  {userData.lastName}</Header>
                        <JobText style={{color:DARKGREY}}>Joined May 2021</JobText>
                    </NameJobContainer>
            </TopContainer>
            
            <RowContainerCol>
                <CategoryName>About me</CategoryName>
                <AboutMeInput multiline>
                After informing the parties of your intent to make an introduction, 
                state the name of the person you are introducing. In most situations, this is usually the younger person
                </AboutMeInput>
            </RowContainerCol>
            </TouchableWithoutFeedback>

            <CategoryName>Pronouns</CategoryName>
            <RowContainer>
                <RowName>{userData.gender}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>

            <CategoryName>Education</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditEducation")}>
                <RowName>University of Wisconsin - Madison</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>

            <CategoryName>Occupation</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditOccupation")}>
                <RowName>{userData.occupation}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
        </SafeAreaView>
       
    )
}