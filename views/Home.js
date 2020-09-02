import React from "react";
import {StatusBar} from "expo-status-bar";
import List from "../components/List";
import {StyleSheet, View, Text, SafeAreaView} from "react-native";



const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
