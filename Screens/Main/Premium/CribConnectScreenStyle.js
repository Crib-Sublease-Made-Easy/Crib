import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../sharedUtils'

export const CribConnectModal = styled.View`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.5}px
    background: white
    border-radius: 20px
    align-slef: center
    padding-vertical: ${HEIGHT*0.02}px
`

export const CribPremiumSubheaderText = styled.Text`
  font-size: ${HEIGHT*0.035}px
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

export const CustomMarker = styled.View`
  padding-horizontal: ${WIDTH*0.02}px;
  padding-vertical: ${HEIGHT*0.01}px
  border-radius:10px
  background-color: ${PRIMARYCOLOR}
  shadow-color: ${MEDIUMGREY};
  shadow-radius: 5px;
  shadow-offset: 0 0;
  shadow-opacity: 0.5;
  elevation: 2
  align-items: center;
  justify-content: center
`


export const SubmitButton = styled.Pressable`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 10px
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
  height: ${HEIGHT*0.25}px
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
    color: ${DARKGREY}
    font-weight: 400
`

export const NumberBackground = styled.View`
  height: ${HEIGHT*0.05}px;
  width: ${WIDTH*0.2}px
  background-color: ${PRIMARYCOLOR}
  border-radius: 10px
  justify-content: center
  align-items: center
  align-self: flex-end
`

export const NumberText = styled.Text`
  font-size: ${HEIGHT*0.0225}px
  color: black
  font-weight: 600
`

export const CribConnectNotifView = styled.View`
  padding-horizontal: ${WIDTH*0.025}px
  flex-direction: row
  align-items: center
  width: ${WIDTH*0.9}px
  height: ${HEIGHT*0.075}px
  align-self: center
  background-color: white
  shadow-offset: 0 2px
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.1;
  border-radius: 10px;
`

export const CribConnectNotifLogoView = styled.View`
  height: ${HEIGHT*0.06}px
  width: ${HEIGHT*0.06}px
  background-color: #cdab3e
  border-radius: 10px
  justify-content: center 
  align-items: center
`

export const CribConnectNotifNameText = styled.Text`
  font-size: ${HEIGHT*0.0175}px
  font-weight: 500
  color: ${DARKGREY}
`

export const CribConnectNotifContentText = styled.Text`
  width: ${WIDTH*0.65}px
  font-size: ${HEIGHT*0.015}px
  color: #6C6C6C
`

export const MapContainer = styled.View`
  width: ${WIDTH*0.9}px
  height: ${HEIGHT*0.275}px
  align-self: center
  margin-top: ${HEIGHT*0.02}px
`

export const EstimatedSavingText = styled.Text`
  font-size: ${HEIGHT*0.025}px
  font-weight: 400
  align-self: center
  text-align: center
`
export const CribConnectMatchesContainer = styled.Pressable`
  width: ${WIDTH*0.9}px
  padding-vertical: ${HEIGHT*0.01}px
  border-width: 2px
  border-color: gold
  background-color: #ebd426
  border-radius: 10px
  justify-content: space-between
  align-items: center
  flex-direction: row
  padding-horizontal: ${WIDTH*0.05}px
  align-self: center

`

export const CribConnectMatchesText = styled.Text`
  font-size: ${HEIGHT*0.02}px
  font-weight: 600
  color: white
`

export const CribConnectModalHeading = styled.Text`
  font-size: ${HEIGHT*0.025}px
  font-weight: 600;
  color: ${PRIMARYCOLOR}
`

export const CribConnectModalSubheading = styled.Text`
  font-size: ${HEIGHT*0.0175}px
  color: ${DARKGREY}
`

export const ProgressDots = styled.View`
    width: ${WIDTH*0.025}px
    height: ${WIDTH*0.025}px
    border-radius: ${WIDTH*0.0125}px
    background-color: #E0E0E0
`

export const CribConnectModalContinueButton = styled.Pressable`
  width: ${WIDTH*0.64}px
  border-radius: 20px
  padding-vertical: ${HEIGHT*0.015}px
  background-color: #e3cc24
  justify-content: center
  align-items: center
  align-self: center
`

export const CribPremiumPressable = styled.Pressable`
  flex-direction: row
  width: ${WIDTH*0.9}px
  padding-vertical: ${HEIGHT*0.025}px
  background-color: ${PRIMARYCOLOR}
  align-self: center
  border-radius: 10px
  padding-horizontal: ${WIDTH*0.075}px
  justify-content: space-between
  align-items: center
`

export const CribPremiumPressableLeft = styled.View`
  flex-direction: column
`

export const CribPremiumHeaderText = styled.Text`
  font-size: ${HEIGHT*0.02}px
  font-weight: 700
  align-self: center
  text-align:center


`

export const CribPremiumSubheadePostingText = styled.Text`
  font-size: ${HEIGHT*0.015}px
  font-weight: 500
  color: white
  margin-top: ${HEIGHT*0.01}px

`