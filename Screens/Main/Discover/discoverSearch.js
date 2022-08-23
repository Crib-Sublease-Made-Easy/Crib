import React, {useState, useEffect, useRef, useMemo, useCallback, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
  Keyboard,
  Animated,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Modal
} from 'react-native';

import {TopContainer, CancelContainer, SearchContainer, SearchResultContainer, SearchResultTitle} from './discoverSearchStyle.js'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DARKGREY, MEDIUMGREY } from '../../../sharedUtils.js';
Ionicons.loadFont()


export default function DiscoverSearchScreen({navigation, route, open, close}){
  const [autocompleteLocation, setautocompleteLocation] = useState([])
  const [locationQuery, setLocationQuery] = useState("")

  function autocomplete(query){
    if(query == ""){
        setautocompleteLocation([])
    }
    setlocationQuery(query);
    
    var config = {
        method: 'get',
        url: `https://sublease-app.herokuapp.com/autocomplete/places/${query}`,
    };
    axios(config)
    .then(response => {
        setautocompleteLocation([]);           
        for( let name of response.data){
            setautocompleteLocation(prevArray => [...prevArray,name])   
        }        
    })
    .catch(function (error) {
        console.log(error);
    });
}


  return(
    <Modal visible={open} animationType="slide">
    <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
     
      <TopContainer>
        <CancelContainer style={{justifyContent: 'flex-start'}}>
          <Pressable onPress={close}>
            <Ionicons name='arrow-back-outline' size={25} />
          </Pressable>
        </CancelContainer>
        <SearchContainer autoFocus placeholder="Search Location..." onChangeText={(value)=>setLocationQuery(value)}>

        </SearchContainer>
        <CancelContainer  style={{justifyContent: 'flex-end'}}>
        <Pressable onPress={()=> navigation.goBack()}>
          <Ionicons name='close-circle'  color='black' size={25}/>
        </Pressable>
        </CancelContainer>
      </TopContainer>
      <SearchResultContainer>
        <SearchResultTitle>Search Result</SearchResultTitle>
        {/* {autocompleteLocation.length != 0 &&
                                
            autocompleteLocation.map((value, index)=>(
                <AutocompleteLocationContainer searching={searching} key={"autocomplete" + value.description + index} onPress={()=>{selectCurrentLocation(value.description), setFilteredProperties([])}}>
                    <Ionicons name="navigate-circle-outline" size={23} color= {PRIMARYCOLOR} style={{width: WIDTH*0.07}}/>
                    <View>
                    <LocationMainText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationMainText>
                    <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                    </View>
                </AutocompleteLocationContainer>
            ))
        
        } */}
      </SearchResultContainer>

    
     
    </SafeAreaView>
    </Modal>
  )
}