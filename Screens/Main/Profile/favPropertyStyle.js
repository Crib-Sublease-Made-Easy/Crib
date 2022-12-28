import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, DARKGREY, EXTRALIGHT, GOOGLEBLUE } from '../../../sharedUtils'

export const PostedPropertyHeader = styled.Text`
    font-size: ${HEIGHT*0.025}px;
    font-weight: 500; 
    color: black
    align-self: center
    justify-content: center
    margin-bottom: ${HEIGHT*0.01}px
`

export const PostView = styled.View`
    width: ${WIDTH*0.9}px;
    align-self: center
    margin-top: ${HEIGHT*0.025}px
`
export const PostedPropertyInfoContainer = styled.Pressable`
    width:${WIDTH*0.9}px;
    align-self: center;
    padding-vertical: ${HEIGHT*0.01}px;
`
export const PropertyName = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  padding-vertical: ${HEIGHT*0.005}px
  font-weight: 500;
`

export const DatePriceText = styled.Text`
  fontSize: ${HEIGHT*0.015}px;
  padding-vertical: ${HEIGHT*0.005}px
  color: #4d4b4b
  font-weight: 400;
`

export const PriceEditContainer = styled.View`
  width:${WIDTH*0.9}px;
  align-self: center
  flex-direction: row
  justify-content: space-between
  align-items: center
`

export const EditPropertyPressable = styled.Pressable`
  width: ${WIDTH*0.2}px;
  border-radius: 15px;
  background-color: rgba(217,217,217,0.5)
  justify-content: center;
  align-items: center
`

export const EditText = styled.Text`
  font-size: ${HEIGHT*0.02}px
  color: ${PRIMARYCOLOR}
  font-weight: 500
  padding:${WIDTH*0.015}px
`
