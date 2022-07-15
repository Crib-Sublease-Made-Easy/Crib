import React, {useState, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';

import styled from 'styled-components/native';
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, EXTRALIGHT } from '../../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'


export const ModalStyle = {padding:0, margin:0, flex: 1, backgroundColor: 'white',}


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

export const InputForm = styled.View`
    width: ${WIDTH}px;
   
`

export const InputSection = styled.View`
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0
    align-self: center
    flex-direction: row
    justify-content: space-between
`
export const InputSectionCol = styled.View`
    padding-vertical: ${HEIGHT*0.02}px
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0
    align-self: center
`

export const InputNameContainer = styled.View`
   
   
    height: ${HEIGHT*0.075}px;
    justify-content: center;
    
`

export const InputName = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 700;
`
export const InputOptionContainer = styled.View`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.07}px;
    flex-direction: row;
    justify-content: center
    align-items: center
    align-self: center
`

export const BedroomOptions = styled(Pressable)`
    padding-horizontal: ${WIDTH*0.03}px
    padding-vertical: ${HEIGHT*0.01}px
    background-color: ${props=>(props.value == props.inputValue ? PRIMARYCOLOR : LIGHTGREY)}
    margin-left: ${WIDTH*0.02}px;
    margin-right: ${WIDTH*0.02}px;
    border-radius: 10px
`

export const BedroomOptionsText = styled(Text)`
    font-size: ${HEIGHT*0.025}px;
    font-weight: 400
    color: ${props=>(props.value == props.inputValue ? 'white' : 'black')}
`

export const PropertyTypeName = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
`


export const TypeContainer = styled.View`
    width: ${WIDTH*0.9}px;
    justify-content: space-between;
`

export const TypeOption = styled.View`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.05}px
    flex-direction: row;
    justify-content: space-between;
    align-self: center
    align-items: center
`

export const InputPressableContainer = styled.Pressable`
    padding-left: ${WIDTH*0.01}px;
`

export const InputPriceRangeContainer = styled.View`
    width: ${WIDTH*0.525}px;
    height: ${HEIGHT*0.075}px;
    justify-content: flex-end;
    align-items: center
    flex-direction: row
   
`

export const PriceRangeText = styled.Text`
   
    font-size: ${HEIGHT*0.0175}px;
    color: ${PRIMARYGREY};
    font-weight: 500;
   
`

export const PriceInputSection = styled.View`
    padding-vertical: ${HEIGHT*0.025}px
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0 
    align-self:center
`

export const AmenitiesInputSection = styled.View`
    width: ${WIDTH*0.8}px;
    align-self:center
    height: ${HEIGHT*0.075}px;
    justify-content: center
`

export const IndividualAmenitiesContainer = styled.View`

`
export const DoneContainer = styled.View`
   
    
    width: ${WIDTH}px;
    padding-bottom: ${HEIGHT*0.05}px;
    align-items:center

`

export const DoneButton = styled.Pressable`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px;
    background-color: ${PRIMARYCOLOR};
    align-self:center;
    margin-top:${HEIGHT*0.03}px;
    border-radius: 20px;
    justify-content: center;
    align-items:center
`

export const DoneText = styled.Text`
    font-size: ${HEIGHT*0.03}px;
    font-weight:700;
    align-self: center
    color: white
`

export const BedBathNumberText = styled.Text`
    width: ${WIDTH*0.1}px;
    font-size:${HEIGHT*0.02}px;
    text-align: center
`