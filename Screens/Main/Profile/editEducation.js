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

import Ionicons from 'react-native-vector-icons/Ionicons';



import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editEducationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function EditEducationScreen({navigation, route}){
    const {USERID} = useContext(UserContext);
    const [education, setEducation] = useState('')
    
    async function update(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        if(USERID != null && accessToken != undefined){
            fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
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
                console.log("ERROR --- EDITEDUCATION --- UPDATE")
            })
        }
        
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          <HeaderContainer>
                <BackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Change Education</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={update}>
                        <Ionicons name='checkmark' size={25} style={{paddingHorizontal:WIDTH*0.02}} color='black'/>
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