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
import { User } from 'realm';


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';


import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, Terms, BodyContainer, HelpText } from './termsAndServiceStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function TermsAndService({navigation, route}){
    const [termsOfServices, setTermsOfServices] = useState([])

    useEffect(()=>{
        // getPrivacy()
        getTermsOfServices()
    },[])

    // async function getPrivacy(){
    //     let resp = await fetch("https://crib-llc.herokuapp.com/lead/privacydetails")
    //     let data = await resp.json();
    //     setPrivacy(data)
    // }

    async function getTermsOfServices(){
        let resp = await fetch("https://crib-llc.herokuapp.com/web/termsofservicesdetails")
        let data = await resp.json();
        setTermsOfServices(data)
    }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} />
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Terms of service</Header>
                </EditPageNameContainer>
                <EditPageForwardButtonContainer/>
            </EditPagesHeaderContainer>

            <ScrollView style={{flex:1, paddingTop: HEIGHT*0.025}}>
           
                
            <RowContainer>
                {
                    termsOfServices.map((item, index) => {
                        return(
                            <View  key={"TermsOfServices" + index}>
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