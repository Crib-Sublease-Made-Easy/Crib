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
import Lottie from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { UserContext } from '../../../UserContext';

import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, Header, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils'
import {CribPremiumPaidSubheaderText, CribPremiumSubheaderText, PreferenceLabel, PreferencesInput, ReferralCodeHelperText, SubmitButton, SubmitButtonOutline, SubmitText} from './cribconnectpreferencestyle'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function CribConnectPreferenceScreen({navigation, route}){
    const [userData, setUserData] = useState()
    const [subleaseArea, setSubleaseArea] = useState("your area")
    const [prefetchCribConnectInterestedNumber, setPrefetchCribConnectInterestedNumber] = useState("A lot of")
    const [cribPremium, setCribPremium] = useState(false)
    const [preference, setPreference] = useState(route.params.preference == null ? "" : route.params.preference)

    useEffect(()=>{
       getTokens()
    },[])

    async function getTokens(){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        let USERID = await EncryptedStorage.getItem("userId")
      
        if(accessToken != undefined && USERID != undefined && accessToken != null){
           
            //Get user favorite properties
            // fetchFavoriteProperties(accessToken)
           
            await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                
                if(userData.cribPremium.paymentDetails.status == true){
                    setCribPremium(true)
                }
                setUserData(userData)
                if(userData.cribPremium.paymentDetails.status == false){
                    checkIfPaid(userData)
                }
                
                if(userData.postedProperties.length != 0){
                    await fetch('https://crib-llc.herokuapp.com/properties/' + userData.postedProperties[0], {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    },
                    body:JSON.stringify({
                        viewCount: "false"
                    })
                    }) 
                    .then(async res => {
                        if(res.status == 200){
                            const data = await res.json()
                         
                           
                            if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("madison") != -1){
                                setPrefetchCribConnectInterestedNumber("91+");
                                setSubleaseArea("Madison")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("chicago") != -1){
                                setPrefetchCribConnectInterestedNumber("473+");
                                setSubleaseArea("Chicago")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("newyork") != -1){
                                setPrefetchCribConnectInterestedNumber("+");
                                setSubleaseArea("New York")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("austin") != -1){
                                setPrefetchCribConnectInterestedNumber("423+");
                                setSubleaseArea("Austin")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("sanmarcos") != -1){
                                setPrefetchCribConnectInterestedNumber("236+");
                                setSubleaseArea("San Marcos")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("seattle") != -1){
                                setPrefetchCribConnectInterestedNumber("477+");
                                setSubleaseArea("Seattle")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("losangeles") != -1){
                                setPrefetchCribConnectInterestedNumber("565+");
                                setSubleaseArea("LA")
                            }
                        }
                        
                    })
                    .catch(e=>{
                        console.log("Error")
                    })
                } 
                else{
                    setPrefetchCribConnectInterestedNumber("A lot of");
                    setSubleaseArea("your area")
                }
            })
            .catch(e=>{
                console.log("ERROR --- PROFILE --- GETTOKEN")
                alert(e)
            })
            
        } 
    }

    async function updatePreference(){
        // console.log("updating")
        // console.log(preference)
        // console.log(userData.postedProperties[0])

        navigation.navigate("CribConnectPreference", {userData: userData})

        if(userData.postedProperties.length == 0){
            alert("Post a property first!")
            navigation.navigate("Profile")
        }
        const accessToken = await EncryptedStorage.getItem("accessToken");
      

            if(accessToken != undefined){
                fetch('https://crib-llc.herokuapp.com/properties/' + userData.postedProperties[0], {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    },
                    body: JSON.stringify({
                        preference: preference
                    
                    })
                })
                .then(async res => {
                    if(res.status == 200){
                        alert("Preference successfully updated!")
                    }
                    else{
                        alert("Error occured please try again later!")
                    }
                })
                .catch(e => {
                    console.log(e)
                })

            }
       
    }

    async function checkIfPaid(user){
        console.log("checking")
        let at = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")
        console.log(at)
        if(user?.cribPremium?.paymentDetails?.orderId == undefined){
            console.log("undefined")
            return;
        }
        await fetch("https://crib-llc.herokuapp.com/payments/premium/status",{
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + at,
            },
            body: JSON.stringify({
                orderId: user?.cribPremium?.paymentDetails?.orderId,
                userId: uid
            })
        })
        .then(async res=> {
            console.log(res.status)
            if(res.status == 200){
                let data = await res.json();
                if(data.order.state == "OPEN"){
                    setCribPremium(true)
                }
                else{
                    console.log("unpaid")
                }
            }
        })
        .catch(e=>{
            console.log("ERROR  ", e)
        })
      
    }

    return(
        <View style={{height: HEIGHT, width:WIDTH, backgroundColor:'white', flex:1, position:'relative', paddingTop: HEIGHT*0.075}}>
            <SafeAreaView>
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='black'/>
                </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                <Header>Crib Conenct</Header>
                </EditPageNameContainer>
            <EditPageForwardButtonContainer/>
        </EditPagesHeaderContainer>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                <View style={{paddingBottom: HEIGHT*0.15}}>
                
                
                <View style={{width: WIDTH*0.9,alignSelf:'center',}}>
                    <CribPremiumPaidSubheaderText>
                        We're <Text style={{color:PRIMARYCOLOR, fontWeight:'700'}}>searching</Text>!
                    </CribPremiumPaidSubheaderText>
                    <Text style={{fontSize: HEIGHT*0.0175, fontWeight:'400', marginTop: HEIGHT*0.02, color:'#545454'}}>Check your messages for potential tenants soon</Text>
                    <View style={{marginTop: HEIGHT*0.075}}>
                        <PreferenceLabel>Your preferences</PreferenceLabel>
                        <PreferencesInput value={preference} onChangeText={(val)=>setPreference(val)} multiline placeholder="Example: I would perfer to find a tenant who is a female college student"/>
                    </View>
                </View>
                
                
                {/* <SubmitButton style={{marginTop: HEIGHT*0.1}} onPress={()=>navigation.navigate("CribConnectSubtenant", {userData: userData})}>
                    <SubmitText>Find a sublease</SubmitText>
                </SubmitButton> */}
                                
                {/* <ReferralCodeHelperText style={{color:'black', marginTop: HEIGHT*0.15,}}>Money back guaranteed</ReferralCodeHelperText> */}
                
                </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
                <View style={{position:'absolute',bottom: HEIGHT*0.1, alignSelf:'center'}}>
                    <SubmitButton onPress={()=>{!cribPremium ? navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea}) : updatePreference()}}>
                        
                        <SubmitText >{"Update my preference"}</SubmitText>           
                        
                    </SubmitButton>
                </View>
            
        </View>
    )
}