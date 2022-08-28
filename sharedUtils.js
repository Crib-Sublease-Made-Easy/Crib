import {
    Dimensions,
    Pressable
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import styled from 'styled-components/native';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faBoltLightning, faBottleDroplet, faBottleWater, faBowlFood, faBreadSlice, faBus, faCar, faCaretUp, faCircleNodes, faClosedCaptioning, faCoffee, faCookieBite, faCouch, faDog, faDoorClosed, faDumbbell, faFire, faGripHorizontal, faGripLinesVertical, faHandsWash, faIceCream, faKitchenSet, faMattressPillow, faParking, faPowerOff, faShirt, faSpaghettiMonsterFlying, faStreetView, faSwimmingPool, faTv, faWater, faWifi, faWind, faWindowClose} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-regular-svg-icons';




//Color 
export const PRIMARYCOLOR = '#8559E3' //133 89 227
export const OPACITYPRIMARYCOLOR = 'rgba(133, 89, 227, 1)'

//Dark Grey
export const TEXTINPUTBORDERCOLOR = '#989898'

export const DARKGREY = '#7a7a7a'

//Medium Grey 
export const MEDIUMGREY = '#D9D9D9'

//Light Grey
export const LIGHTGREY = '#E0E0E0'

export const EXTRALIGHT = '#f5f5f5'

export const GOOGLEBLUE = '#4c8bf5'

//Dimensions
export const HEIGHT = Dimensions.get('screen').height;
export const WIDTH = Dimensions.get('screen').width;

// export const  = 'NotoSerif'
//Progress Bar
export const ROBOTOFONTFAMILY= 'Roboto-Regular'

export const ProgressBarCapacity = styled.View`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.0075}px;
    border-radius:10px;
    background-color: rgba(133,89,227,0.2)
    align-self:center
    align-items: flex-start
`
export const ProgressBar = styled.View`
    width: ${WIDTH*0.08}px;
    height: ${HEIGHT*0.0075}px;
    border-radius:10px;
    background-color: ${PRIMARYCOLOR} 
`

//Function to check only characters and space
//Return true if string has only letters and space
export function OnlyLetters(str) {
    return /^[a-zA-Z-]+$/.test(str.trim());
}

export function ContainsSpace(str){
    return /\s/.test(str);
}
export const amenitiesList =
    [{ name: 'Pet_Friendly', library: 'FontAwesome', color: '#57b2f7', icon: "paw" },
    { name: "Garages", library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: "garage"},
    { name: 'Swimming_Pool', library: 'MaterialCommunityIcons',color: '#f79c40', icon: "pool" },
    { name: 'Wifi', library: 'Ionicon', color: '#00d14d', icon: 'wifi' },
    { name: 'Gym', library: 'MaterialCommunityIcons', color: '#f79c40', icon: 'weight-lifter' },
    { name: 'Washer_Dryer', library: 'MaterialCommunityIcons', color: '#00d14d', icon: 'tumble-dryer' },
    { name: 'Gated_Access', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'gate' },
    { name: 'Public_Transportation', library: 'FontAwesome', color: '#57b2f7', icon: 'bus' },
    { name: 'Heating_Cooling', library: 'Ionicon', color: '#f79c40', icon: 'thermometer' },
    { name: 'Microwave', library: 'MaterialCommunityIcons', color: '#57b2f7', icon: 'microwave' },
    { name: 'Grill', library: 'FontAwesome', color: '#fa4b4b', icon: 'bars' },
    { name: 'TV', library: 'Ionicon', color: '#fa4b4b', icon: 'tv-sharp' },
    { name: 'Fridge', library: 'MaterialCommunityIcons', color: '#f79c40', icon: 'fridge' },
    { name: 'Couch', library: 'MaterialCommunityIcons', color: '#00d14d', icon: 'sofa-single' },
    { name: 'Mattress', library: 'MaterialCommunityIcons', color: '#57b2f7', icon: 'bed' },
    { name: 'Oven', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'toaster-oven' },
    { name: 'Coffee_Maker', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'coffee' },
    { name: 'Toaster', library: 'MaterialCommunityIcons', color: '#57b2f7', icon: 'toaster' },
    { name: 'Dishes', library: 'MaterialCommunityIcons', color: '#f79c40', icon: 'bowl-mix' },
    { name: 'Pots_Pans', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'pot' },
    { name: 'Utilities_Included', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'power-plug' },
    { name: 'Walkin_Closet', library: 'MaterialCommunityIcons', color: '#57b2f7', icon: 'door-open' },
    { name: 'Iron', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'iron' },
    { name: 'Freezer', library: 'MaterialCommunityIcons', color: '#00d14d', icon: 'fridge' },
    { name: 'Street_Parking', library: 'MaterialCommunityIcons', color: '#f79c40', icon: 'parking' },
    { name: 'Parking_on_Premesis', library: 'MaterialCommunityIcons', color: '#00d14d', icon: 'parking' },
    { name: 'Balcony', library: 'MaterialCommunityIcons', color: '#57b2f7', icon: 'balcony' },
]

export const GetFAIcons = (name) =>{
    if(name=="Pet_Friendly"){
        return <FontAwesomeIcon icon={faDog} color='white'/>
    }
    else if(name=="Garages"){
        return <FontAwesomeIcon icon={faCar} color='white'/>
    }
    else if(name=="Swimming_Pool"){
        return <FontAwesomeIcon icon={faSwimmingPool} color='white'/>
    }
    else if(name=="Wifi"){
        return <FontAwesomeIcon icon={faWifi} color='white'/>
    }
    else if(name=="Gym"){
        return <FontAwesomeIcon icon={faDumbbell} color='white'/>
    }
    else if(name=="Washer_Dryer"){
        return <FontAwesomeIcon icon={faWater} color='white'/>
    }
    else if(name=="Gated_Access"){
        return <FontAwesomeIcon icon={faDoorClosed} color='white'/>
    }
    else if(name=="Public_Transportation"){
        return <FontAwesomeIcon icon={faBus} color='white'/>
    }
    else if(name=="Heating_Cooling"){
        return <FontAwesomeIcon icon={faFire} color='white'/>
    }
    else if(name=="Microwave"){
        return <FontAwesomeIcon icon={faBowlFood} color='white'/>
    }
    else if(name=="Grill"){
        return <FontAwesomeIcon icon={faGripHorizontal} color='white'/>
    }
    else if(name=="TV"){
        return <FontAwesomeIcon icon={faTv} color='white'/>
    }
    else if(name=="Fridge"){
        return <FontAwesomeIcon icon={faBottleWater} color='white'/>
    }
    else if(name=="Couch"){
        return <FontAwesomeIcon icon={faCouch} color='white'/>
    }
    else if(name=="Mattress"){
        return <FontAwesomeIcon icon={faMattressPillow} color='white'/>
    }
    else if(name=="Oven"){
        return <FontAwesomeIcon icon={faCookieBite} color='white'/>
    }
    else if(name=="Coffee_Maker"){
        return <FontAwesomeIcon icon={faCoffee} color='white'/>
    }
    else if(name=="Toaster"){
        return <FontAwesomeIcon icon={faBreadSlice} color='white'/>
    }
    else if(name=="Dishes"){
        return <FontAwesomeIcon icon={faBottleDroplet} color='white'/>
    }
    else if(name=="Pots_Pans"){
        return <FontAwesomeIcon icon={faKitchenSet} color='white'/>
    }
    else if(name=="Utilities_Included"){
        return <FontAwesomeIcon icon={faBoltLightning} color='white'/>
    }
    else if(name=="Walkin_Closet"){
        return <FontAwesomeIcon icon={faDoorClosed} color='white'/>
    }
    else if(name=="Iron"){
        return <FontAwesomeIcon icon={faCircleNodes} color='white'/>
    }
    else if(name=="Freezer"){
        return <FontAwesomeIcon icon={faIceCream} color='white'/>
    }
    else if(name=="Street_Parking"){
        return <FontAwesomeIcon icon={faStreetView} color='white'/>
    }
    else if(name=="Parking_on_Premesis"){
        return <FontAwesomeIcon icon={faParking} color='white'/>
    }
    else if(name=="Balcony"){
        return <FontAwesomeIcon icon={faWind} color='white'/>
    }
    else{
        return <FontAwesomeIcon icon={faDog} />
    }
}

export const GetFAIconsInBlack = (name) =>{
    if(name=="Pet_Friendly"){
        return <FontAwesomeIcon icon={faDog} color='black'/>
    }
    else if(name=="Garages"){
        return <FontAwesomeIcon icon={faCar} color='black'/>
    }
    else if(name=="Swimming_Pool"){
        return <FontAwesomeIcon icon={faSwimmingPool} color='black'/>
    }
    else if(name=="Wifi"){
        return <FontAwesomeIcon icon={faWifi} color='black'/>
    }
    else if(name=="Gym"){
        return <FontAwesomeIcon icon={faDumbbell} color='black'/>
    }
    else if(name=="Washer_Dryer"){
        return <FontAwesomeIcon icon={faWater} color='black'/>
    }
    else if(name=="Gated_Access"){
        return <FontAwesomeIcon icon={faDoorClosed} color='black'/>
    }
    else if(name=="Public_Transportation"){
        return <FontAwesomeIcon icon={faBus} color='black'/>
    }
    else if(name=="Heating_Cooling"){
        return <FontAwesomeIcon icon={faFire} color='black'/>
    }
    else if(name=="Microwave"){
        return <FontAwesomeIcon icon={faBowlFood} color='black'/>
    }
    else if(name=="Grill"){
        return <FontAwesomeIcon icon={faGripHorizontal} color='black'/>
    }
    else if(name=="TV"){
        return <FontAwesomeIcon icon={faTv} color='black'/>
    }
    else if(name=="Fridge"){
        return <FontAwesomeIcon icon={faBottleWater} color='black'/>
    }
    else if(name=="Couch"){
        return <FontAwesomeIcon icon={faCouch} color='black'/>
    }
    else if(name=="Mattress"){
        return <FontAwesomeIcon icon={faMattressPillow} color='black'/>
    }
    else if(name=="Oven"){
        return <FontAwesomeIcon icon={faCookieBite} color='black'/>
    }
    else if(name=="Coffee_Maker"){
        return <FontAwesomeIcon icon={faCoffee} color='black'/>
    }
    else if(name=="Toaster"){
        return <FontAwesomeIcon icon={faBreadSlice} color='black'/>
    }
    else if(name=="Dishes"){
        return <FontAwesomeIcon icon={faBottleDroplet} color='black'/>
    }
    else if(name=="Pots_Pans"){
        return <FontAwesomeIcon icon={faKitchenSet} color='black'/>
    }
    else if(name=="Utilities_Included"){
        return <FontAwesomeIcon icon={faPowerOff} color='black'/>
    }
    else if(name=="Walkin_Closet"){
        return <FontAwesomeIcon icon={faClosedCaptioning} color='black'/>
    }
    else if(name=="Iron"){
        return <FontAwesomeIcon icon={faCircleNodes} color='black'/>
    }
    else if(name=="Freezer"){
        return <FontAwesomeIcon icon={faIceCream} color='black'/>
    }
    else if(name=="Street_Parking"){
        return <FontAwesomeIcon icon={faStreetView} color='black'/>
    }
    else if(name=="Parking_on_Premesis"){
        return <FontAwesomeIcon icon={faParking} color='black'/>
    }
    else if(name=="Balcony"){
        return <FontAwesomeIcon icon={faWind} color='black'/>
    }
    else{
        return <FontAwesomeIcon icon={faDog} />
    }
}


export const GetAmenitiesIcon = (name) =>{
    if(name=="Pet_Friendly"){
        return "paw-outline";
    }
    else if (name=="Mattress"){
        return "bed-outline";
    }
    else if (name=="Able to renew"){
        return "refresh-outline";
    }
    else if (name=="Gym"){
        return "barbell-outline";
    }
    else if (name=="On-site Washer and Dryer"){
        return "water-outline";
    }
    else if (name=="Wifi"){
        return "wifi-outline";
    }
    else if (name=="Furnished"){
        return "desktop-outline";
    }
    else if (name=="Utilities Included"){
        return "power-outline";
    }
    else if (name=="Pool"){
        return "flask-outline";
    }
    else if (name=="Parking"){
        return "car-outline";
    }
    else if (name=="TV"){
        return "tv-outline";
    }
    else if (name=="Heating and Cooling"){
        return "thermometer-outline";
    }
    else if (name=="Garages"){
        return "car-outline"
    }
    else if (name=="Gated Access"){
        return "lock-closed-outline"
    }
    else{
        return "checkbox"
    }
}

export const HeaderContainer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.05}px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
    align-self:center
`

export const BackButtonContainer = styled.View`
    padding-left: ${WIDTH*0.025}px
    width: ${WIDTH*0.25}px;
    height: 100%
    justify-content: center;
    align-items:flex-start;
`


export const NameContainer = styled.View`
    width: ${WIDTH*0.5}px;
    justify-content: center;
    align-items:center 
`

export const ResetButtonContainer = styled.View`
    width: ${WIDTH*0.25}px;
    padding-right: ${WIDTH*0.025}px
    height: 100%
    justify-content: center;
    align-items:flex-end;
`

export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
`

export const ProgressText = styled.Text`
    width: ${WIDTH*0.9}px;
    text-align: center;
    align-self: center
    
`

//Continue Button used in sign up 
export const ContinueButton = styled(Pressable)`
    width: ${WIDTH*0.7}px;
    height: ${ HEIGHT*0.07}px;
    backgroundColor:  ${props=>(props.loading ? MEDIUMGREY : PRIMARYCOLOR)}}
    align-self: center
    border-radius: 25px
    justify-content: center
    align-items: center
    margin-bottom: ${HEIGHT*0.025}px;
    shadow-offset: 0 0
    shadow-color: black;
    shadow-radius: 5px;
    shadow-opacity: 0.2;
    elevation: 5
`
//Continue Button Text used in sign up 
export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.025}px;
    font-weight: 400
    color: white
    
`

export const IconPressable = styled.Pressable`

`