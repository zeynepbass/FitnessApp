import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>Yükleniyor...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  text: {
    color: colors.text,
    marginTop: 10,
    fontSize: 18,
  },
});

export default LoadingScreen;
