import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { setStoredUser } from "../helper/session";
import { getAuthErrorMessage } from "../helper/authErrors";
import AuthLayout, { authStyles } from "./AuthLayout";
import { colors } from "../theme";

const Login = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key) => (value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const login = async () => {
    const email = formData.email.trim();
    const { password } = formData;

    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    setSubmitting(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await setStoredUser(user);
      navigation.reset({ index: 0, routes: [{ name: "HomeMain" }] });
    } catch (error) {
      Alert.alert("Hata", getAuthErrorMessage(error, "Giriş başarısız, bilgileri kontrol et."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Giriş Yap">
      <TextInput
        value={formData.email}
        placeholder="Email"
        style={authStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholderTextColor={colors.light}
        onChangeText={updateField("email")}
      />
      <TextInput
        value={formData.password}
        placeholder="Parola"
        style={authStyles.input}
        autoCapitalize="none"
        autoComplete="password"
        placeholderTextColor={colors.light}
        secureTextEntry
        onChangeText={updateField("password")}
        onSubmitEditing={login}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[authStyles.link, { textAlign: "right" }]}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[authStyles.button, submitting && authStyles.buttonDisabled]}
        onPress={login}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.dark} />
        ) : (
          <Text style={authStyles.buttonText}>Giriş yap</Text>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Login;
