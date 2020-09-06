import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Picker, ToastAndroid, Alert, Image, Modal, } from 'react-native';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Form, Item, Input, Textarea, Spinner } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import HeaderCustom from './header';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import IconFont from 'react-native-vector-icons/FontAwesome';
import shortid from 'shortid';
export default function Formulario({ guardarMostrarForm, cambiarNombreBoton, setRegistroArray, registroArray, guardarStorage }) {
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

        // Open Camera Library:

        ImagePicker.launchCamera(options, (response) => {
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
    const [modalVisible, setModalVisible] = useState(false);


    const netInfo = useNetInfo();
    /* Toast o Mensajes*/
    const toastFormularioAgregado = () => {
        ToastAndroid.show("Formulario Registrado", ToastAndroid.SHORT);
    };
    const toast = () => {
        ToastAndroid.show("Estás en Linea", ToastAndroid.SHORT);
    };

    const toastErrorSubida = () => {
        ToastAndroid.show("Hubo un error al guardar el registro.Intente más tarde.", ToastAndroid.SHORT);
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

    const alertaSicronizando = () =>
        Alert.alert(
            "Guardando Registro",
            [
                {

                },

            ],
            { cancelable: false }
        );


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





    // const eliminarDatos = async () => {
    //     try {
    //         await AsyncStorage.removeItem('registroAsync');
    //         console.log("Eliminado");
    //     } catch (e) {
    //         console.log(e);

    //     }
    // }



    // Mensaje de validacion de campos 

    const mensajeValidacionCampos = (campoIncompleto) =>
        Alert.alert(
            "IMPORTANTE",
            campoIncompleto,
            [
                {
                    text: "Ok",



                },

            ],
            { cancelable: false }
        );


    const mensajeValidacionInternet = () =>
        Alert.alert(
            "Sin Internet",
            "¿Deseas Guardar?, después tendrás que sicronizar la información",
            [
                {
                    text: "Ok",

                },

            ],
            { cancelable: false }
        );


    const abrirModalPost = () => {
        setModalVisible(true);
    }
    const cerrarModalPost = () => {
        setModalVisible(false);
    }

    enviarFomulario = async () => {

        // Validar campos 

        if (selectCasa.trim() === 'Seleccione Casa' || selectCasa.trim() === '') {
            mensajeValidacionCampos("Seleccione Casa");
        } else if (selectRecinto.trim() === 'Seleccione Recinto' || selectRecinto.trim() === '') {
            mensajeValidacionCampos("Seleccione Recinto");
        } else if (selectedValue.trim() === 'Seleccione Aspecto' || selectCasa.trim() === 'Seleccione') {
            mensajeValidacionCampos("Seleccione Aspecto");
        } else if (selectEstado.trim() === 'Seleccione Estado' || selectEstado.trim() === '') {
            mensajeValidacionCampos("Seleccione Estado");
        } else if (observationText.trim() === '') {
            mensajeValidacionCampos("Escriba algún observación");
        }
        else if (fotoUri.trim() === '') {
            mensajeValidacionCampos("Eliga una imagen.");
        } else {

            if (netInfo.isConnected.toString() === "true") {

                abrirModalPost();
                let url = "https://grupohexxa.cl/inmobiliaria/app.php";
                let UplodedFile = new FormData();
                console.log(url)
                UplodedFile.append('casa', selectCasa)
                UplodedFile.append('recinto', selectRecinto)
                UplodedFile.append('observacion', observationText)
                UplodedFile.append('estado', selectEstado)
                UplodedFile.append('aspecto', selectedValue)
                // UplodedFile.append('id', id)
                UplodedFile.append('submit', 'ok');
                UplodedFile.append('imagen', { type: 'image/jpg', uri: fotoUri, name: nombreFoto });
                console.log("ES" + JSON.stringify(UplodedFile));
                fetch(url, {
                    method: 'POST',
                    body: UplodedFile
                }).then(response => response.json())
                    .then(response => {

                        let respuestaServidor = JSON.stringify(response);
                        console.log(
                            "POST Response",
                            "Response Body -> " + JSON.stringify(response)
                        )
                        if (respuestaServidor == 1) {
                            cerrarModalPost();
                            toastFormularioAgregado();
                            guardarMostrarForm(false);
                            cambiarNombreBoton('Nueva Entrega');
                        } else {

                            cerrarModalPost();
                            toastErrorSubida();
                        }

                    }).catch((err) => {
                        console.log(err);
                        cerrarModalPost();
                        toastErrorSubida();
                    })
            } else {
                // toastDesconexion();
                mensajeValidacionInternet();
                /* Se crea un objeto donde almaceno el registro  */

                const registroVivienda = { selectCasa, selectRecinto, observationText, selectEstado, selectedValue, fotoUrl }

                registroVivienda.id = shortid.generate();
                console.log("Agregado" + registroVivienda)
                // // Agregar el registro al state 
                const registroNuevo = [...registroArray, registroVivienda];

                setRegistroArray(registroNuevo);
                guardarStorage(JSON.stringify(registroNuevo));

                // Esconder el formulario
                guardarMostrarForm(false);
                cambiarNombreBoton('Nueva Entrega');
                // alertaConexion();
            }
        }

    }

    const getPickerRecinto = async (valorPicker) => {

        console.log("Mostrar" + valorPicker);
        selectRecintoSelected(valorPicker);


    }

    if (selectRecinto == "Seleccione Recinto") {
        var aspectoValorPicker = ["Seleccione Aspecto"];
    } else if (selectRecinto == "Antejardín") {
        var aspectoValorPicker = ["Seleccione", "Acceso Peatonal", "Acceso Vehicular", "Camara Aguas Lluvia", "Camara UD", "Cesped y Plantas", "Port    on Metalico"];
    } else if (selectRecinto == "Baño Familiar") {
        var aspectoValorPicker = ["Seleccione", "Cabina de Ducha", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Elec-AP-Alcant-Gas)", "Vanitorio y Griferia", "Ventanas", "WC"];
    } else if (selectRecinto == "Baño Suite") {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos, molduras y sellos", "Pinturas Cielos", "Pintura Muros", "Pisos", "Puertas", "Pintura Muros", "Revestimiento muros", "Servicios (Elec-AP-Alcant-Gas)", "Tina", "Vanitorio y Griferia", "Ventanas", "WC"];
    } else if (selectRecinto == "Cocina") {
        var aspectoValorPicker = ["Seleccione", "Artefactos Electricos", "Cornisas", "Cubierta de Cuarzo", "Extracción/ Ventilación", "Guardapolvos y molduras", "Lavaplatos y grifería", "Muebles Base", "Muebles Colgantes", "Pintura Cielos", "Pintura Muros", "Pisos", "Revestimientos de muro", "Servicios (Elec-AP-Alcant-Gas)", "Ventanas"];
    } else if (selectRecinto == "Dormitorio 1 Suite") {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Rack TV", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == "Dormitorio 2") {
        var aspectoValorPicker = ["Seleccione", "Closet", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == "Dormitorio 3") {
        var aspectoValorPicker = ["Seleccione", "Closet", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Puertas", "Servicios (Electricidad)", "Ventanas"];
    } else if (selectRecinto == "Fachada Exterior ") {
        var aspectoValorPicker = ["Seleccione", "Adornos de Madera", "Celosias de Ventilación", "Muros de Hormigon", "Pilar de Hormigon", "Pilar de Madera", "Viga de Madera"];
    } else if (selectRecinto == "Hall de Acceso") {
        var aspectoValorPicker = ["Seleccione", "Cielo", "Jardinera", "Porcelanato", "Puerta de Acceso"];
    } else if (selectRecinto == "Hojalatería y Techumbre") {
        var aspectoValorPicker = ["Seleccione", "Bajadas de Agua", "Bajo Alero", "Canaletas", "Cubetas", "Hojalatería", "Planchas de Techumbre"];
    } else if (selectRecinto == "Instalaciones") {
        var aspectoValorPicker = ["Seleccione", "Aguas Lluvia", "Calefon", "Gabinete Calefon", "Iluminación Hall de Acceso", "Llave de Jardín", "Medidor Agua Potable", "Medidor de Gas", "Medidor Eléctrico", "puntos Iluminación Patio",];
    } else if (selectRecinto == "Living Comedor - Pasillo") {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos", "Servicios (Electricidad)", "Ventanas",];
    } else if (selectRecinto == "Pasillo de Acceso") {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Pintura Cielos", "Pintura Muros", "Pisos",];
    } else if (selectRecinto == "Patio") {
        var aspectoValorPicker = ["Seleccione", "Panderetas"];
    } else if (selectRecinto == "Walk in Closet") {
        var aspectoValorPicker = ["Seleccione", "Cornisas", "Guardapolvos", "Muebles", "Pintura Cielos", "Pintura Muros", "Pisos",];
    } else {
        var aspectoValorPicker = ["Seleccione"];
    }


    return (
        <View>
            <ScrollView>

                <View >
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Guardando Registro, espere.");
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Guardando Registro</Text>
                                <Spinner color='white' style={{ marginTop: 10 }} size={90} />

                            </View>
                        </View>
                    </Modal>

                    <Form style={{backgroundColor:'#dae1e7',borderRadius:35,marginTop:10,marginBottom:10}}>

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
                                <Picker.Item label="Seleccione Casa" value='' />
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
                                <Picker.Item label="Seleccione Recinto" value='' />
                                <Picker.Item label="Antejardín" value="Antejardín" />
                                <Picker.Item label="Baño Familiar" value="Baño Familiar" />
                                <Picker.Item label="Baño Suite" value="Baño Suite" />
                                <Picker.Item label="Cocina" value="Cocina" />
                                <Picker.Item label="Dormitorio 1 Suite" value="Dormitorio 1 Suite" />
                                <Picker.Item label="Dormitorio 2" value="Dormitorio 2" />
                                <Picker.Item label="Dormitorio 3" value="Dormitorio 3" />
                                <Picker.Item label="Fachada Exterior " value="Fachada Exterior " />
                                <Picker.Item label="Hall de Acceso" value="Hall de Acceso" />
                                <Picker.Item label="Hojalatería y Techumbre" value="Hojalatería y Techumbre" />
                                <Picker.Item label="Instalaciones" value="Instalaciones" />
                                <Picker.Item label="Living Comedor - Pasillo" value="Living Comedor - Pasillo" />
                                <Picker.Item label="Pasillo de Acceso" value="Pasillo de Acceso" />
                                <Picker.Item label="Patio" value="Patio" />
                                <Picker.Item label="Walk in Closet" value="Walk in Closet" />
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
                                    return (<Picker.Item label={item} value={item} key={item} />)
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
                                <Picker.Item label="Seleccione Estado" value='' />
                                <Picker.Item label="Cumple" value="Cumple" />
                                <Picker.Item label="No Cumple" value="No Cumple" />
                                <Picker.Item label="No Aplica" value="No Aplica" />

                            </Picker>
                        </View>
                        <Text style={styles.labelFormulario}>OBSERVACIONES:</Text>
                        <Textarea style={{
                            width: 300,
                            marginTop: 15,
                            marginLeft: 20,
                            marginRight: 20,
                        }} onChangeText={observationText => setObservation(observationText)} defaultValue={observationText} rowSpan={5} bordered placeholder="Ingrese observación" />
                        <Button success small onPress={foto} style={styles.botonFoto}><Text style={styles.textoFoto}>Elegir Foto <IconFont name="photo"></IconFont> </Text></Button>
                        {
                            fotoUrl.length == 0 ?
                                null :
                                <Image source={fotoUrl} style={styles.fotografia} />
                        }
                    </Form>
                    {/* <Button primary onPress={Send}><Text>Subir Imagen</Text></Button> */}


                    {/* <Button onPress={eliminarDatos} style={styles.botonAgregar} rounded primary>
                <Text style={styles.textAgregar}>Eliminar</Text>
            </Button> */}
                </View>
                <Button onPress={enviarFomulario} style={styles.botonAgregar} >
                    <Text style={styles.textAgregar}>Guardar</Text>
                </Button>
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
        textAlign: 'center',
        marginTop: 10,
        // width: '50%',
        // height: '8%',
        // marginLeft: 86,
        // marginBottom: 40,
        justifyContent: 'center',
        backgroundColor:'#2ec1ac'
    },
    botonFoto: {
        width: '50%',
        marginLeft: 86,
        marginTop: 10,
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:'#142850'
    },
    modalView: {
        margin: 20,
        backgroundColor: "#00909e",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color:'white'
    }
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