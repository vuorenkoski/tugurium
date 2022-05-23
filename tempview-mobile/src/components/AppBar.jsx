import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { Link } from "react-router-native";
import Constants from "expo-constants";
import useAuthStorage from "../hooks/useAuthStorage";
import { useApolloClient } from "@apollo/client";
import useGetUser from "../hooks/useGetUser";

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    backgroundColor: "black",
    alignContent: "space-around",
  },
  flexItem: {
    padding: 10,
  },
  text: { color: "white", fontSize: 16 },
});

const AppBarTab = (props) => {
  return (
    <View style={styles.flexItem}>
      <Link to={props.page}>
        <Text style={styles.text}>{props.text}</Text>
      </Link>
    </View>
  );
};

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const { user } = useGetUser();

  const logout = () => {
    authStorage.removeAccessToken();
    apolloClient.resetStore();
  };

  if (user) {
    return (
      <View style={styles.container}>
        <ScrollView horizontal>
          <AppBarTab text="Lämpötilat" page="/current" />
          <View style={styles.flexItem}>
            <Pressable onPress={logout}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab text="Kirjaudu" page="/login" />
      </ScrollView>
    </View>
  );
};

export default AppBar;
