import {
    Dimensions,
    Pressable
} from 'react-native';

import styled from 'styled-components/native';


//Color 
export const PRIMARYCOLOR = '#8559E3'
export const OPACITYPRIMARYCOLOR = 'rgba(133, 89, 227, 1)'

//Dark Grey
export const TEXTINPUTBORDERCOLOR = '#989898'

export const DARKGREY = '#989898'

//Medium Grey 
export const MEDIUMGREY = '#D9D9D9'

//Light Grey
export const LIGHTGREY = '#E0E0E0'

export const EXTRALIGHT = '#EFEFEF'

export const GOOGLEBLUE = '#4c8bf5'

//Dimensions
export const HEIGHT = Dimensions.get('screen').height;
export const WIDTH = Dimensions.get('screen').width;

// export const  = 'NotoSerif'
//Progress Bar
export const TESTFONT = 'Merriweather'

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
    { name: 'Fridge', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'fridge' },
    { name: 'Couch', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'sofa-single' },
    { name: 'Mattress', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'bed' },
    { name: 'Oven', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'toaster-oven' },
    { name: 'Coffee_Maker', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'coffee' },
    { name: 'Toaster', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'toaster' },
    { name: 'Dishes', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'bowl-mix' },
    { name: 'Pots_Pans', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'pot' },
    { name: 'Utilities_Included', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'power-plug' },
    { name: 'Walkin_Closet', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'door-open' },
    { name: 'Iron', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'iron' },
    { name: 'Freezer', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'fridge' },
    { name: 'Street_Parking', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'parking' },
    { name: 'Parking_on_Premesis', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'parking' },
    { name: 'Balcony', library: 'MaterialCommunityIcons', color: '#fa4b4b', icon: 'balcony' },





]
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