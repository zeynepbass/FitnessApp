import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Screen from "./Screen";
import GoalModal from "./GoalModal";
import StepsLimit from "./StepsLimit";
import { auth } from "../../firebase";
import { getUserProfile } from "../helper/http";
import { clearStoredUser, getStoredUser } from "../helper/session";
import { colors } from "../theme";

export default function Profile() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        const storedUser = await getStoredUser();
        const result = await getUserProfile(storedUser?.uid);
        if (cancelled) return;
        setUser(storedUser);
        setProfile(result);
      };

      load().catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const imageSize = Math.min(width, height, 480) * 0.3;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearStoredUser();
      const rootNavigation = navigation.getParent() ?? navigation;
      rootNavigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const stats = [
    {
      label: "Yaş",
      value: profile?.age,
      icon: <MaterialIcons name="emoji-people" size={20} color={colors.text} />,
    },
    {
      label: "Kilo",
      value: profile?.weight && `${profile.weight} kg`,
      icon: <FontAwesome5 name="weight" size={18} color={colors.text} />,
    },
    {
      label: "Boy",
      value: profile?.height && `${profile.height} cm`,
      icon: <AntDesign name="column-height" size={20} color={colors.text} />,
    },
  ];

  return (
    <Screen contentContainerStyle={styles.content}>
      {profile?.image ? (
        <Image
          source={{ uri: profile.image }}
          style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
        />
      ) : (
        <View
          style={[
            styles.avatarPlaceholder,
            { width: imageSize, height: imageSize, borderRadius: imageSize / 2 },
          ]}
        >
          <Feather name="user" size={imageSize * 0.45} color={colors.light} />
        </View>
      )}

      <Text style={styles.name}>{user?.displayName || profile?.displayName || "Kullanıcı"}</Text>

      <StepsLimit steps={profile?.steps} calories={profile?.calories} />

      <TouchableOpacity style={styles.editButton} onPress={() => setOpen(true)}>
        <Text style={styles.editButtonText}>Hedefleri Düzenle</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        {stats.map((item) => (
          <View key={item.label} style={styles.card}>
            <View style={styles.cardHeader}>
              {item.icon}
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={styles.value}>{item.value || "-"}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessibilityLabel="Çıkış yap"
      >
        <AntDesign name="logout" size={24} color={colors.dark} />
      </TouchableOpacity>

      <GoalModal
        open={open}
        setOpen={setOpen}
        uid={user?.uid}
        initialSteps={profile?.steps}
        initialCalories={profile?.calories}
        onUpdate={(steps, calories) => setProfile((prev) => ({ ...prev, steps, calories }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  avatarPlaceholder: {
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    color: colors.text,
    marginVertical: 12,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  editButtonText: {
    color: colors.dark,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginVertical: 24,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  label: {
    color: colors.text,
    fontSize: 14,
  },
  value: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgb(155, 181, 76)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
