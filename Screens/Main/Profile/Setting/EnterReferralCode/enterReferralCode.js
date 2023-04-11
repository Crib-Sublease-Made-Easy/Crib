import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  TouchableOpacity,
  Alert,
  Text,
  View,
  Share,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../../sharedUtils';
import {Header, TitleText, MoneyBackText, CheckoutCribButton, CheckoutCribText, ReferralCodeInput, SubmitReferralCodeButton, SubmitButtonText, ReferralCodeHelperText} from './enterReferralCodeStyle.js'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';
export default function EnterReferralCodeScreen({navigation, route}){
    const [referralCode, setReferralCode] = useState("")
    const [codeSubmitted, setCodeSubmitted] = useState(false)

    async function SubmitReferralCode(){
      // console.log(referralCode)
      if(referralCode.length >=15 || referralCode.trim() ==  ""){
        alert("Invalid code")
        return
      }
      let at = await EncryptedStorage.getItem("accessToken");
      await fetch("https://crib-llc.herokuapp.com/users/referral/validate",{
        method: 'PUT',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at,
        },
        body: JSON.stringify({
          referralCode: referralCode
        })
      })
      .then((res) => {
        if (res.status == 200){
          Keyboard.dismiss()
          setCodeSubmitted(true)
        }
        else if(res.status == 401){
          alert("Cannot refer yourself.")
        }
        else{
          alert("Error. Invalid Referral Code!")
        }
      })
      .catch( e=> {
        alert("Error in sending code. Please try again later!")
        navigation.goBack()
      })
    }

    
    return(
        <View style={{height: HEIGHT, width: WIDTH, backgroundColor:'white'}}>
          <KeyboardAvoidingView behavior="position">
          
          <SafeAreaView style={{position:'relative'}}>
            
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                <Header>Referral code</Header>
                </EditPageNameContainer>
                <EditPageForwardButtonContainer/>
            </EditPagesHeaderContainer>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={{width:WIDTH, paddingTop:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05, paddingBottom: HEIGHT*0.05}}>
              
                <TitleText>Sublease <Text style={{color: PRIMARYCOLOR, fontWeight:'800'}}>Faster</Text> and <Text style={{color: PRIMARYCOLOR, fontWeight:'800'}}>Safer</Text> {'\n'}with Crib Connect</TitleText>
                {/* <Lottie source={require('../../../../../assets/cribenterreferralcode.json')} loop style={{width:WIDTH*0.8, height: WIDTH*0.6,alignSelf:'center'}}/> */}
              
                {/* <CheckoutCribButton onPress={()=>navigation.navigate("MyReferralCode",{userData: route.params.userData})}>
                  <CheckoutCribText>Checkout Crib Premium <Ionicons name="arrow-forward"/></CheckoutCribText>
                </CheckoutCribButton> */}
              
            </View>
            </TouchableWithoutFeedback>
           
           
            <View style={{paddingBottom: HEIGHT*0.05,}}>
              {codeSubmitted && <ReferralCodeHelperText>Code successfully sent!</ReferralCodeHelperText>}
              <ReferralCodeInput value={referralCode} onChangeText={(val)=>setReferralCode(val)}  placeholder="Enter referral code" />
              <SubmitReferralCodeButton onPress={SubmitReferralCode}>
                <SubmitButtonText>SUBMIT</SubmitButtonText>
              </SubmitReferralCodeButton>
              <SubmitReferralCodeButton style={{backgroundColor:'#cdab3e'}} onPress={()=>navigation.navigate("CribConnectTenant", {userData: route.params.userData})}>
                <SubmitButtonText>What is Crib Connect?</SubmitButtonText>
              </SubmitReferralCodeButton>
            </View>
            
          </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
    )
}