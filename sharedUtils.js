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

export const FONTFAMILY = 'NotoSerif'
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
    [{ name: 'Pet_Friendly', color: '#57b2f7', icon: "bed-outline" },
    { name: "Garages", color: '#fa4b4b', icon: 'bed-outline' },
    { name: 'Swimming_Pool', color: '#f79c40', icon: 'car-outline' },
    { name: 'Wifi', color: '#00d14d', icon: 'barbell-outline' },
    { name: 'Gym', color: '#f79c40', icon: 'water-outline' },
    { name: 'Washer_Dryer', color: '#00d14d', icon: 'wifi-outline' },
    { name: 'Gated_Access', color: '#fa4b4b', icon: 'desktop-outline' },
    { name: 'Public_Transportation', color: '#57b2f7', icon: 'power-outline' },
    { name: 'Heating_Cooling', color: '#f79c40', icon: 'flask-outline' },
    { name: 'Microwave', color: '#57b2f7', icon: 'car-outline' },
    { name: 'Grill', color: '#fa4b4b', icon: 'tv-outline' },
    { name: 'TV', color: '#fa4b4b', icon: 'tv-outline' },
    { name: 'Fridge', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Couch', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Mattress', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Oven', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Coffee_Maker', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Toaster', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Dishes', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Pots_Pans', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Utilities_Included', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Walkin_Closet', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Iron', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Freezer', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Street_Parking', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Parking_on_Premesis', color: '#fa4b4b', icon: 'thermometer-outline' },
    { name: 'Balcony', color: '#fa4b4b', icon: 'thermometer-outline' },





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
    //font-family: ${FONTFAMILY}
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
    //font-family: ${FONTFAMILY}
`