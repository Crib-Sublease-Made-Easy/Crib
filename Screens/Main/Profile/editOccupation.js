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


import EncryptedStorage from 'react-native-encrypted-storage';

import { UserContext } from '../../../../../UserContext'

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './editOccupationStyle';



export default function EditOccupationScreen({navigation, route}){
    console.log(occupation)
    const {USERID} = useContext(UserContext);

    const [occupation, setOccupation] = useState('')
    

    async function update(){
        console.timeLog("fewfw")
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined && USERID != undefined && USERID != null){
                fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
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
                    navigation.navigate('ProfileEdit', {userData:data})
                })
                .catch(e => {
                    console.log(e)
                })
            }
            
        }
        catch{
            console.log("ERROR --- UPDATE")
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
                <PhoneNumberContainer onChangeText={(value)=> {setOccupation(value), console.log(occupation)}}  value={occupation} />
            </RowContainer>
           
        </SafeAreaView>
    )
}