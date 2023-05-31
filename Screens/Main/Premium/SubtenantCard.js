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
  Pressable,
} from 'react-native';
import styled from 'styled-components/native';
import { WIDTH, HEIGHT, DARKGREY, PRIMARYCOLOR } from '../../../sharedUtils';


const CardContainer = styled.View`
    padding: 15px
    width: ${WIDTH*0.9}px
    background-color: white
    border-radius: 10px
    padding-vertical: ${HEIGHT*0.02}px
    shadow-offset: 0 5px
    shadow-color: ${DARKGREY};
    shadow-radius: 10px;
    shadow-opacity: 0.25;
    elevation: 10
    margin-top: ${HEIGHT*0.025}px
`
const NameText = styled.Text`
    

`

const MessageButton = styled.View`
    width: ${WIDTH*0.25}px
    padding-vertical: ${HEIGHT*0.005}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 5px
    justify-content: center
    align-items: center
`

const ContinueBallsView = styled.View`
    width: 20px
    height: 20px
    border-radis: 10px
    background-color: red
`


export default function SubtenantCard(props){
    let subtenant = props.data;
    return(
        <CardContainer>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <>
                    <NameText style={{color: PRIMARYCOLOR, fontWeight: '600'}}>{subtenant.name}</NameText>
                    <NameText style={{marginLeft: WIDTH*0.04}}>{subtenant.gender}</NameText>
                    <NameText style={{marginLeft: WIDTH*0.04}}>{subtenant.age}</NameText>
                </>
            </View>
            <View style={{marginTop: HEIGHT*0.015}}>
                <NameText style={{fontWeight: '600'}}>Requested dates: <Text style={{fontWeight:'400'}}>{new Date(subtenant.subleaseStart).toLocaleString().split(",")[0]} - {new Date(subtenant.subleaseEnd).toLocaleString().split(",")[0]}</Text></NameText>
            </View>
            <View style={{marginTop: HEIGHT*0.015, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <NameText style={{fontWeight: '600'}}>Budget: <Text style={{fontWeight:'400'}}>${subtenant.budget}</Text></NameText>
                <MessageButton>
                <NameText style={{color:'white', fontWeight:'500'}}>Message</NameText>
            </MessageButton>
            </View>        
        </CardContainer>
        
    )
}