import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils'

export const CribPremiumSubheaderText = styled.Text`
  font-size: ${HEIGHT*0.045}px
  font-weight: 500
  margin-top: ${HEIGHT*0.01}px
  width: ${WIDTH*0.9}px;
  align-self: center
`
export const CribPremiumPaidSubheaderText = styled.Text`
  font-size: ${HEIGHT*0.04}px
  font-weight: 500
  margin-top: ${HEIGHT*0.01}px
  width: ${WIDTH*0.9}px;
  align-self: center
`

export const SubmitButton = styled.Pressable`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 15px
    align-self: center
    justify-content: center
    align-items: center
    margin-top: ${HEIGHT*0.025}px
`

export const PreferenceLabel = styled.Text`
  width: ${WIDTH*0.9}px 
  align-self: center
  font-weight: 600
  font-size: ${HEIGHT*0.02}px
  color: black
`

export const PreferencesInput = styled.TextInput`
  width: ${WIDTH*0.9}px
  align-self: center
  height: ${HEIGHT*0.225}px
  background-color: ${EXTRALIGHT}
  border-width: 1px
  border-color: ${LIGHTGREY}
  border-radius: 10px
  margin-top: ${HEIGHT*0.02}px
  padding-top: ${HEIGHT*0.0175}px
  padding-horizontal: ${HEIGHT*0.01}px

  
`

export const SubmitButtonOutline = styled.Pressable`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: white
    border-radius: 15px
    align-self: center
    justify-content: center
    align-items: center
    border-width: 2px
    margin-top: ${HEIGHT*0.025}px
    border-color: ${PRIMARYCOLOR}
`

export const SubmitText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: white
    font-weight: 500
`
export const ReferralCodeHelperText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    align-self: center
`