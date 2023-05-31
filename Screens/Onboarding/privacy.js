import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  ScrollView
} from 'react-native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, EditPageForwardButtonContainer} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';


import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, BodyContainer, HelpText, Terms } from './termsAndServiceStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function Privacy({navigation, route}){
    const [privacy, setPrivacy] = useState([])
    useEffect(()=>{
        getPrivacy()
       
    },[])

    async function getPrivacy(){
        let resp = await fetch("https://crib-llc.herokuapp.com/web/privacydetails")
        let data = await resp.json();
        setPrivacy(data)
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Privacy</Header>
                </EditPageNameContainer>
                <EditPageForwardButtonContainer/>
            </EditPagesHeaderContainer>
          
            <ScrollView style={{flex:1, paddingTop: HEIGHT*0.025}}>
            <RowContainer>
                {
                    privacy.map((item, index) => {
                        return(
                            <View  key={"Privac" + index}>
                                <CategoryName>{Object.keys(item)}</CategoryName>
                                <Terms>{Object.values(item)}</Terms>
                            </View>
                        )
                    })
                }
                    
            </RowContainer>
            <View style={{height: HEIGHT*0.05, width: WIDTH}} />
            </ScrollView>
           
           
        </SafeAreaView>
    )
}