import {
    Dimensions, 
  } from 'react-native';
import styled from 'styled-components/native';

const PRIMARYCOLOR = '#4050B5'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const profileImagePlacerStyle = {width:WIDTH*0.5, height: WIDTH*0.5, borderRadius: HEIGHT*0.25, backgroundColor:'#BEC2DD', alignSelf:'center', marginTop:HEIGHT*0.04};

export const StandardInputStyle = {borderBottomColor:'black', borderBottomWidth: 1, width: WIDTH*0.8, height: HEIGHT*0.05, 
                                   marginTop: HEIGHT*0.02, alignSelf: 'center'};


export const StandardButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor:PRIMARYCOLOR, borderRadius:15, 
                                    marginTop: HEIGHT*0.04, justifyContent:'center', alignItems: 'center'}

export const PhoneInputStyle = {borderBottomColor:'black', borderBottomWidth: 1, width: WIDTH*0.5, height: HEIGHT*0.05,};

export const Container = styled.View`
  height: 100%;
  width: 100%;
  padding-top: ${HEIGHT*0.02}px;
  backgroundColor: white;
  padding-left: 10%;
  padding-right: 10%;
`
export const Heading = styled.Text`
  color: ${PRIMARYCOLOR};
  fontWeight: 500
  fontSize: ${HEIGHT*0.05}px;
`

export const SignupForm = styled.View`
  height: 100%;
  width: 100%;
`

export const ButtonText = styled.Text`
  color: white;
  fontSize: ${HEIGHT*0.02}px;
`

export const AgeInputContainer = styled.View`
  width: 100%
  height: 10%;
  justify-Content: space-between
  align-items: center
  flex-direction: row
  margin-top: ${HEIGHT*0.04}px;
`

export const TermsAndServicesContainer = styled.View`
  fontSize: ${HEIGHT*0.01}px;
  margin-top: ${HEIGHT*0.04}px;
`

export const LoginContainer = styled.View`
  height: 10%; 
  align-items: center;
  justify-Content: center;
  flex-direction: row
`
