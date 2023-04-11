import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Pressable,
    Animated,
    KeyboardAvoidingView
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


import Ionicons from 'react-native-vector-icons/Ionicons';


import { HEIGHT, WIDTH, PRIMARYCOLOR, SignUpHeader, MEDIUMGREY, ContinueButton, ContinueText, ProgressText, SignUpBackButtonPressable } from '../../../sharedUtils';


// const GENDERS = [
//     {name: "Male", icon: 'male-outline'},
//     {name:"Female", icon: 'female-outline'},
//     {name: "Other", icon: 'male-female-outline'},
//     {name: "Prefer not to say", icon: 'close-outline'}
// ]

const TYPE = [
    {name: "Looking for a sublease", icon: 'male-outline'},
    {name:"Posting a sublease", icon: 'female-outline'},
    {name: "Both", icon: 'male-female-outline'},
]

import { AgeContainer, Header, ProgressBarContainer, SubtitleText, TitleText, GenderRowContainer, GenderName,
    GenderInputContainer, TextInputContainer, GeneralTextInput} from './tenantorsubtenantStyle';

export default function TenantOrSubtenantScreen({navigation, route}){
   
    const [type, setType] = useState("")
    const [location, setLocation] = useState("")

    function checkInput(){
        if(type == ""){
            alert("Please slect an option.")
        }
        else{
            navigation.navigate("PhoneNumber",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: route.params.gender,
                profilePic: route.params.profilePic,
                school: route.params.school,
                occupation: route.params.occupation,
                email: route.params.email,
                type: type
            })
        }  
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
            <SignUpHeader>
                <SignUpBackButtonPressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </SignUpBackButtonPressable>
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  8 / 9</ProgressText>
            </ProgressBarContainer>

            <ScrollView scrollEnabled={false}>
                <TitleText>Are you...</TitleText>
                {/* <SubtitleText>You can always change this later</SubtitleText> */}
                <GenderInputContainer>
                    {TYPE.map((value)=>(
                    <GenderRowContainer key = {value.name + "RowContainer" } onPress={()=> setType(value.name)}>
                        <View style={{ flexDirection:'row', alignItems:'center'}}>
                      
                        <GenderName>{value.name}</GenderName>
                        </View>
                        <Pressable onPress={()=>setType(value.name)}>
                            <Ionicons name='checkbox' size={25} color={ type == value.name ? PRIMARYCOLOR : MEDIUMGREY}/>
                        </Pressable>
                    </GenderRowContainer>
                    ))}
                </GenderInputContainer>
                {/* {
                    (type == "Looking for a sublease" || type == 'Both') ?
                    <View>
                        <SubtitleText style={{fontWeight:'500'}}>Where do you want a sublease?</SubtitleText>
                        <TextInputContainer>
                            <GeneralTextInput value={location} onChangeText={(value)=> setLocation(value)} placeholder="Ex: Madison Wisconsin"  />
                        </TextInputContainer>

                    </View>
                    :
                    (null)
                    
                } */}
            </ScrollView>

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}