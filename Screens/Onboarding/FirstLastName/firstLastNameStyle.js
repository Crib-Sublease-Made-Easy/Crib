import { WIDTH, HEIGHT, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR, MEDIUMGREY, FONTFAMILY } from '../../../sharedUtils';
import styled from 'styled-components/native';

import {
    View,
    Pressable
} from 'react-native';

export const Header = styled.View`
  width: ${WIDTH*0.9}px
  height: ${HEIGHT*0.05}px
  justify-content: center;
  align-items: flex-start;
  align-self: center
 
`

export const ProgressBarContainer = styled(View)`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.05}px
`


export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.035}px;
    font-weight: 400;
    width: ${WIDTH*0.7}px
    padding-left: ${WIDTH*0.1}px
    font-family: ${FONTFAMILY}
`

export const TextInputContainer = styled.View`
    padding-top: ${HEIGHT*0.025}px
`

export const GeneralTextInput = styled.TextInput`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px
    border-bottom-width: 2px;
    padding-left: ${WIDTH*0.025}px
    border-color: ${TEXTINPUTBORDERCOLOR}
    align-self: center   
    font-family: ${FONTFAMILY}
    font-size: ${HEIGHT*0.02}px
`

