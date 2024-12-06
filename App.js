import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [userName, setUserName] = useState("");

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Ative a localização para continuar.");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const saveLocation = async () => {
    if (!userName || !location) {
      Alert.alert("Erro", "Preencha todos os campos e obtenha a localização.");
      return;
    }
    try {
      const response = await fetch("http://192.168.100.7:3000/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      if (response.ok) {
        Alert.alert("Sucesso", "Localização salva com sucesso!");
      } else {
        const errorText = await response.text();
        Alert.alert("Erro", `Erro da API: ${errorText}`);
      }
    } catch (error) {
      Alert.alert("Erro de conexão", `Erro: ${error.message}`);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Localização</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={userName}
        onChangeText={setUserName}
      />
      <Button title="Obter Localização" onPress={getLocation} />
      {location && (
        <Text style={styles.location}>
          Latitude: {location.latitude} | Longitude: {location.longitude}
        </Text>
      )}
      <Button title="Salvar Localização" onPress={saveLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20 },
  location: { marginTop: 10, textAlign: "center" },
});
