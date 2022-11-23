import React, {useState}  from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
} from 'react-native';

import { MEDIUMGREY,HEIGHT, WIDTH, amenitiesList, GetFAIconsInBlack, PRIMARYCOLOR, PROPERTIESTYPES, DEFAULTTYPE, DEFAULTPRICE, DEFAULTAVAILABLEFROM, DEFAULTAVAILABLETO, DEFAULTBEDROOM, DEFAULTDISTANCE, DEFAULTAMENITIES, DEFAULTBATHROOM, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, EditPageForwardButtonContainer} from '../../../../sharedUtils';

import Modal from "react-native-modal";
import Slider from '@react-native-community/slider';
import DatePicker from 'react-native-date-picker'

import {
Header,
InputForm,
InputSection, 
InputName,
InputNameContainer, 
InputOptionContainer,
InputPriceRangeContainer, 
PriceRangeText, 
TypeOption, 
TypeContainer, 
PropertyTypeName, 
BedroomOptions,
BedroomOptionsText, 
AmenitiesContainer, 
NameIcon, 
DateInputPressable, 
Footer, 
ResetText, 
ApplyButton, 
ApplyText,
Section,
IndividualAmenitiesContainer,
ResetButtonContainer
} from './discoverFilterStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
Ionicons.loadFont()

//Bedroom and bathroom options
const BEDROOMTYPES = ["Studio","1" ,"2", "3", "4P"];
const BATHROOMTYPES = ["1", "2", "3", "4P"];

export default function DiscoverFilterScreen({navigation, currentLocation, open, close, setFilteredProperties, retrieveAllPins
    ,filterType, setfilterType, filterDistance, setfilterDistance, filterBedroom, setfilterBedroom,filterBathroom, setfilterBathroom
    ,filterPriceHigher, setfilterPriceHigher, filterAmenities, setfilterAmenities, setRetrieveMore, filterPreviewValue, setfilterPreviewValue, 
    filterPreviewDistanceValue, setfilterPreviewDistanceValue, filterAvailableFrom, setfilterAvailableFrom,
    filterAvailableTo, setfilterAvailableTo, loadProperty, setFlatlistRefreshingTrue, setFlatlistRefreshingFalse
}){
    //When sliding the slides in select, the page doesnt move around
    const [scrollEnabled, setscrollEnabled] = useState(true)
    //Indicate if user pressed reset, if yes then load property with default values
    const [reset, setReset] = useState(false)

    //Sets DatePicker Modal Visibility
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    
    //Add and remove amenities from fitleramn list 
    function updateAmenities(name) {
        if (filterAmenities.indexOf(name) != -1) {
            let tempindex = filterAmenities.indexOf(name);
            setfilterAmenities([...filterAmenities.slice(0, tempindex), ...filterAmenities.slice(tempindex + 1, filterAmenities.length)])
        }
        else {
            setfilterAmenities(prev => [...prev, name]);
        }
    }

    //Function to set all filter back to default
    function resetFilter(){
        setfilterType(DEFAULTTYPE)
        setfilterPriceHigher(DEFAULTPRICE)
        setfilterAvailableFrom(DEFAULTAVAILABLEFROM)
        setfilterAvailableTo(DEFAULTAVAILABLETO)
        setfilterPreviewDistanceValue(DEFAULTDISTANCE)
        setfilterPreviewValue(DEFAULTPRICE)
        setfilterAmenities(DEFAULTAMENITIES)
        setfilterBathroom(DEFAULTBATHROOM)
        setfilterBedroom(DEFAULTBATHROOM)
        setfilterDistance(DEFAULTDISTANCE)
        setReset(true)
    }

    //Set the properties according to filter values 
    function filter(){
        setFlatlistRefreshingTrue()
        setRetrieveMore(true)
        let s = "";
        if(filterType != ""){
            s = s + "&type=" + filterType;
        }
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
    
        fetch('https://crib-llc.herokuapp.com/properties/query?page=0' + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(async res => {
                if(res.status == 200){
                    const properties = await res.json()
                    if(properties != undefined && properties.length != 0){
                        setFilteredProperties([...properties])
                    }
                    else{
                        setFilteredProperties([])
                    }
                }
                else{
                    alert("An error occured. Please try again later!")
                }
                close()
            })
            .catch(e=>{
                alert(e)
        })
        retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities,new Date(filterAvailableFrom).getTime(), new Date(filterAvailableTo).getTime() )

        setTimeout(()=>{
            setFlatlistRefreshingFalse()
        },2000)
            
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NEED TO CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!
    async function checkResetAndBack(){
       
        if(reset){
            setReset(false)
            retrieveAllPins(currentLocation[0], currentLocation[1], DEFAULTDISTANCE, DEFAULTPRICE, DEFAULTBEDROOM, DEFAULTBATHROOM, DEFAULTTYPE, DEFAULTAMENITIES,DEFAULTAVAILABLEFROM.getTime(), DEFAULTAVAILABLETO.getTime())
            loadProperty()
        }
       
        close()
    }

    return(
       
        <Modal visible={open} animationType='slide' style={{flex: 1, backgroundColor:'white', margin: 0}}>
            <SafeAreaView style={{flex: 1}}>
                <EditPagesHeaderContainer>
                    <EditPageBackButtonContainer>
                        <Pressable  onPress={close}>
                            <Ionicons name='arrow-back-outline' size={25} color='black'/>
                        </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                        <Header>Filter</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
                    {/* All the inputs for the filter */}
                    <InputForm>
                        {/* Filter Type */}
                        <Section>
                            <InputNameContainer>
                                <InputName>Type</InputName>
                            </InputNameContainer>

                            <TypeContainer>
                            {PROPERTIESTYPES.map((value)=>(
                                <TypeOption key={value.type + value.icon} >
                                    <NameIcon hitSlop={WIDTH*0.05} onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                                        <FontAwesome name={value.icon} size={20} />
                                        <PropertyTypeName>{value.type}</PropertyTypeName>
                                    </NameIcon>
                                    <Pressable hitSlop={WIDTH*0.025} onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                                    <Ionicons name='checkbox' size={30} color={value.type == filterType ? PRIMARYCOLOR : MEDIUMGREY}/>
                                </Pressable>
                                </TypeOption>
                            ))}
                            </TypeContainer>
                        </Section>

    
                        {/* Filter Price */}
                        <Section style={{paddingBottom: 0}}>
                            <InputSection style={{borderBottomWidth: 0}}>
                                <InputNameContainer>
                                    <InputName>Max Budget</InputName>
                                </InputNameContainer>
                                <InputPriceRangeContainer>
                                        <PriceRangeText>${filterPreviewValue} / month</PriceRangeText>
                                </InputPriceRangeContainer>
                            </InputSection>
                            {/* Cannot use style in slider so put slider in view component */}
                            <View style={{alignItems:'center'}}>
                                <Slider
                                    style={{width: WIDTH*0.8, height: HEIGHT*0.15}}
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
                        </Section>

                        <Section>
                            <InputNameContainer>
                                <InputName>Available From</InputName>
                            </InputNameContainer>
                            <DateInputPressable  hitSlop={WIDTH*0.05} onPress={()=>setOpenFrom(true)}>
                                <PropertyTypeName>{filterAvailableFrom.toDateString()}</PropertyTypeName>
                            </DateInputPressable>
                            <InputNameContainer>
                                <InputName>Available To</InputName>
                            </InputNameContainer>
                            <DateInputPressable  hitSlop={WIDTH*0.05} onPress={()=>setOpenTo(true)}>
                                <PropertyTypeName>{filterAvailableTo.toDateString()}</PropertyTypeName>
                            </DateInputPressable>

                            {/* Avaialble from datepicekr */}
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
                            {/* AvailableTo date picker  */}
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
                        </Section>

                        {/* Filter Distance  */}
                        <Section>
                            <InputSection style={{borderBottomWidth: 0}}>
                                <InputNameContainer>
                                        <InputName>Max Distance</InputName>
                                </InputNameContainer>
                                <InputPriceRangeContainer>
                                        <PriceRangeText>{filterPreviewDistanceValue} miles</PriceRangeText>
                                </InputPriceRangeContainer>
                            </InputSection>
                            <View style={{alignItems:'center'}}>
                            <Slider
                                style={{width: WIDTH*0.8, height: HEIGHT*0.1}}
                                value={filterPreviewDistanceValue}
                                onValueChange={(value)=> setfilterPreviewDistanceValue(value)}
                                onValuesChangeStart={()=> setscrollEnabled(false)}
                                onValuesChangeFinish={()=> setscrollEnabled(true)}
                                onSlidingComplete={(value)=> setfilterDistance(value)}
                                minimumValue={0}
                                maximumValue={DEFAULTDISTANCE}
                                step={5}
                                minimumTrackTintColor={PRIMARYCOLOR}
                                maximumTrackTintColor={MEDIUMGREY}
                            />
                            </View>
                        </Section>

                        {/* Filter Bedroom  */}
                        <Section>
                            <InputNameContainer>
                                <InputName>Beds</InputName>
                            </InputNameContainer>
                            <InputOptionContainer>
                            {BEDROOMTYPES.map((value, index)=>(
                                <BedroomOptions  key={"bedroomOption" + value  + index}  hitSlop={WIDTH*0.05} onPress={()=> value == filterBedroom ? setfilterBedroom("") : setfilterBedroom(value)} inputValue={filterBedroom} value={value}>   
                                    <BedroomOptionsText value={value} inputValue={filterBedroom}>{value.replace("P","+")}</BedroomOptionsText>
                                </BedroomOptions>
                            ))}
                            </InputOptionContainer>
                        </Section>

                        {/* Bathroom Section, bathroom stores as 4P not 4+ so need to change */}
                        <Section>
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
                        </Section>

                        {/* Filter Amenities */}
                        <Section style={{borderBottomWidth: 0}}>
                            <InputNameContainer>
                                <InputName>Amenities</InputName>
                            </InputNameContainer>
                            
                            <AmenitiesContainer>
                                {amenitiesList.map((value, index)=>(
                                
                                <IndividualAmenitiesContainer index={index} key={value.name + "amenitiesfilter"}>
                                        <NameIcon  hitSlop={WIDTH*0.05} onPress={()=>updateAmenities(value.name)}>
                                            {GetFAIconsInBlack(value.name)}
                                            <PropertyTypeName>{value.name.replaceAll("_", " ")}</PropertyTypeName>
                                        </NameIcon>
                                        <Pressable  hitSlop={WIDTH*0.05} onPress={()=>updateAmenities(value.name)}>
                                            <Ionicons name='checkbox' size={30} color={filterAmenities.indexOf(value.name) != -1 ? PRIMARYCOLOR : MEDIUMGREY}/>
                                        </Pressable>
                                </IndividualAmenitiesContainer>
                                
                                ))}
                            </AmenitiesContainer>

                            {/* Padding in the bottom so the amenities list dont touch the bottom */}
                            <View style={{width:WIDTH, height: HEIGHT*0.025}}/>
                        </Section>

                    </InputForm>
                </ScrollView>

                <Footer>
                    <ResetButtonContainer hitSlop={WIDTH*0.05} onPress={resetFilter}>
                        <ResetText>Reset</ResetText>
                    </ResetButtonContainer>

                    <ApplyButton  hitSlop={WIDTH*0.05} onPress={filter}>
                        <ApplyText>Apply Filter</ApplyText>
                    </ApplyButton>
                </Footer>

            </SafeAreaView>
        </Modal>
    )
}