import React from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable} from 'react-native'
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';


import { WIDTH, HEIGHT, PRIMARYCOLOR, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, EditPageForwardButtonContainer, EditPage } from "../../../sharedUtils";
import { SafeAreaView } from 'react-native-safe-area-context';

const ModalView = styled.View`
    width: ${WIDTH}px
    height: ${HEIGHT}px;
    background-color: white
    border-radius: 15px
    shadow-offset: 0 0
    shadow-color: black;
    shadow-radius: 20px;
    shadow-opacity: 0.3;
    elevation: 5
    padding-vertical: ${HEIGHT*0.02}px
    flex-direction: column
    position: relative
`

const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 700;
    color: black
`

const PriceText = styled.Text`
    font-size: ${HEIGHT*0.03}px
    margin-top: ${HEIGHT*0.05}px
    align-self: center
`
const ProText = styled.Text`
    width: ${WIDTH*0.75}px
    margin-left: ${WIDTH*0.025}px
`

const ProContainer = styled.View`
    flex-direction: row
    align-self: center
    align-items: center
    justify-content: center
`

const MoneyBackText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    align-self: center
    margin-top: ${HEIGHT*0.05}px
`

const TryNowContainer = styled.View`
    position: absolute
    bottom: ${HEIGHT*0.075}px
    align-self: center
    justify-content: center
   
`
const TryNowButton = styled.Pressable`
    width: ${WIDTH*0.8}px
    padding-vertical: ${HEIGHT*0.02}px
    background-color: ${PRIMARYCOLOR}
    justify-content: center
    align-items: center
    border-radius: 15px
`
const TryNowText = styled.Text`
    color: white
    font-size: ${HEIGHT*0.02}px
    font-weight: 600
    
`

export default function CribTenantSubscriptionModal({close, cribtenantSubscriptionModalVisible}){
    async function closeSubscriptionModal(){
        console.log("closins")
        close()
    }
    return(
        <Modal animationInTiming={400}  backdropOpacity={0.5} isVisible={cribtenantSubscriptionModalVisible} style={{flex: 1, display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'white'}} onBackdropPress={close}>
           
                
            <ModalView>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0, paddingTop: HEIGHT*0.05}}>
                    <EditPageBackButtonContainer>
                    <Pressable  onPress={closeSubscriptionModal}>
                        <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header>Crib Premium</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                

                <Lottie source={require('../../../assets/cribtenantsubscription.json')} loop style={{width:WIDTH, height: WIDTH*0.8,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>

                <PriceText>only <Text style={{fontWeight:'600', fontSize: HEIGHT*0.035}}>$1</Text></PriceText>
                <View style={{marginTop:HEIGHT*0.05, alignItems:'center',}}>
                    <ProContainer>
                        <Ionicons name='checkmark-done-outline' size={25} color='#545454'/>
                        <ProText>Get list of interested subtenants weekly</ProText>
                    </ProContainer>
                </View>
                <View style={{marginTop:HEIGHT*0.01, alignItems:'center',}}>
                    <ProContainer>
                        <Ionicons name='checkmark-done-outline' size={25} color='#545454'/>
                        <ProText>Professional advice for your sublease posting</ProText>
                    </ProContainer>
                </View>

                <MoneyBackText><Text style={{textDecorationLine:'underline'}}>Money back</Text> when you refer two friends!</MoneyBackText>

                <TryNowContainer>
                    <TryNowButton>
                        <TryNowText>TRY NOW</TryNowText>
                    </TryNowButton>                    
                </TryNowContainer>
                
               
        
            </ModalView>
                
            
        </Modal>
    )
}