import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateGoals } from "../helper/http";
import { colors } from "../theme";

const toInputValue = (value) => (value ? String(value) : "");

const GoalModal = ({ open, setOpen, uid, initialSteps, initialCalories, onUpdate }) => {
  const [formData, setFormData] = useState({ steps: "", calories: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ steps: toInputValue(initialSteps), calories: toInputValue(initialCalories) });
    }
  }, [open, initialSteps, initialCalories]);

  const close = () => setOpen(false);

  const handleSave = async () => {
    const steps = Number(formData.steps);
    const calories = Number(formData.calories);

    if (!formData.steps || !formData.calories) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    if (!Number.isInteger(steps) || !Number.isInteger(calories) || steps <= 0 || calories <= 0) {
      Alert.alert("Hata", "Hedefler pozitif tam sayı olmalı!");
      return;
    }

    if (!uid) {
      Alert.alert("Hata", "Kullanıcı bilgisi bulunamadı!");
      return;
    }

    setSaving(true);
    try {
      await updateGoals(uid, steps, calories);
      onUpdate(steps, calories);
      close();
    } catch {
      Alert.alert("Hata", "Hedefler kaydedilemedi, tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Düzenle</Text>

          <TextInput
            value={formData.steps}
            placeholder="Adım"
            keyboardType="number-pad"
            placeholderTextColor={colors.light}
            style={styles.input}
            onChangeText={(steps) => setFormData((prev) => ({ ...prev, steps }))}
          />
          <TextInput
            value={formData.calories}
            placeholder="Kalori"
            keyboardType="number-pad"
            placeholderTextColor={colors.light}
            style={styles.input}
            onChangeText={(calories) => setFormData((prev) => ({ ...prev, calories }))}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[styles.button, styles.saveButton]}
            >
              {saving ? (
                <ActivityIndicator color={colors.dark} />
              ) : (
                <Text style={styles.buttonText}>Güncelle</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={close} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    color: colors.text,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.light,
  },
  buttonText: {
    color: colors.dark,
    fontSize: 16,
  },
});

export default GoalModal;
