import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Pressable,
  Modal
} from 'react-native';

import {
TopContainer, 
CancelContainer, 
SearchContainer, 
SearchResultContainer, 
SearchResultTitle,
AutocompleteResultItems,
LocationPrimaryText, 
LocationSecondaryText
} from './discoverSearchStyle.js'

var axios = require('axios');

import Ionicons from 'react-native-vector-icons/Ionicons';

import EncryptedStorage from 'react-native-encrypted-storage';

import {PRIMARYCOLOR, WIDTH, HEIGHT, IconPressable, DARKGREY,} from '../../../sharedUtils.js';

export default function DiscoverSearchScreen({navigation, route, open, close, selectCurrentLocation}){
  const [autocompleteLocation, setautocompleteLocation] = useState([])
  const [locationQuery, setLocationQuery] = useState("")

  //Fucntion: Generates the autocomplete locations suggestions for users to press
  function autocomplete(query){
    // console.log(query)
    if(query == ""){
        setautocompleteLocation([])
    }
    setLocationQuery(query);
    
    var config = {
        method: 'get',
        url: `https://crib-llc.herokuapp.com/autocomplete/places/${query}`,
       
    };

    axios(config)
    .then(response => {
        setautocompleteLocation([]);           
        for( let name of response.data){
            setautocompleteLocation(prevArray => [...prevArray,name])   
        }        
    })
    .catch(function (error) {
        console.log("ERROR --- DISCOVERSEARCH --- AUTOCOMPLETE")
        console.log(error);
    });
  }

  //Function: Clear the autocomplete to improve performance and close the searchdiscover screen modal
  function leaveDiscoverSearch(){
    setautocompleteLocation([])
    close()
  }

  //Function: When user press autocomplete item 
  //1. Set the location query so it shows up on search bar
  //2. Clear the autocomplete location to imporve perf
  //3. Set the current location to retrive properties and pins
  //4. Close current screen and go back to discover page
  async function pressAutocompleteItem(value){
    try{
      await EncryptedStorage.setItem("lastSearchedLocation", value)
    }
    catch{
    }
    setLocationQuery(value)
    setautocompleteLocation([])
    selectCurrentLocation(value)
    close()
  }


  return(
    <Modal visible={open} animationType="slide">
      <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>

        {/* This includes the search bar, search query container and also go back and clear input button */}
        <TopContainer>
          {/* Close() */}
          <CancelContainer style={{justifyContent: 'flex-start'}}>
            <IconPressable  hitSlop={WIDTH*0.05} onPress={leaveDiscoverSearch}>
              <Ionicons name='arrow-back-outline' size={25} />
            </IconPressable>
          </CancelContainer>

          {/* Search Input that allows user to input query */}
          <SearchContainer placeholderTextColor={DARKGREY} value={locationQuery} autoFocus placeholder="Search Location ..." onChangeText={(value)=>autocomplete(value)}
          onSubmitEditing={()=>{autocompleteLocation.length != 0 &&  pressAutocompleteItem(autocompleteLocation[0].description) }}
          />

          {/* If user input is not empty then can clear with this button */}
          <CancelContainer  style={{justifyContent: 'flex-end'}}>
            {locationQuery.trim().length != 0 &&
            <Pressable  hitSlop={WIDTH*0.05}onPress={()=>setLocationQuery("")}>
              <Ionicons name='close-circle'  color='black' size={25}/>
            </Pressable>
            }
          </CancelContainer>
        </TopContainer>

        {/* Display search result section */}
        <SearchResultContainer>
          <SearchResultTitle>Search Result</SearchResultTitle>

          <View style={{marginTop: HEIGHT*0.025}}>
          {autocompleteLocation.length != 0 && autocompleteLocation.map((value, index)=>(
                  <AutocompleteResultItems key={"autocomplete" + value.description + index} onPress={()=>pressAutocompleteItem(value.description)}>

                      <Ionicons name="navigate-circle-outline" size={25} color= {PRIMARYCOLOR} style={{width: WIDTH*0.1}}/>
                      <View>
                        <LocationPrimaryText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationPrimaryText>
                        <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                      </View>
                  </AutocompleteResultItems>
          ))}
          </View>

        </SearchResultContainer>
      </SafeAreaView>
    </Modal>
  )
}