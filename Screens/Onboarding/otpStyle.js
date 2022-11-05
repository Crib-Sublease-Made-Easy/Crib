import {
    Dimensions, 
  } from 'react-native';
import styled from 'styled-components/native';
import React, {useRef, useState} from 'react'



const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#8559E3'

const PRIMARYGREY = '#5e5d5d'


export const StandardButtonStyle = {width: WIDTH*0.3, height: HEIGHT*0.04, backgroundColor:PRIMARYCOLOR, borderRadius:10, 
                                    justifyContent:'center', alignItems: 'center'}

export const StandardInputStyle = {borderBottomColor:'black', borderBottomWidth: 1, width: WIDTH*0.4, height: HEIGHT*0.05, 
                                   alignSelf: 'center'};

export const Container = styled.View`
  height: 100%;
  width: 100%;
  padding-top: ${HEIGHT*0.02}px;
  
  backgroundColor: white
`

export const Heading = styled.Text`
  color: black;
  fontWeight: 500
  fontSize: ${HEIGHT*0.05}px;
  padding-left: 10%;
`
export const PhoneNumberContainer = styled.View`
    height: ${HEIGHT*0.15}px;
    flex-direction: row
    padding-left: 10%;
    padding-right: 10%;
    align-items:center
    justify-content: space-between
`
export const ButtonText = styled.Text`
  color: white;
  fontSize: ${HEIGHT*0.017}px;
`


export const HeadingImageContainer = styled.View`
    width: ${WIDTH}px
    height: ${HEIGHT*0.25}px
  
`

export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.025}px;
    font-weight: 500
    color: white
`
export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.01}px
    font-size: ${HEIGHT*0.02}px;
    align-self: center
    color: ${PRIMARYGREY}
`

export const ContinueButton = styled.Pressable`
    width: ${WIDTH*0.7}px;
    height: ${ HEIGHT*0.07}px;
    background-color: ${PRIMARYCOLOR}
    align-self: center
    border-radius: 25px
    justify-content: center
    align-items: center
    margin-bottom: ${HEIGHT*0.075}px;
`

export const ModalView = styled.View`
    width: ${WIDTH*0.65}px;
    height: ${HEIGHT*0.3}px;
    padding-top: ${HEIGHT*0.025}px
    background-color: white
    border-radius: 20px
`

export const ModalHeaderText = styled.Text`
    width: ${WIDTH*0.8}px;
    
    font-size: ${HEIGHT*0.02}px;
    padding-left:${WIDTH*0.05}px;
    padding-left: ${WIDTH*0.05}px
    color: black
`

export const UserNumberText = styled.Text`
    margin-top: ${HEIGHT*0.05}px
    width: ${WIDTH*0.8}px;
    color: ${PRIMARYGREY}
    font-size: ${HEIGHT*0.025}px;
    padding-left:${WIDTH*0.05}px;
    padding-left: ${WIDTH*0.05}px
`
export const ModalOptionContainer = styled.View`
    flex-direction: row;
    height: ${HEIGHT*0.075}px;
    width: ${WIDTH*0.65}px;
    position: absolute;
    bottom:0
    padding-right: ${WIDTH*0.05}px
    justify-content: space-between 
`
export const ModalOption = styled.Pressable`
    width: ${WIDTH*0.325}px;
    height: ${HEIGHT*0.075}px;
    justify-content: center;
    align-items: center
   
`

//Following are all OTP input stuff

export const OTPInputContainer = styled.Pressable`
    width: ${WIDTH*0.9}px;
    flex-direction: row;
    justify-content: space-around;
    margin-top: ${HEIGHT*0.03}px
`

export const HiddenTextInput = styled.TextInput`
    border-color: ${PRIMARYCOLOR}
    border-width: 2px;
    border-radius: 5px;
    padding: ${HEIGHT*0.007}px;
    width: ${WIDTH*0.7}px;
    color: black
    display: none
`

export const OTPInputSection = styled.View`
    align-items: center;
    width: ${WIDTH}px;
  
`

export const OTPInput = styled.View`
    background-color: #E0E0E0
    min-width: ${WIDTH*0.12}px
    justify-content: center
    border-radius: 15px;
    height: ${HEIGHT*0.07}px
    
`

export const OTPInputText = styled.Text`
    fontSize: 22px;
    font-weight: bold;
    text-align: center;
    color: #737070

`

export default OTPInputField = ({setPinReady, code, setCode, maxLength}) => {
    const textInputRef = useRef(null)
    const codeDigitsArray = new Array(maxLength).fill(0)
    const [inputContainerIsFocused, setinputContainerIsFocused] = useState(false)

    const toCodeDigitInput = (value, index) => {
        const emptyInputChar = "";
        const digit = code[index] || emptyInputChar

        return(
            <OTPInput key={index}>
                <OTPInputText>{digit}</OTPInputText>
            </OTPInput>
        )
    }

    const handleOnPress = () => {
        setinputContainerIsFocused(true);
        textInputRef?.current?.focus();
    }
    const handleBlur = () => {
        setinputContainerIsFocused(false)
    }
    return(
        <OTPInputSection>
            <OTPInputContainer onPress={handleOnPress}>
                {codeDigitsArray.map(toCodeDigitInput)}
            </OTPInputContainer>
            <HiddenTextInput
                value={code}
                onChangeText={setCode}
                maxLength={maxLength}
                keyboardType="number-pad"
                returnKeyType="done"
                ref={textInputRef}
                onBlur={handleBlur}
                
                
            />
        </OTPInputSection>
    )
}