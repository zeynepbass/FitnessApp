import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getAuthErrorMessage } from "../helper/authErrors";
import AuthLayout, { authStyles } from "./AuthLayout";
import { colors } from "../theme";

const fields = [
  { key: "ad", placeholder: "Ad", autoCapitalize: "words" },
  { key: "soyad", placeholder: "Soyad", autoCapitalize: "words" },
  { key: "email", placeholder: "Email", keyboardType: "email-address" },
  { key: "confirmEmail", placeholder: "Email tekrar", keyboardType: "email-address" },
  { key: "password", placeholder: "Parola", secureTextEntry: true },
  { key: "confirmPassword", placeholder: "Parola tekrar", secureTextEntry: true },
];

const initialForm = fields.reduce((form, field) => ({ ...form, [field.key]: "" }), {});

const Register = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    const ad = formData.ad.trim();
    const soyad = formData.soyad.trim();
    const email = formData.email.trim();
    const confirmEmail = formData.confirmEmail.trim();
    const { password, confirmPassword } = formData;

    if (!ad || !soyad || !email || !confirmEmail || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      Alert.alert("Hata", "Email adresleri eşleşmiyor!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Parolalar eşleşmiyor!");
      return;
    }

    setSubmitting(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = `${ad} ${soyad}`;

      await updateProfile(user, { displayName });
      await setDoc(doc(db, "users", user.uid), {
        ad,
        soyad,
        displayName,
        email: user.email,
        createdAt: Date.now(),
      });
      await signOut(auth);

      Alert.alert("Başarılı", "Kayıt tamamlandı!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Hata", getAuthErrorMessage(error, "Kayıt işlemi başarısız oldu."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Kayıt Ol">
      {fields.map(({ key, ...inputProps }) => (
        <TextInput
          key={key}
          value={formData[key]}
          style={authStyles.input}
          autoCapitalize="none"
          placeholderTextColor={colors.light}
          onChangeText={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
          {...inputProps}
        />
      ))}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={authStyles.link}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[authStyles.button, submitting && authStyles.buttonDisabled]}
        onPress={handleRegister}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.dark} />
        ) : (
          <Text style={authStyles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Register;
