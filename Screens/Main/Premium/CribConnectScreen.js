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
import { UserContext } from '../../../UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../sharedUtils';
import {CribConnectNotifContentText, CribConnectNotifLogoView, CribConnectNotifNameText, CribConnectNotifView, CribPremiumPaidSubheaderText, CribPremiumSubheaderText, EstimatedSavingText, NumberBackground, NumberText, PreferenceLabel, PreferencesInput, ReferralCodeHelperText, SubmitButton, SubmitButtonOutline, SubmitText} from './CribConnectScreenStyle'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';




export default function CribConnectScreen({navigation}){
    const appState = useRef(AppState.currentState);

    const [userData, setUserData] = useState()
    const [subleaseArea, setSubleaseArea] = useState("your area")
    const [prefetchCribConnectInterestedNumber, setPrefetchCribConnectInterestedNumber] = useState("A lot of")
    const [cribPremium, setCribPremium] = useState(false)
    const [preference, setPreference] = useState("")
    const [numberOfViews, setNumberOfViews] = useState(2)
    const [interestedSubtenant, setInterestedSubtenant] = useState("44")
    const [estimatedSaving, setEstimatedSaving] = useState("Post a sublease first")



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
        console.log(accessToken)
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

                           
                            setNumberOfViews(data.propertyInfo.numberOfViews)

                            let diff = new Date(data.propertyInfo.availableTo).getTime() - new Date(data.propertyInfo.availableFrom).getTime();
                           
                            let months = diff/(1000*60*60*24*30)

                            let saving = Math.floor(months * data.propertyInfo.price)

                            setEstimatedSaving(saving)
                           
                            if(data.propertyInfo.preference != null){
                                setPreference(data.propertyInfo.preference)
                            }

                            
                            
                           
                           
                            if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("madison") != -1){
                                setPrefetchCribConnectInterestedNumber("30+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (25 -10) + 10)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                                setSubleaseArea("Madison")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("chicago") != -1){
                                setPrefetchCribConnectInterestedNumber("473+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (350 - 170) + 170)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                                
                                setSubleaseArea("Chicago")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("newyork") != -1){
                                setPrefetchCribConnectInterestedNumber("473+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (350 - 170) + 170)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                              
                                setSubleaseArea("New York")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("austin") != -1){
                                setPrefetchCribConnectInterestedNumber("473+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (300 - 120) + 120)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                            
                                setSubleaseArea("Austin")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("sanmarcos") != -1){
                                setPrefetchCribConnectInterestedNumber("236+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (150 - 70) + 70)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                                
                                setSubleaseArea("San Marcos")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("seattle") != -1){
                                setPrefetchCribConnectInterestedNumber("477+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (300 - 100) + 100)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                              
                                setSubleaseArea("Seattle")
                            }
                            else if(data.propertyInfo.loc.secondaryTxt.toLowerCase().replaceAll(" ","").indexOf("losangeles") != -1){
                                setPrefetchCribConnectInterestedNumber("565+");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (400 - 300) + 300)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
                              
                                setSubleaseArea("LA")
                            }
                            else{
                                setPrefetchCribConnectInterestedNumber("Some");
                                if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                                    //Allow set the number
                                    let randomNum = Math.floor(Math.random() * (50 - 20) + 20)
                                    setInterestedSubtenant(randomNum)
                                    EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                                }
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
                    if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                        //Allow set the number
                        let randomNum = Math.floor(Math.random() * (150 - 70) + 70)
                        setInterestedSubtenant(randomNum)
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
        else if(userData != undefined && userData.postedProperties?.length == 0){
            navigation.navigate("PropertyPosting", {userData: userData})
        }
        else if(userData != undefined && cribPremium && userData.postedProperties?.length == 0){
            navigation.navigate("PropertyPosting", {userData: userData})
            return
        }
        else if(!cribPremium){
            navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})
        } 
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
                <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                    
                    
                    {/* {!cribPremium ? */}
                    
                    <CribPremiumSubheaderText>
                        <Text style={{color:PRIMARYCOLOR, fontWeight:'700'}}>Crib Connect</Text> does {'\n'}all the work for you
                    </CribPremiumSubheaderText>



                    <View style={{flexDirection:'row', width: WIDTH*0.9, alignSelf:'center', marginTop: HEIGHT*0.025, alignContent:'center', }}>
                        <Lottie source={require('../../../assets/cribconnectfire.json')} autoPlay loop style={{width: WIDTH*0.15,alignSelf:'center',}}/>
                        {/* <NumberBackground> */}
                            {/* <NumberText style={{color:'black', alignSelf:'center'}}>
                                134+
                            </NumberText> */}
                        {/* </NumberBackground> */}
                        <View style={{paddingLeft: WIDTH*0.025, alignSelf:'flex-end'}}>
                            <NumberText >
                                <Text style={{fontWeight:'800', color:'#cdab3e'}}>{prefetchCribConnectInterestedNumber}</Text> people are looking for {'\n'}subleases in {subleaseArea} daily!
                            </NumberText>
                        </View>
                    </View>     
                    <View style={{paddingVertical: HEIGHT*0.025, marginTop: HEIGHT*0.025}}>
                       
                       
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
                    </View>     
                    {userData == undefined || userData?.postedProperties?.length == 0 ?
                    <EstimatedSavingText>Estimated savings: Post a sublease first</EstimatedSavingText>
                    :
                    <EstimatedSavingText>Estimated savings: <Text style={{fontSize:HEIGHT*0.025, color: 'black', textDecorationLine:'underline', textDecorationColor:PRIMARYCOLOR}}>${estimatedSaving}</Text></EstimatedSavingText>
                    }
                    <ReferralCodeHelperText style={{marginTop: HEIGHT*0.1}}>Get Crib Connect to automatically match {'\n'}with interested and reliable subtenants </ReferralCodeHelperText>

                </TouchableWithoutFeedback>
           
            <View style={{marginTop: HEIGHT*0.03}}>
                {/* <SubmitButtonOutline  onPress={()=>{!cribPremium ? navigation.navigate("CribConnectSubtenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea}) : updatePreference()}}>
                    
                    <SubmitText style={{color: PRIMARYCOLOR}} >Find a sublease</SubmitText>           
                    
                </SubmitButtonOutline> */}

                <SubmitButton onPress={handleSubmitClick}>
                    
                    <SubmitText >{cribPremium ? "Edit my preference" : (userData == undefined || userData?.postedProperties?.length == 0) ? "Post my subleases" : "Check out Crib Connect"}</SubmitText>           
                    
                </SubmitButton>
            </View>
            
            </SafeAreaView>
        </View>
    )
}