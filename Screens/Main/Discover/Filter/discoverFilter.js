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

} from 'react-native';

// const amenitiesList =
//     [{ name: 'Pets Allowed', color: '#57b2f7', icon: "paw-outline" },
//     { name: 'Mattress', color: '#fa4b4b', icon: 'bed-outline' },
//     { name: 'Able to renew', color: '#f79c40', icon: 'refresh-outline' },
//     { name: 'Gym', color: '#00d14d', icon: 'barbell-outline' },
//     { name: 'On-site Washer and Dryer', color: '#f79c40', icon: 'water-outline' },
//     { name: 'Wifi', color: '#00d14d', icon: 'wifi-outline' },
//     { name: 'Furnished', color: '#fa4b4b', icon: 'desktop-outline' },
//     { name: 'Utilities Included', color: '#57b2f7', icon: 'power-outline' },
//     { name: 'Pool', color: '#f79c40', icon: 'flask-outline' },
//     { name: 'Parking', color: '#57b2f7', icon: 'car-outline' },
//     { name: 'TV', color: '#fa4b4b', icon: 'tv-outline' },
//     { name: 'Heating and Cooling', color: '#fa4b4b', icon: 'thermometer-outline' },
//     ]

const PROPERTIESTYPES = 
[{type: "Room", icon:'bed'},
  {type: "House", icon:'home'}, 
  {type: "Apartment", icon: 'building'}, 
  {type:"Studio", icon :'user'}
];

const BEDROOMTYPES = ["Studio", "2", "3", "4", "4+"];
const BATHROOMTYPES = ["1", "2", "3", "4", "5+"];


const PRIMARYGREY = '#5e5d5d'
const PRIMARYCOLOR = '#4050B5'

import { MEDIUMGREY,HEIGHT, WIDTH, DARKGREY, amenitiesList, GetAmenitiesIcon } from '../../../../sharedUtils';

import Modal from "react-native-modal";

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
    ,filterPriceHigher, setfilterPriceHigher, filterAmenities, setfilterAmenities, propertyAmenities, setpropertyAmenities, setRetrieveMore
}){
    const [containerModal, setcontainerModal] = useState(false);
    const [scrollEnabled, setscrollEnabled] = useState(true)

    

    //Sets DatePicker Modal Visibility
    const [propertydateFrom, setpropertydateFrom] = useState(new Date())
    const [propertydateTo, setpropertydateTo] = useState(new Date(1759176355615))
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
        setfilterType("")
        setfilterPriceHigher(10000)
        setpropertydateFrom(new Date())
        setpropertydateTo(new Date(1759176355615))
        setfilterAmenities([])
        setfilterBathroom("")
        setfilterBedroom("")
        setfilterDistance(150)

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
    s = s + `&latitude=${currentLocation[0]}`
    s = s + `&longitude=${currentLocation[1]}`
    s = s + `&priceHigh=${filterPriceHigher}`
    s = s + '&priceLow=0'
    console.log(s);

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
            console.log(properties)
            close()
        })
        .catch(e=>{
            alert(e)
    })
    retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities )
    }

    return(
       
        <Modal hideModalContentWhileAnimating={true} style={ModalStyle} isVisible={open} animationIn="slideInUp" animationOut='slideOutDown' backdropOpacity={0}>
        <SafeAreaView style={{flex: 1}}>
            <Animated.View>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=>close()}>
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
                                <PriceRangeText>${filterPriceHigher} / month</PriceRangeText>
                        </InputPriceRangeContainer>
                    </InputSection>
                    <View style={{alignItems:'center'}}>
                    <MultiSlider
                    isMarkersSeparated={true}
                    enabledTwo={false}
                    values={[filterPriceHigher]}
                    onValuesChangeStart={()=> setscrollEnabled(false)}
                    onValuesChangeFinish={()=> setscrollEnabled(true)}
                    onValuesChange={(value)=> setfilterPriceHigher(value)}
                    min={0}
                    max={10000}
                    
                    step={10}
                    enabledOne={true}
                    
                    selectedStyle={{
                        backgroundColor: PRIMARYCOLOR
                    }}
                    containerStyle={{
                        width:WIDTH,
                        alignItems:'center'
                    }}
                    sliderLength={WIDTH*0.8}
                
                    />
                    </View>
                </PriceInputSection>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Available From</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenFrom(true)}>
                        <PropertyTypeName>{propertydateFrom.toDateString()}</PropertyTypeName>
                    </DateInputPressable>
                    <InputNameContainer>
                        <InputName>Available To</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenTo(true)}>
                    {propertydateTo.getTime() < 1759176355615 ?
                        <PropertyTypeName>{propertydateTo.toDateString()}</PropertyTypeName>
                    :
                    null
                    }
                    </DateInputPressable>
                    <DatePicker
                        
                        modal
                        mode='date'
                        open={openFrom}
                        date={propertydateFrom}
                        onConfirm={(date) => {
                            if(date.getTime() < new Date().getTime()){
                                alert("Invalid Available From Date")
                            }
                            else if(date.getTime() >= propertydateTo.getTime()){
                                alert("Cannot set date to after Available From date.")
                            }
                            else{
                                setpropertydateFrom(date)
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
                        date={propertydateTo}
                        onConfirm={(date) => {
                            if(date.getTime() < new Date().getTime()){
                                alert("Cannot set Available To before today")
                            }
                            else if(date.getTime() <= propertydateFrom.getTime()){
                                alert("Cannot set Available To on or before Available From date")
                            }
                            else if(date.getTime() >= 1759176355615){
                                alert("Date Selected is too far ahead, please select a closer date.") 
                            }
                            else{
                                setpropertydateTo(date)
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
                                <PriceRangeText>{filterDistance} miles</PriceRangeText>
                        </InputPriceRangeContainer>
                    </InputSection>
                    <View style={{alignItems:'center'}}>
                    <MultiSlider
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
                            <BedroomOptionsText value={value} inputValue={filterBedroom}>{value}</BedroomOptionsText>
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
                            <BedroomOptionsText value={value} inputValue={filterBathroom}>{value}</BedroomOptionsText>
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
                                        <Ionicons key={value.icon} name={GetAmenitiesIcon(value.name)} size={20} />
                                        <PropertyTypeName>{value.name.replace("_", " ")}</PropertyTypeName>
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