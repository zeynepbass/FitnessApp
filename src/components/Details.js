import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Screen from "./Screen";
import { getUserProfile, updateUserProfile } from "../helper/http";
import { getStoredUser } from "../helper/session";
import { colors } from "../theme";

const fields = [
  { key: "age", placeholder: "Yaş" },
  { key: "height", placeholder: "Boy (cm)" },
  { key: "weight", placeholder: "Kilo (kg)" },
];

const toInputValue = (value) => (value ? String(value) : "");

const Details = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ age: "", height: "", weight: "", image: "" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const storedUser = await getStoredUser();
      const profile = await getUserProfile(storedUser?.uid);
      if (cancelled) return;
      setUser(storedUser);
      if (profile) {
        setFormData({
          age: toInputValue(profile.age),
          height: toInputValue(profile.height),
          weight: toInputValue(profile.weight),
          image: profile.image ?? "",
        });
      }
    };

    load().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const save = async () => {
    const values = fields.map(({ key }) => Number(formData[key]));

    if (fields.some(({ key }) => !formData[key])) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
      Alert.alert("Hata", "Yaş, boy ve kilo pozitif sayı olmalı!");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı!");
      return;
    }

    const [age, height, weight] = values;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        email: user.email,
        name: user.displayName || "Bilinmiyor",
        age,
        height,
        weight,
        image: formData.image,
      });
      Alert.alert("Başarılı", "Profil bilgilerin kaydedildi!");
      navigation.goBack();
    } catch {
      Alert.alert("Hata", "Profil kaydedilemedi, tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const photoSize = Math.min(width * 0.5, 240);

  return (
    <Screen>
      <Text style={styles.headerText}>Profil Bilgilerini Düzenle</Text>

      {formData.image ? (
        <Image
          source={{ uri: formData.image }}
          style={[styles.photo, { width: photoSize, height: photoSize }]}
        />
      ) : (
        <Text style={styles.noPhotoText}>Fotoğraf seçilmedi</Text>
      )}

      <TouchableOpacity onPress={pickImage} style={[styles.photoButton, { width: photoSize }]}>
        <Text style={styles.photoButtonText}>
          {formData.image ? "Fotoğrafı Değiştir" : "Fotoğraf Seç"}
        </Text>
      </TouchableOpacity>

      {fields.map(({ key, placeholder }) => (
        <TextInput
          key={key}
          value={formData[key]}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          style={styles.input}
          placeholderTextColor={colors.light}
          onChangeText={(value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        />
      ))}

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={save}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={colors.dark} />
        ) : (
          <Text style={styles.saveButtonText}>Güncelle</Text>
        )}
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerText: {
    paddingVertical: 20,
    textAlign: "center",
    color: colors.text,
    fontSize: 20,
  },
  photo: {
    margin: 10,
    alignSelf: "center",
    borderRadius: 10,
  },
  noPhotoText: {
    color: colors.text,
    textAlign: "center",
    padding: 5,
  },
  photoButton: {
    backgroundColor: colors.light,
    padding: 10,
    margin: 10,
    alignSelf: "center",
    borderRadius: 8,
  },
  photoButtonText: {
    color: colors.dark,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.dark,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Details;
