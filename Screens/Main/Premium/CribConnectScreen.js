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
  ActivityIndicator
} from 'react-native';
import Lottie from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../sharedUtils';
import {CribConnectMatchesContainer, CribConnectMatchesText, CribConnectNotifContentText, CribConnectNotifLogoView, CribConnectNotifNameText, CribConnectNotifView, CribPremiumPaidSubheaderText, CribPremiumSubheaderText, EstimatedSavingText, NumberBackground, NumberText, PreferenceLabel, PreferencesInput, ReferralCodeHelperText, SubmitButton, SubmitButtonOutline, SubmitText} from './CribConnectScreenStyle'




export default function CribConnectScreen({navigation}){
    
    const appState = useRef(AppState.currentState);

    const [userData, setUserData] = useState()
    const [subleaseArea, setSubleaseArea] = useState("your area")
    const [prefetchCribConnectInterestedNumber, setPrefetchCribConnectInterestedNumber] = useState("A lot of")
    const [cribPremium, setCribPremium] = useState(false)
    const [preference, setPreference] = useState("")
    const [estimatedSaving, setEstimatedSaving] = useState("")

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) 
            {
                
            }
            getTokens()
            appState.current = nextAppState;
        });
      
        return () => {
        subscription.remove();
        };


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


                let lastSetInterested = await EncryptedStorage.getItem("lastSetInterested")
                let curTime = new Date().getTime()
                if(userData.postedProperties != undefined && userData.postedProperties?.length != 0){
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

                            let diff = new Date(data.propertyInfo.availableTo).getTime() - new Date(data.propertyInfo.availableFrom).getTime();
                           
                            let months = diff/(1000*60*60*24*30)

                            let saving = Math.floor(months * data.propertyInfo.price)

                            setEstimatedSaving(saving)
                           
                            if(data.propertyInfo.preference != null){
                                setPreference(data.propertyInfo.preference)
                            }

                            
                            
                           
                           
                            // if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("madison") != -1){
                            //     setPrefetchCribConnectInterestedNumber("30+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         let randomNum = Math.floor(Math.random() * (25 -10) + 10)
                                  
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                            //     setSubleaseArea("Madison")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("chicago") != -1){
                            //     setPrefetchCribConnectInterestedNumber("473+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                                  
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                                
                            //     setSubleaseArea("Chicago")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("newyork") != -1){
                            //     setPrefetchCribConnectInterestedNumber("473+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                              
                            //     setSubleaseArea("New York")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("austin") != -1){
                            //     setPrefetchCribConnectInterestedNumber("473+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                            
                            //     setSubleaseArea("Austin")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("sanmarcos") != -1){
                            //     setPrefetchCribConnectInterestedNumber("236+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                                
                            //     setSubleaseArea("San Marcos")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("seattle") != -1){
                            //     setPrefetchCribConnectInterestedNumber("477+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                              
                            //     setSubleaseArea("Seattle")
                            // }
                            // else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("losangeles") != -1){
                            //     setPrefetchCribConnectInterestedNumber("565+");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                              
                            //     setSubleaseArea("LA")
                            // }
                            // else{
                            //     setPrefetchCribConnectInterestedNumber("Some");
                            //     if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                            //         //Allow set the number
                            //         EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                            //     }
                            //     setSubleaseArea(data.propertyInfo.loc.secondaryTxt)
                               
                            // }
                        }
                        
                    })
                    .catch(e=>{
                        console.log("Error")
                    })
                } 
                else{
                    setEstimatedSaving("")
                    setPrefetchCribConnectInterestedNumber("A lot of");
                    setSubleaseArea("your area")
                    if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                        //Allow set the number
                        EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                    }
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

        navigation.navigate("CribConnectPreference", {userData: userData, preference: preference})

        // if(userData.postedProperties.length == 0){
        //     alert("Post a property first!")
        //     navigation.navigate("Profile")
        // }
        // const accessToken = await EncryptedStorage.getItem("accessToken");
      

        //     if(accessToken != undefined){
        //         fetch('https://crib-llc.herokuapp.com/properties/' + userData.postedProperties[0], {
        //             method: 'PUT',
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + accessToken,
        //             },
        //             body: JSON.stringify({
        //                 preference: preference
                    
        //             })
        //         })
        //         .then(async res => {
        //             if(res.status == 200){
        //                 alert("Preference successfully updated!")
        //             }
        //             else{
        //                 alert("Error occured please try again later!")
        //             }
        //         })
        //         .catch(e => {
        //             console.log(e)
        //         })

        //     }
       
    }

    async function handleSubmitClick(){
        let at = await EncryptedStorage.getItem("accessToken")
        if(at == undefined){
            alert("Please login or sign up!")
            navigation.navigate("Profile")
            return
        }
        //Don't have a property posted
        if(userData != undefined && userData.postedProperties?.length == 0){
            navigation.navigate("PropertyPosting", {userData: userData})
            return
        }
        //Not a crib connect user yet
        else if(!cribPremium){
            let uid = await EncryptedStorage.getItem("userId")
            if(userData.cribConnectEnrolled == false){
                //Change enroll to true
                await fetch("https://crib-llc.herokuapp.com/users/enrollCribConnect",{
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: uid
                    })
                })
                .then(async res => {
                    if(res.status == 200){
                        alert("You've enrolled for Crib Connect! \nWe will message you soon.")
                        getTokens()
                    }
                    else{
                        alert("Error occurs while enrolling. Please try again later!")
                        return
                    }
                })
            }
            navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})

        } 
        //Is a Crib Connect user
        else{
            updatePreference()
        }
    }

    async function checkIfPaid(user){
        let at = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")
        if(user?.cribPremium?.paymentDetails?.orderId == undefined){
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
            if(res.status == 200){
                let data = await res.json();
                if(data.order.state == "OPEN"){
                    setCribPremium(true)
                }
            }
        })
        .catch(e=>{
            console.log("ERROR  ", e)
        })
      
    }

    return(
        <View style={{height: HEIGHT, width:WIDTH, backgroundColor:'white', flex:1, position:'relative', paddingTop: HEIGHT*0.075}}>
            <SafeAreaView style={{flex: 1}}>
               
                    
                    
                    {/* {!cribPremium ? */}
                    
                    <CribPremiumSubheaderText>
                        <Text style={{color:PRIMARYCOLOR, fontWeight:'700'}}>Crib Connect</Text> does {'\n'}all the work for you
                    </CribPremiumSubheaderText>


                    <Lottie source={require('../../../assets/cribtenantsubscription.json')} autoPlay loop style={{width: WIDTH*0.8,alignSelf:'center',}}/>
                    {cribPremium || (userData != undefined && userData.cribConnectEnrolled) ?
                        <></>
                        :
                        estimatedSaving != "" ?

                        <EstimatedSavingText style={{marginTop: HEIGHT*0.035}}>Don't risk paying{'\n'}<Text style={{fontSize:HEIGHT*0.07, fontWeight:'600'}}>${estimatedSaving}</Text> {'\n'}<Text style={{fontSize:HEIGHT*0.0175}}>when you’re not there.</Text></EstimatedSavingText>
                        :
                        <EstimatedSavingText style={{marginTop: HEIGHT*0.035}}>Save thousands in 30 seconds</EstimatedSavingText>
                    }

                    {/* <View style={{flexDirection:'row', width: WIDTH*0.9, alignSelf:'center', marginTop: HEIGHT*0.025, alignContent:'center', }}>
                        // <Lottie source={require('../../../assets/cribconnectfire.json')} autoPlay loop style={{width: WIDTH*0.15,alignSelf:'center',}}/>
                      
                        <View style={{paddingLeft: WIDTH*0.025, alignSelf:'flex-end'}}>
                            <NumberText >
                                <Text style={{fontWeight:'800', color:'#cdab3e'}}>{prefetchCribConnectInterestedNumber}</Text> people are looking for {'\n'}subleases in {subleaseArea} daily!
                            </NumberText>
                        </View>
                    </View>      */}
                    {/* <View style={{paddingVertical: HEIGHT*0.025, marginTop: HEIGHT*0.025}}>
                       
                       
                        <CribConnectNotifView style={{marginTop: HEIGHT*0.02}}>
                            <CribConnectNotifLogoView>
                                <Ionicons name="person" color={'white'} size={HEIGHT*0.03}/>
                            </CribConnectNotifLogoView>
                            <View style={{height: HEIGHT*0.06, justifyContent:'center', paddingLeft: WIDTH*0.02, alignContent:'center', alignItems:'center'}}>
                                <CribConnectNotifNameText><Text style={{fontSize: HEIGHT*0.0225, color: PRIMARYCOLOR, fontWeight:'800'}}>{prefetchCribConnectInterestedNumber}</Text> people are looking for {'\n'}subleases in your area daily</CribConnectNotifNameText>
                            </View>
                        </CribConnectNotifView> 
                        <CribConnectNotifView style={{marginTop: HEIGHT*0.02}}>
                            <CribConnectNotifLogoView>
                                <Ionicons name="scan-circle" color={'white'} size={HEIGHT*0.03}/>
                            </CribConnectNotifLogoView>
                            <View style={{height: HEIGHT*0.06, justifyContent:'center', paddingLeft: WIDTH*0.02, alignContent:'center', alignItems:'center'}}>
                                {userData == undefined || userData?.postedProperties?.length == 0 ? 
                                <CribConnectNotifNameText >Post your room to see how many {'\n'}people are searching for similar ones!</CribConnectNotifNameText>
                                :
                                <CribConnectNotifNameText >Your sublease matches <Text style={{fontSize: HEIGHT*0.0225, textAlign:'left', color: PRIMARYCOLOR, fontWeight:'800'}}>{interestedSubtenant}</Text> {'\n'}users' search results</CribConnectNotifNameText>
                                }
                            </View>
                        </CribConnectNotifView>   
                    </View>      */}
                    {/* {userData == undefined || userData?.postedProperties?.length == 0 ?
                    <EstimatedSavingText>Estimated savings: Post a sublease first</EstimatedSavingText>
                    :
                    <EstimatedSavingText>Estimated savings: <Text style={{fontSize:HEIGHT*0.025, color: 'black', textDecorationLine:'underline', textDecorationColor:PRIMARYCOLOR}}>${estimatedSaving}</Text></EstimatedSavingText>
                    } */}
                    {/* <ReferralCodeHelperText style={{marginTop: HEIGHT*0.1}}>Get Crib Connect to automatically match {'\n'}with interested and reliable subtenants </ReferralCodeHelperText> */}

              
           
            <View style={{position:'absolute', bottom:HEIGHT*0.05, alignSelf:'center'}}>
            {userData != undefined && userData.cribConnectSubtenants != undefined  && userData.cribConnectEnrolled &&
                <CribConnectMatchesContainer onPress={()=> navigation.navigate("CribConnectSubtenantMatches", {subtenantMatches: userData.cribConnectSubtenants, paidUser: cribPremium, userData: userData})}>
                    <Lottie source={require("../../../assets/cribconnectfire.json")} autoPlay loop style={{height:HEIGHT*0.04}}/>
                    <CribConnectMatchesText>{userData.cribConnectSubtenants.length == 0 ? "" : userData.cribConnectSubtenants.length} {userData.cribConnectSubtenants.length == 0 ? "Finding a subtenant ..." : "subtenant matches"}</CribConnectMatchesText>
                    <Ionicons name={'arrow-forward'} color={PRIMARYCOLOR} size={HEIGHT*0.02} style={{opacity: userData.cribConnectSubtenants.length == 0 ? 0 : 1}}/>
                </CribConnectMatchesContainer>
            }
                {/* <SubmitButtonOutline  onPress={()=>{!cribPremium ? navigation.navigate("CribConnectSubtenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea}) : updatePreference()}}>
                    
                    <SubmitText style={{color: PRIMARYCOLOR}} >Find a sublease</SubmitText>           
                    
                </SubmitButtonOutline> */}

                <SubmitButton onPress={handleSubmitClick}>
                    
                    <SubmitText >{cribPremium ? "Edit my preference" : (userData == undefined || userData?.postedProperties?.length == 0) ? "Post my sublease" : (userData != undefined && !userData.cribConnectEnrolled) ? "ENROLL FOR FREE" : "CHECK OUT CRIB CONNECT"}</SubmitText>           
                    
                </SubmitButton>
            </View>
            
            </SafeAreaView>
        </View>
    )
}