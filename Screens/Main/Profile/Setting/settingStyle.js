import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils';


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

export const CategoryContainer = styled.View`
    width: ${WIDTH}px;
    padding-vertical: ${HEIGHT*0.01}px
    padding-left: ${WIDTH*0.05}px
  
    border-color: ${EXTRALIGHT}
    margin-top: ${HEIGHT*0.03}px
    
`

export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    font-weight: 500
`

export const RowContainer = styled.Pressable`
    padding-vertical: ${HEIGHT*0.0175}px;
    width: ${WIDTH*0.9}px
    align-self: center
    border-bottom-width: 1px
    border-color: ${LIGHTGREY}
    align-items: center;
    flex-direction: row
   
`
export const RowName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    color: black
    margin-left: ${WIDTH*0.05}px
`
export const RowValueContainer = styled.Pressable`
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
`

export const RowValueText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    color: ${DARKGREY}
`
export const UpgradeContainer = styled.Pressable`
    width: ${WIDTH*0.9}px
    height: ${HEIGHT*0.1}px
    padding-horizontal: ${WIDTH*0.075}px
    align-self: center
    border-radius: 15px
    border-width: 1.5px
    border-color: ${MEDIUMGREY}
    margin-top: ${HEIGHT*0.02}px
    margin-bottom: ${HEIGHT*0.02}px
    flex-direction: row
    aling-items: center
    justify-content: center
`
export const UpgradeContainerLeft = styled.View`
    height: 100%
  
    justify-content: center
`
export const UpgradeContainerRight = styled.View`
    height: 100%
    padding-left: ${WIDTH*0.02}px
    justify-content: center
    
`

export const UpgradeContainerHeader = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: black
    font-weight: 500
`
export const UpgradeContainerSubheader = styled.Text`
    margin-top: ${HEIGHT*0.005}px
    font-size: ${HEIGHT*0.015}px
    width: ${WIDTH*0.65}px
    color: black
    font-weight: 400
`
