import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, overlayGradient } from "../theme";

const AuthLayout = ({ title, children }) => (
  <ImageBackground source={require("../../assets/background.jpg")} style={styles.flex}>
    <LinearGradient colors={overlayGradient} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  </ImageBackground>
);

export const authStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.input,
    color: colors.text,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline",
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
    minWidth: 160,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: colors.form,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    paddingVertical: 20,
    textAlign: "center",
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default AuthLayout;
