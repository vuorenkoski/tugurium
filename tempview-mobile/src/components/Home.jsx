import Text from "./Text";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigate } from "react-router-native";

const Home = () => {
  const navigate = useNavigate();
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    text: {
      color: "blue",
      fontSize: 24,
      fontWeight: "700",
    },
  });

  const onClick = async () => {
    try {
      navigate("/current", { exact: true });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onClick}>
        <Text fontWeight="bold" style={styles.text}>
          TEMPVIEW
        </Text>
      </Pressable>
    </View>
  );
};

export default Home;
