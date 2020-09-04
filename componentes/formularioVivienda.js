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
import { Container, Header, Title, Button, Left, Right, Body, Icon, Form, Item, Input, Textarea } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import HeaderCustom from './header';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import IconFont from 'react-native-vector-icons/FontAwesome';

export default function Formulario({ guardarMostrarForm, setRegistroArray, registroArray }) {
    const [fotoUrl, setFotoUrl] = useState('');
    foto = async () => {
        const options = {
            title: 'Eliga la imagen',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                takePhotoButtonTitle: 'Tomar una foto',
                chooseFromLibraryButtonTitle: 'Elegir desde la galería'
            },
        };
  
        // Open Image Library:

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri, nombre: response.fileName };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };


                setFotoUrl(source);
                // Send(source.uri);
                setFotoUri(source.uri);
                setNombreFoto(source.nombre);


            }
        });
    }


    /* VALORES DE INPUT, INCIADOS */
    const [selectCasa, selectCasaSelected] = useState("Seleccione Casa");
    const [selectRecinto, selectRecintoSelected] = useState("Seleccione Recinto");
    const [selectedValue, setSelectedValue] = useState("Seleccione Aspecto");
    const [selectEstado, selectEstadoSelected] = useState("Seleccione Estado");
    const [observationText, setObservation] = useState('');
    const [fotoUri, setFotoUri] = useState('');
    const [nombreFoto, setNombreFoto] = useState('');



    const netInfo = useNetInfo();
    /* Toast o Mensajes*/
    const toastFormularioAgregado = () => {
        ToastAndroid.show("Formulario Registrado", ToastAndroid.SHORT);
    };
    const toast = () => {
        ToastAndroid.show("Estás en Linea", ToastAndroid.SHORT);
    };

    const toastDesconexion = () => {
        ToastAndroid.show("Estás desconectado, a la espera de sicronizacion", ToastAndroid.SHORT);
    };


    const toastReconexion = () => {
        ToastAndroid.show("Nuevamente Conectado!, sicronizando", ToastAndroid.SHORT);
    };

    const toastGuardado = () => {
        ToastAndroid.show("Datos Guardado", ToastAndroid.SHORT);
    };


    // const alertaConexion = () =>
    //     Alert.alert(
    //         "SIN CONEXION",
    //         "¿Deseas Guardar?, se guardará de forma local",
    //         [
    //             {
    //                 text: "Cancel",
    //                 onPress: () => eliminarDatos(),
    //                 style: "cancel"

    //             },
    //             { text: "OK", onPress: () => [guardarStorage(), toastGuardado()] }
    //         ],
    //         { cancelable: false }
    //     );


    /* Mostrar los datos del Storage */

    useEffect(() => {
        const obtenerData = async () => {
            try {
                const registroStorage = await AsyncStorage.getItem('registroAsync');

            } catch (e) {
                // saving error
            }
        }
        obtenerData();

    }, []);





    const eliminarDatos = async () => {
        try {
            await AsyncStorage.removeItem('registroAsync');
            console.log("Eliminado");
        } catch (e) {
            console.log(e);

        }
    }

    const guardarStorage = async (registroJson) => {
        try {
            /* Guardar Datos de manera local */
            // const formularioArray = [selectCasa, selectRecinto, observationText];
            await AsyncStorage.setItem('registroAsync', registroJson);
            console.log("Agregado");

        } catch (e) {
            console.log(e);

        }
    }





    enviarFomulario = async () => {
        if (netInfo.isConnected.toString() === "true") {
            toast();
            let url = "https://grupohexxa.cl/inmobiliaria/app.php";
            let UplodedFile = new FormData();
            console.log(url)
            UplodedFile.append('casa', selectCasa)
            UplodedFile.append('recinto', selectRecinto)
            UplodedFile.append('observacion', observationText)
            UplodedFile.append('estado', selectEstado)
            UplodedFile.append('submit', 'ok');
            UplodedFile.append('imagen', { type: 'image/jpg', uri: fotoUri, name: nombreFoto });
            fetch(url, {
                method: 'POST',
                body: UplodedFile
            }).then(response => response.json())
                .then(response => {

                    console.log(
                        "POST Response",
                        "Response Body -> " + JSON.stringify(response)
                    )
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            // toastDesconexion();

            /* Se crea un objeto donde almaceno el registro  */

            const registroVivienda = { selectCasa, selectRecinto, observationText, selectEstado }

            // // Agregar el registro al state 
            const registroNuevo = [...registroArray, registroVivienda];
            setRegistroArray(registroNuevo);
            guardarStorage(JSON.stringify(registroNuevo));
            // Esconder el formulario
            guardarMostrarForm(false);
            // console.log("ES"+registroArray);
            // alertaConexion();
        }

    }

    const getPickerRecinto = async (valorPicker) => {

        console.log("Mostrar" + valorPicker);
        selectRecintoSelected(valorPicker);


    }

    if (selectRecinto == "Seleccione Recinto") {
        var aspectoValorPicker = ["Seleccione Aspecto"];
    } else if (selectRecinto == 1) {
        var aspectoValorPicker = ["Seleccione", "Acceso Peatonal", "Acceso Vehicular", "Camara Aguas Lluvia", "Camara UD", "Cesped y Plantas", "Port    on Metalico"];
    } else if (selectRecinto == 2) {
        var aspectoValorPicker = ["Seleccione", "Cabina de Ducha", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Elec-AP-Alcant-Gas)", "Vanitorio y Griferia", "Ventanas", "WC"];
    } else if (selectRecinto == 3) {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos, molduras y sellos", "Pinturas Cielos", "Pintura Muros", "Pisos", "Puertas", "Pintura Muros", "Revestimiento muros", "Servicios (Elec-AP-Alcant-Gas)", "Tina", "Vanitorio y Griferia", "Ventanas", "WC"];
    } else if (selectRecinto == 4) {
        var aspectoValorPicker = ["Seleccione", "Artefactos Electricos", "Cornisas", "Cubierta de Cuarzo", "Extracción/ Ventilación", "Guardapolvos y molduras", "Lavaplatos y grifería", "Muebles Base", "Muebles Colgantes", "Pintura Cielos", "Pintura Muros", "Pisos", "Revestimientos de muro", "Servicios (Elec-AP-Alcant-Gas)", "Ventanas"];
    } else if (selectRecinto == 5) {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Rack TV", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == 6) {
        var aspectoValorPicker = ["Seleccione", "Closet", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == 7) {
        var aspectoValorPicker = ["Seleccione", "Closet", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == 8) {
        var aspectoValorPicker = ["Seleccione", "Adornos de Madera", "Celosias de Ventilación", "Muros de Hormigon", "Pilar de Hormigon", "Pilar de Madera", "Viga de Madera"];
    } else if (selectRecinto == 9) {
        var aspectoValorPicker = ["Cielo", "Jardinera", "Porcelanato", "Puerta de Acceso"];
    } else if (selectRecinto == 10) {
        var aspectoValorPicker = ["Seleccione", "Bajadas de Agua", "Bajo Alero", "Canaletas", "Cubetas", "Hojalatería", "Planchas de Techumbre"];
    } else if (selectRecinto == 11) {
        var aspectoValorPicker = ["Seleccione", "Aguas Lluvia", "Calefon", "Gabinete Calefon", "Iluminación Hall de Acceso", "Llave de Jardín", "Medidor Agua Potable", "Medidor de Gas", "Medidor Eléctrico", "puntos Iluminación Patio",];
    } else if (selectRecinto == 12) {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Servicios (Electricidad)", "Ventanas",];
    } else if (selectRecinto == 13) {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos",];
    } else if (selectRecinto == 14) {
        var aspectoValorPicker = ["Seleccione", "Panderetas"];
    } else if (selectRecinto == 15) {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Muebles", "Pintura Cielos", "Pintura Muros", "Pisos",];
    } else {
        var aspectoValorPicker = ["TODOS"];
    }


    return (
        <View>
            <ScrollView>
                <Button onPress={enviarFomulario} style={styles.botonAgregar} rounded primary>
                    <Text style={styles.textAgregar}>Guardar</Text>
                </Button>
                <View>

                    <Form>

                        <Text style={styles.labelFormulario}>CASA:</Text>
                       <View style={{
                            width: 300,
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20,
                            borderColor: 'black',
                            borderBottomWidth: 1,
                            borderRadius: 10,
                            alignSelf: 'center'
                        }}>
                       <Picker
                            selectedValue={selectCasa}
                            style={styles.pickerFormulario}
                            onValueChange={(itemValue, itemIndex) => selectCasaSelected(itemValue)}
                        >
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
                       </View>
                        <Text style={styles.labelFormulario}>RECINTO:</Text>
                        <View style={{
                            width: 300,
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20,
                            borderColor: 'black',
                            borderBottomWidth: 1,
                            borderRadius: 10,
                            alignSelf: 'center'
                        }}>
                            <Picker
                                selectedValue={selectRecinto}
                                style={{ height: 50, width: 500, borderWidth: 1, borderColor: 'black' }}
                                onValueChange={(itemValue, itemIndex) => getPickerRecinto(itemValue)}
                            >
                                <Picker.Item label="Seleccione Recinto" value="0" />
                                <Picker.Item label="Antejardín" value="1" />
                                <Picker.Item label="Baño Familiar" value="2" />
                                <Picker.Item label="Baño Suite" value="3" />
                                <Picker.Item label="Cocina" value="4" />
                                <Picker.Item label="Dormitorio 1 Suite" value="5" />
                                <Picker.Item label="Dormitorio 2" value="6" />
                                <Picker.Item label="Dormitorio 3" value="7" />
                                <Picker.Item label="Fachada Exterior " value="8" />
                                <Picker.Item label="Hall de Acceso" value="9" />
                                <Picker.Item label="Hojalatería y Techumbre" value="10" />
                                <Picker.Item label="Instalaciones" value="11" />
                                <Picker.Item label="Living Comedor - Pasillo" value="12" />
                                <Picker.Item label="Pasillo de Acceso" value="13" />
                                <Picker.Item label="Patio" value="14" />
                                <Picker.Item label="Walk in Closet" value="15" />
                            </Picker>
                        </View>
                        <Text style={styles.labelFormulario}>ASPECTO A REVISAR:</Text>
                        <View style={{
                            width: 300,
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20,
                            borderColor: 'black',
                            borderBottomWidth: 1,
                            borderRadius: 10,
                            alignSelf: 'center'
                        }}>
                            <Picker
                                selectedValue={selectedValue}
                                style={{ height: 50, width: 500, borderWidth: 1, borderColor: 'black' }}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                            >
                                {aspectoValorPicker.map((item, index) => {
                                    return (<Picker.Item label={item} value={index} key={item} />)
                                })}

                            </Picker>
                        </View>
                        <Text style={styles.labelFormulario}>ESTADO DEL REQUERIMIENTO:</Text>
                        <View style={{
                            width: 300,
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20,
                            borderColor: 'black',
                            borderBottomWidth: 1,
                            borderRadius: 10,
                            alignSelf: 'center'
                        }}>
                            <Picker
                                selectedValue={selectEstado}
                                style={{ height: 50, width: 500, borderWidth: 1, borderColor: 'black' }}
                                onValueChange={(itemValue, itemIndex) => selectEstadoSelected(itemValue)}
                            >
                                <Picker.Item label="Seleccione Estado" value="0" />
                                <Picker.Item label="Cumple" value="Cumple" />
                                <Picker.Item label="No Cumple" value="No Cumple" />
                                <Picker.Item label="No Aplica" value="No Aplica" />

                            </Picker>
                        </View>
                        <Text style={styles.labelFormulario}>OBSERVACIONES:</Text>
                        <Textarea onChangeText={observationText => setObservation(observationText)} defaultValue={observationText} rowSpan={5} bordered placeholder="Ingrese observación" />
                        <Button success onPress={foto} style={styles.botonFoto}><Text style={styles.textoFoto}>Elegir Foto <IconFont name="photo"></IconFont> </Text></Button>
                        {
                            fotoUrl.length == 0 ?
                                <Text >No Hay Imagen Elegida</Text> :
                                <Image source={fotoUrl} style={styles.fotografia} />
                        }
                    </Form>
                    {/* <Button primary onPress={Send}><Text>Subir Imagen</Text></Button> */}


                    {/* <Button onPress={eliminarDatos} style={styles.botonAgregar} rounded primary>
                <Text style={styles.textAgregar}>Eliminar</Text>
            </Button> */}
                </View>
            </ScrollView>


        </View>




    );

}


const styles = StyleSheet.create({
    contenedorFormulario: {
        backgroundColor: '#36485f'
    },
    contenedor: {
        // backgroundColor: '#AA076B'
    },
    tituloFormulario: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 24,
        color: 'black',
        // marginBottom: 10
    },
    // formulario: {
    //     marginLeft: 5
    // },
    botonAgregar: {
        marginTop: 10,
        width: '100%',
        height: '8%',
        marginBottom: 40,
        justifyContent: 'center',

    },
    botonFoto: {
        justifyContent: 'center',
    },
    textoFoto: {
        color: 'white'
    },
    fotografia: {
        borderColor: 'black',
        borderWidth: 1,
        width: 300,
        height: 200,
        marginLeft: 30,
        marginTop: 10
    },
    textAgregar: {
        width: '100%',
        color: 'white',
        textAlign: 'center',

    },
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
    // inputForm: {
    //     marginTop: 10,
    //     height: 50,
    //     borderColor: '#E1E1',
    //     borderWidth: 1,
    //     borderStyle: 'solid',
    //     color: 'white',
    // }
});


// export default Formulario;