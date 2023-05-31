import * as React  from 'react';
import { useState, useContext, createContext, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  AppState,
  Touchable,
  Keyboard,
  ActivityIndicator,
  Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Modal from "react-native-modal";
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, Header, WIDTH, HEIGHT } from '../../../../sharedUtils';
import { ContactUsText, FAQContactUsContainer, FAQContainer, FAQContent, FAQHeader, QuestionText } from './cribConnectFAQStyle';
export default function CribConnectFAQScreen({navigation}){
    const [FAQ, setFAQ] = useState([])
    useEffect(()=> {

        //Need to fetch the FAQ
        fetchFAQ()
    }, [])

    async function fetchFAQ(){
        let resp = await fetch("https://crib-llc.herokuapp.com/payments/premium/FAQ")
        let data = await resp.json();
        setFAQ(data)
    }


    return(
        <View style={{flex: 1, backgroundColor:'white'}}>
            <SafeAreaView  style={{paddingBottom: HEIGHT*0.1}}>
                
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header>FAQ</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                <ScrollView showsVerticalScrollIndicator={false}>
                {
                    FAQ.map((item, index) => {
                        return(
                            <FAQContainer key={"FAQ" + index}>
                                <FAQHeader>{Object.keys(item)}</FAQHeader>
                                <FAQContent>{Object.values(item)}</FAQContent>
                            </FAQContainer>
                        )
                    })
                }
                <QuestionText>Still have a question?</QuestionText>
                <FAQContactUsContainer onPress={()=> navigation.navigate("ContactUs", {email: ""})}>
                    <ContactUsText>Contact us</ContactUsText>
                </FAQContactUsContainer>
                <View style={{width: WIDTH, height: HEIGHT*0.075}}/>
               </ScrollView>
            </SafeAreaView>
        </View>
    )
}