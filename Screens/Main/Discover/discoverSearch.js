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

import {TopContainer, CancelContainer, SearchContainer, SearchResultContainer, SearchResultTitle,AutocompleteResultItems,
  LocationPrimaryText, LocationSecondaryText} from './discoverSearchStyle.js'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PRIMARYCOLOR, WIDTH, HEIGHT, IconPressable} from '../../../sharedUtils.js';
Ionicons.loadFont()

var axios = require('axios');


export default function DiscoverSearchScreen({navigation, route, open, close, selectCurrentLocation}){
  const [autocompleteLocation, setautocompleteLocation] = useState([])
  const [locationQuery, setLocationQuery] = useState("")

  function autocomplete(query){
    if(query == ""){
        setautocompleteLocation([])
    }
    setLocationQuery(query);
    
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

function leaveDiscoverSearch(){
  setautocompleteLocation([])
  close()
}

async function pressAutocompleteItem(value){
  setLocationQuery(value)
  setautocompleteLocation([])
  selectCurrentLocation(value)
  close()
}


  return(
    <Modal visible={open} animationType="slide">
    <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
     
      <TopContainer>
        <CancelContainer style={{justifyContent: 'flex-start'}}>
          <IconPressable hitSlop={WIDTH*0.025} onPress={leaveDiscoverSearch}>
            <Ionicons name='arrow-back-outline' size={25} />
          </IconPressable>
        </CancelContainer>
        <SearchContainer value={locationQuery} autoFocus placeholder="Search Location..." onChangeText={(value)=>autocomplete(value)}
        onSubmitEditing={()=>{autocompleteLocation.length != 0 &&  pressAutocompleteItem(autocompleteLocation[0].description) }}
        >

        </SearchContainer>
        <CancelContainer  style={{justifyContent: 'flex-end'}}>
        <Pressable hitSlop={WIDTH*0.025} onPress={()=>setLocationQuery("")}>
          <Ionicons name='close-circle'  color='black' size={25}/>
        </Pressable>
        </CancelContainer>
      </TopContainer>
      <SearchResultContainer>
        <SearchResultTitle>Search Result</SearchResultTitle>
        <View style={{marginTop: HEIGHT*0.025}}>
        {autocompleteLocation.length != 0 &&
                                
            autocompleteLocation.map((value, index)=>(
                // <View key={"autocomplete" + value.description + index} onPress={()=>{selectCurrentLocation(value.description), setFilteredProperties([])}}>
                <AutocompleteResultItems key={"autocomplete" + value.description + index} onPress={()=>pressAutocompleteItem(value.description)}>

                    <Ionicons name="navigate-circle-outline" size={25} color= {PRIMARYCOLOR} style={{width: WIDTH*0.1}}/>
                    <View>
                    <LocationPrimaryText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationPrimaryText>
                    <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                    </View>
                </AutocompleteResultItems>
            ))
        
        }
        </View>
      </SearchResultContainer>

    
     
    </SafeAreaView>
    </Modal>
  )
}