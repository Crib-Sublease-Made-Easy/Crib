import React, {useState, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';

import styled from 'styled-components/native';
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, EXTRALIGHT, MEDIUMGREY, DARKGREY } from '../../../sharedUtils'

const PRIMARYGREY = '#5e5d5d'


export const RowContainer = styled.Pressable`
    padding-vertical: ${HEIGHT*0.015}px;
   
    align-items: center;
    justify-content: space-between
    flex-direction: row
    
    
`
export const RowName = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 400
    width: ${WIDTH*0.8}px
    text-align: left
    color: black
`
