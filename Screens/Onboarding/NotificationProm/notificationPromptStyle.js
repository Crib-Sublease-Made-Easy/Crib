import { WIDTH, HEIGHT, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR, MEDIUMGREY, DARKGREY,  } from '../../../sharedUtils';
import styled from 'styled-components/native';


export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.035}px;
    font-weight: 500;
    width: ${WIDTH*0.9}px
    padding-left: ${WIDTH*0.1}px
`

export const ContentText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    width: ${WIDTH*0.8}px
    align-self: center
    margin-top: ${HEIGHT*0.02}px
`

export const NotRightNowText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    width: ${WIDTH*0.8}px
    align-self: center
    text-align:center
    color: ${DARKGREY}
    margin-top: ${HEIGHT*0.1}px
   
`