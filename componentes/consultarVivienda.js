import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Picker, Image, ActivityIndicator, FlatList } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import IconFeather from 'react-native-vector-icons/Feather';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
function Consultar() {
    const [selectCasa, selectCasaSelected] = useState("Seleccione Casa");
    const netInfo = useNetInfo();
    const [inmuebles, setInmuebles] = useState([]);
    const [cargaData, setCargaData] = useState(true);

    let estadoConexion = netInfo.isConnected.toString();
    const getDataVivienda = async (valorPicker) => {
        selectCasaSelected(valorPicker);
        console.log("Haciendo get" + valorPicker);
        /* Se Realizar Fecth */
        let inmueble = valorPicker;
        fetch('https://grupohexxa.cl/inmobiliaria/getDetalleVivienda.php?inmueble=' + inmueble)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);

                setInmuebles(responseJson);
            })

            .catch((error) => {
                console.log(error)
            })
            .finally(() => setCargaData(false));

    }




    function dataEncontrada() {
        return (
            <View>
                <Text>Hola</Text>
            </View>
        )
    }


    return (
        <View>
            {
                estadoConexion == "true" ?
                    <View>
                        <Text style={styles.labelFormulario}>CASA:</Text>
                        <RNPickerSelect
                            selectedValue={selectCasa}
                            style={styles.pickerFormulario}
                            onValueChange={(itemValue) => getDataVivienda(itemValue)} 
                            items={[
                                { label: '2B 6 Mallorca', value: '2B_6_Mallorca' },
                                { label: "2B 6 Mallorca", value: "2B_6_Mallorca" },
                                { label: "2B 7 Santorini", value: "2B_7_Santorini" },
                                { label: "3B 8 Mallorca", value: "3B_8_Mallorca" },
                                { label: "3B 9 Capri", value: "3B_9_Capri" },
                                { label: "3B 10 Santorini", value: "3B_10_Santorini" },
                                { label: "4B 11 Mallorca", value: "4B_11_Mallorca" },
                                { label: "2D 6 Santorini", value: "2D_6_Santorini" },
                                { label: "2D 7 Mallorca", value: "2D_7_Mallorca" },
                                { label: "3D 8 Santorini", value: "3D_8_Santorini" },
                                { label: "3D 9 Mallorca", value: "3D_9_Mallorca" }
                            ]}
                        />

                        {/* <Picker
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
                            </Picker> */}
                            <SafeAreaView>
                                {cargaData ? (
                                    <ActivityIndicator></ActivityIndicator>
                                ) : (
                                        <FlatList
                                            data={inmuebles}
                                            keyExtractor={inmueble => inmueble.id_formulario}
                                            renderItem={({ item }) => (
                                                <Card style={{ flex: 0 }}>
                                                    <CardItem>
                                                        <Left>
                                                            <IconFeather name="archive" size={20} />
                                                            <Body>
                                                                <Text>{item.nombre_inmueble}</Text>
                                                                <Text>{item.recinto}</Text>
                                                                <Text>{item.aspecto}</Text>
                                                                <Text note>{item.fechaIngreso}</Text>
                                                            </Body>
                                                        </Left>
                                                    </CardItem>
                                                    <CardItem>
                                                        <Body>
                                                            <Image source={{ uri: item.imagen1 }} style={{ height: 200, width: '100%', flex: 1,borderRadius:40 }} />
                                                            <Text>{item.observacion}</Text>
                                                        </Body>
                                                    </CardItem>
                                                    <CardItem>
                                                        <Left>
                                                            <Button transparent textStyle={{ color: '#87838B' }}>
                                                                <IconFeather name="clipboard" size={20} />
                                                                <Text>Estado: {item.estado}</Text>
                                                            </Button>
                                                        </Left>
                                                    </CardItem>
                                                </Card>
                                            )}
                                        >

                                        </FlatList>
                                    )}
                            </SafeAreaView>
                    </View> :
                    <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            <IconFeather size={150} name="wifi-off"></IconFeather>
                            <Text>No tienes Acceso a Internet</Text>
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