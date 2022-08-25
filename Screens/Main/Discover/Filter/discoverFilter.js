import React, {useEffect, useState, useRef}  from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Pressable,
  Animated,
  Modal
} from 'react-native';

const PROPERTIESTYPES = 
[{type: "Room", icon:'bed'},
  {type: "House", icon:'home'}, 
  {type: "Apartment", icon: 'building'}, 
  {type:"Studio", icon :'user'}
];

const BEDROOMTYPES = ["Studio","1" ,"2", "3", "4P"];
const BATHROOMTYPES = ["1", "2", "3", "4P"];


const PRIMARYGREY = '#5e5d5d'

import { MEDIUMGREY,HEIGHT, WIDTH, DARKGREY, amenitiesList, GetAmenitiesIcon, GetFAIcons, GetFAIconsInBlack, PRIMARYCOLOR } from '../../../../sharedUtils';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import Slider from '@react-native-community/slider';


import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import DatePicker from 'react-native-date-picker'


import { Container, HeaderContainer, BackButtonContainer,NameContainer, ResetButtonContainer, Header, ModalStyle,
        InputForm,InputSection, InputName,InputNameContainer, InputOptionContainer, InputPressableContainer,
        InputPriceRangeContainer, PriceRangeText, PriceInputSection, AmenitiesInputSection, AmenitiesList,
        InputSectionCol, BedBathNumberText, TypeOption, TypeContainer, PropertyTypeName, BedroomOptions,
        BedroomOptionsText, AmenitiesContainer, NameIcon, DateInputPressable, Footer, ResetText, ApplyButton, 
    ApplyText} from './discoverFilterStyle';

export default function DiscoverFilterScreen({navigation, currentLocation, open, close, setFilteredProperties, setPropertyPage, setrieverieveMore,retrieveAllPins
    ,filterType, setfilterType, filterDistance, setfilterDistance, filterBedroom, setfilterBedroom,filterBathroom, setfilterBathroom
    ,filterPriceHigher, setfilterPriceHigher, filterAmenities, setfilterAmenities, propertyAmenities, setpropertyAmenities, setRetrieveMore,
    filterPreviewValue, setfilterPreviewValue, filterPreviewDistanceValue, setfilterPreviewDistanceValue, filterAvailableFrom, setfilterAvailableFrom,
    filterAvailableTo, setfilterAvailableTo, loadProperty
}){
    const [containerModal, setcontainerModal] = useState(false);
    const [scrollEnabled, setscrollEnabled] = useState(true)
    const [reset, setReset] = useState(false)

    

    //Sets DatePicker Modal Visibility
    
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    

    function updateAmenities(name) {

        if (filterAmenities.indexOf(name) != -1) {
            console.log("deleting")
            let tempindex = filterAmenities.indexOf(name);
            setfilterAmenities([...filterAmenities.slice(0, tempindex), ...filterAmenities.slice(tempindex + 1, filterAmenities.length)])
        }
        else {
            console.log("adding")
            setfilterAmenities(prev => [...prev, name]);
        }
    }

    function resetFilter(){
        console.log("resettin")
        setfilterType("")
        setfilterPriceHigher(10000)
        setfilterAvailableFrom(new Date())
        setfilterAvailableTo(new Date(1759176355615))
        setfilterPreviewDistanceValue(150)
        setfilterPreviewValue(10000)
        setfilterAmenities([])
        setfilterBathroom("")
        setfilterBedroom("")
        setfilterDistance(150)
        setReset(true)
        
    }
   
    useEffect(()=>{
       setcontainerModal(true)
    },[])

    function filter(){
        setPropertyPage(1)
        setRetrieveMore(true)
    let s = "";
    if(filterType != ""){
        s = s + "&type=" + filterType;
    }
    // if(filterSort != ""){
    //     s = s + "&type=" + filterSort;
    // }
    if(filterDistance != ""){
        s = s + "&maxDistance=" + parseInt(filterDistance);
    }
    if(filterBedroom != ""){
        s = s + "&bed=" + filterBedroom;
    }
    if(filterBathroom != ""){
        s = s + "&bath=" + filterBathroom;
    }
    for(let amen of filterAmenities){
        s = s + "&" + amen + "=true";
    }
    s = s +`&availableFrom=${filterAvailableFrom.getTime()}`
    s = s +`&availableTo=${filterAvailableTo.getTime()}`
    s = s + `&latitude=${currentLocation[0]}`
    s = s + `&longitude=${currentLocation[1]}`
    s = s + `&priceHigh=${filterPriceHigher}`
    s = s + '&priceLow=0'
   

    fetch('https://sublease-app.herokuapp.com/properties/query?page=0' + s, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then(properties =>{
            console.log("filtered properties is:")
            if(properties.propertiesFound != 'none'){
                setFilteredProperties([...properties])
            } else{
                setFilteredProperties([])
            }
          
            close()
        })
        .catch(e=>{
            alert(e)
    })
    retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities,new Date(filterAvailableFrom).getTime(), new Date(filterAvailableTo).getTime() )
    }

    async function checkResetAndBack(){
        console.log(reset)
        console.log("closing")
        if(reset){
            setReset(false)
            retrieveAllPins(currentLocation[0], currentLocation[1], 150, 10000, "", "", "", [],new Date().getTime(), 1759176355615)
            loadProperty()
        }
        close()
    }

    return(
       
        <Modal visible={open} animationType='slide'>
        <SafeAreaView style={{flex: 1}}>
            <Animated.View>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.02} style={{height:'50%', width:'50%', alignItems:'center'}} onPress={checkResetAndBack}>
                        <Ionicons name='arrow-back-outline' size={25} />
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Filter</Header>
                </NameContainer>
                {/* <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={filter}>
                        <Ionicons name='checkmark-outline' size={25} />
                    </Pressable>
                </ResetButtonContainer> */}
            </HeaderContainer>
            <ScrollView style={{height:HEIGHT*0.75}}showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
            <InputForm>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Type</InputName>
                    </InputNameContainer>
                    <TypeContainer>
                    {PROPERTIESTYPES.map((value)=>(
                        <TypeOption key={value.type + value.icon} >
                            <NameIcon onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                                <FontAwesome name={value.icon} size={20} />
                                <PropertyTypeName>{value.type}</PropertyTypeName>
                            </NameIcon>
                            <Pressable onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                            <Ionicons name='checkbox' size={25} color={value.type == filterType ? PRIMARYCOLOR : MEDIUMGREY}/>
                        </Pressable>
                        </TypeOption>
                    ))}
                    
                    </TypeContainer>
                </InputSectionCol>
        
                
                <PriceInputSection>
                    <InputSection style={{borderBottomWidth: 0}}>
                        <InputNameContainer>
                                <InputName>Max Budget</InputName>
                        </InputNameContainer>
                        <InputPriceRangeContainer>
                                <PriceRangeText>${filterPreviewValue} / month</PriceRangeText>
                        </InputPriceRangeContainer>
                    </InputSection>
                    <View style={{alignItems:'center'}}>
                    {/* <MultiSlider
                    isMarkersSeparated={true}
                    enabledTwo={false}
                    values={[filterPriceHigher]}
                    onValueChangeStart={()=> setscrollEnabled(false)}
                    onValueChangeFinish={()=> setscrollEnabled(true)}
                    onValueChange={(value)=> setfilterPriceHigher(value)}
                    min={0}
                    max={10000}
                    
                    step={10}
                    
                    
                    selectedStyle={{
                        backgroundColor: PRIMARYCOLOR
                    }}
                    containerStyle={{
                        width:WIDTH,
                        alignItems:'center'
                    }}
                    sliderLength={WIDTH*0.8}
                
                    /> */}
                    <Slider
                        style={{width: WIDTH*0.8, height: HEIGHT*0.1}}
                        value={filterPriceHigher}
                        onValueChange={(value)=> setfilterPreviewValue(value)}
                        onValuesChangeStart={()=> setscrollEnabled(false)}
                        onValuesChangeFinish={()=> setscrollEnabled(true)}
                        onSlidingComplete={(value)=> setfilterPriceHigher(value)}
                        minimumValue={0}
                        maximumValue={10000}
                        step={100}
                        minimumTrackTintColor={PRIMARYCOLOR}
                        maximumTrackTintColor={MEDIUMGREY}
                    />
                    </View>
                </PriceInputSection>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Available From</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenFrom(true)}>
                        <PropertyTypeName>{filterAvailableFrom.toDateString()}</PropertyTypeName>
                    </DateInputPressable>
                    <InputNameContainer>
                        <InputName>Available To</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenTo(true)}>
                        <PropertyTypeName>{filterAvailableTo.toDateString()}</PropertyTypeName>
                    </DateInputPressable>
                    <DatePicker
                        
                        modal
                        mode='date'
                        open={openFrom}
                        date={filterAvailableFrom}
                        onConfirm={(date) => {
                            if(date.getTime() < new Date().getTime()){
                                alert("Invalid Available From Date")
                            }
                            else if(date.getTime() >= filterAvailableTo.getTime()){
                                alert("Cannot set date to after Available From date.")
                            }
                            else{
                                setfilterAvailableFrom(date)
                            }
                            setOpenFrom(false)
                            
                        }}
                        onCancel={() => {
                            setOpenFrom(false)
                        }}
                    />
                    <DatePicker
                        
                        modal
                        mode='date'
                        open={openTo}
                        date={filterAvailableTo}
                        onConfirm={(date) => {
                            if(date.getTime() < new Date().getTime()){
                                alert("Cannot set Available To before today")
                            }
                            else if(date.getTime() <= filterAvailableFrom.getTime()){
                                alert("Cannot set Available To on or before Available From date")
                            }
                            else if(date.getTime() >= 1759176355615){
                                alert("Date Selected is too far ahead, please select a closer date.") 
                            }
                            else{
                                setfilterAvailableTo(date)
                            }    
                            setOpenTo(false)            
                        }}
                        onCancel={() => {
                            setOpenTo(false)
                        }}
                    />
                </InputSectionCol>
                <PriceInputSection>
                    <InputSection style={{borderBottomWidth: 0}}>
                        <InputNameContainer>
                                <InputName>Max Distance</InputName>
                        </InputNameContainer>
                        <InputPriceRangeContainer>
                                <PriceRangeText>{filterPreviewDistanceValue} miles</PriceRangeText>
                        </InputPriceRangeContainer>
                    </InputSection>
                    <View style={{alignItems:'center'}}>
                    {/* <MultiSlider
                    isMarkersSeparated={true}
                    enabledTwo={false}
                    values={[filterDistance]}
                    onValuesChangeStart={()=> setscrollEnabled(false)}
                    onValuesChangeFinish={()=> setscrollEnabled(true)}
                    onValuesChange={(value)=> setfilterDistance(value)}
                    min={1}
                    max={150}
                    
                    step={1}
                    enabledOne={true}
                    
                    selectedStyle={{
                        backgroundColor: PRIMARYCOLOR
                    }}
                    containerStyle={{
                        width:WIDTH,
                        alignItems:'center'
                    }}
                    sliderLength={WIDTH*0.8}
                
                    /> */}
                    <Slider
                        style={{width: WIDTH*0.8, height: HEIGHT*0.1}}
                        value={filterPreviewDistanceValue}
                        onValueChange={(value)=> setfilterPreviewDistanceValue(value)}
                        onValuesChangeStart={()=> setscrollEnabled(false)}
                        onValuesChangeFinish={()=> setscrollEnabled(true)}
                        onSlidingComplete={(value)=> setfilterDistance(value)}
                        minimumValue={0}
                        maximumValue={150}
                        step={5}
                        minimumTrackTintColor={PRIMARYCOLOR}
                        maximumTrackTintColor={MEDIUMGREY}
                    />
                    </View>
                </PriceInputSection>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Bedrooms</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                    {BEDROOMTYPES.map((value, index)=>(
                        
                            
                        <BedroomOptions  key={"bedroomOption" + value  + index} onPress={()=> value == filterBedroom ? setfilterBedroom("") : setfilterBedroom(value)} inputValue={filterBedroom} value={value}>   
                            <BedroomOptionsText value={value} inputValue={filterBedroom}>{value.replace("P","+")}</BedroomOptionsText>
                        </BedroomOptions>
                       
                    ))}
                    </InputOptionContainer>
                </InputSectionCol>

                {/* Bathroom Section */}
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Bathrooms</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                    {BATHROOMTYPES.map((value, index)=>(
                        
                            
                        <BedroomOptions key={"bathroomOption" + value + index} onPress={()=> value == filterBathroom ? setfilterBathroom("") : setfilterBathroom(value)} inputValue={filterBathroom} value={value}>   
                            <BedroomOptionsText value={value} inputValue={filterBathroom}>{value.replace("P","+")}</BedroomOptionsText>
                        </BedroomOptions>
                       
                    ))}
                    </InputOptionContainer>
                </InputSectionCol>

                <InputSectionCol style={{flexDirection:'column', borderBottomWidth: 0}}>
                    
                    <InputNameContainer>
                        <InputName>Amenities</InputName>
                    </InputNameContainer>
                    
                   
                        <AmenitiesContainer>
                            {/* {amenitiesList.map((value, index) => (
                                <View key={value.name + index + 'view'} style={{
                                    minWidth: WIDTH * 0.35, width: value.name.length * 0.03 * WIDTH, height: HEIGHT * 0.0575, justifyContent: 'center',
                                    paddingRight: WIDTH * 0.03
                                }}>
                                    <Pressable key={value.name + 'pressable'} onPress={() => updateAmenities(value.name)} style={{
                                        borderWidth: 3, borderColor: propertyAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT * 0.045,
                                        borderRadius: 20, justifyContent: 'center', backgroundColor: value.color, flexDirection: 'row', alignItems: 'center'
                                    }}>
                                        <Text key={value.name + 'text'} style={{ justifyContent: 'center', color: 'white' }}>
                                            <Ionicons name={value.icon} size={15} />
                                            {"   "}{value.name}
                                        </Text>
                                    </Pressable>

                                </View>
                            ))} */}
                            {amenitiesList.map((value, index)=>(
                              
                                <TypeOption key={value.name + "amenitiesfilter"} >
                                    <NameIcon onPress={()=>updateAmenities(value.name)}>
                                        {GetFAIconsInBlack(value.name)}
                                        <PropertyTypeName>{value.name.replaceAll("_", " ")}</PropertyTypeName>
                                    </NameIcon>
                                    <Pressable onPress={()=>updateAmenities(value.name)}>
                                        <View style={{height:WIDTH*0.055, width:WIDTH*0.055, borderRadius: 5, backgroundColor:filterAmenities.indexOf(value.name) != -1 ? PRIMARYCOLOR : MEDIUMGREY,
                                        justifyContent:'center',alignItems:'center'}}>
                                            <Ionicons name='checkmark' size={15} color='white'/>
                                        </View>
                                    </Pressable>
                                </TypeOption>
                               
                            ))}
                        </AmenitiesContainer>
                        <View style={{width:WIDTH, height: HEIGHT*0.025}}>

                        </View>
                    
                </InputSectionCol>
            </InputForm>
        </ScrollView>
        <Footer >
            <Pressable onPress={resetFilter}>
                <ResetText>Reset</ResetText>
            </Pressable>
            <ApplyButton onPress={filter}>
            <ApplyText>Apply Filter</ApplyText>
            </ApplyButton>
        </Footer>
        </Animated.View>
        </SafeAreaView>
        </Modal>
       
    )
}