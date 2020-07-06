import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Picker,
    TextInput,
    ToastAndroid,
    Alert,
    Image

} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { useNetInfo } from "@react-native-community/netinfo";
import IconFeather from 'react-native-vector-icons/Feather';
function Consultar() {
    const [selectCasa, selectCasaSelected] = useState("Seleccione Casa");
    const netInfo = useNetInfo();
    let estadoConexion = netInfo.isConnected.toString();
    const getDataVivienda = async (valorPicker) => {
        selectCasaSelected(valorPicker);
        console.log("Haciendo get" + valorPicker);
        /* Se Realizar Fecth */
    }
    return (
        <View>
            {
                estadoConexion == "true" ?
                    <View>
                        <Text style={styles.labelFormulario}>CASA:</Text>
                        <Picker
                            selectedValue={selectCasa}
                            style={styles.pickerFormulario}
                            onValueChange={(itemValue) => getDataVivienda(itemValue)} >
                            <Picker.Item label="Seleccione Casa" value="" />
                            <Picker.Item label="2B 6 Mallorca" value="2B_6_Mallorca" />
                            <Picker.Item label="2B 7 Santorini" value="2B_7_Santorini" />
                            <Picker.Item label="3B 8 Mallorca" value="3B_8_Mallorca" />
                            <Picker.Item label="3B 9 Capri" value="3B_9_Capri" />
                            <Picker.Item label="3B 10 Santorini" value="3B_10_Santorini" />
                            <Picker.Item label="4B 11 Mallorca" value="4B_11_Mallorca" />
                            <Picker.Item label="2D 6 Santorini" value="2D_6_Santorini" />
                            <Picker.Item label="2D 7 Mallorca" value="2D_7_Mallorca" />
                            <Picker.Item label="3D 8 Santorini" value="3D_8_Santorini" />
                            <Picker.Item label="3D 9 Mallorca" value="3D_9_Mallorca" />
                        </Picker>
                       
                    </View> :
                    <View style={{marginTop:100 ,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                       <IconFeather size={150} name="wifi-off"></IconFeather>
                        <Text>No tienes Accesso a Internet</Text>
                    </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({

    labelFormulario: {
        fontSize: 15,
        marginTop: 20,
        color: 'black',
        marginLeft: 10
    },
    pickerFormulario: {
        height: 50,
        width: 500,
        color: 'black',

        // borderColor:'blue'
    },

});


export default Consultar;