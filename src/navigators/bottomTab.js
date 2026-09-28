import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import HomeScreen from "../screens/HomeScreen";
import ActivityScreen from "../screens/ActivityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoadingScreen from "../screens/LoadingScreen";
import { getStoredUser } from "../helper/session";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.dark,
  },
};

const tabIcon =
  (name) =>
  ({ size, color }) => <Feather name={name} size={size} color={color} />;

const BottomTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerTransparent: true,
        headerTitleAlign: "center",
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={styles.headerTitle}>FitnessApp</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
              hitSlop={8}
              accessibilityLabel="Bildirimler"
            >
              <MaterialIcons name="sports-gymnastics" size={24} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("DetailsScreen")}
              hitSlop={8}
              accessibilityLabel="Profili düzenle"
            >
              <Feather name="settings" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.light,
        tabBarStyle: [styles.tabBar, { marginBottom: Math.max(insets.bottom, 16) }],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: tabIcon("home") }} />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarIcon: tabIcon("activity") }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon("user") }}
      />
    </Tab.Navigator>
  );
};

const transparentHeader = {
  title: "",
  headerTransparent: true,
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: colors.text,
};

const MainNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={user ? "HomeMain" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeMain" component={BottomTab} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="DetailsScreen"
          component={DetailsScreen}
          options={{ ...transparentHeader, headerShown: true }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ ...transparentHeader, headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingRight: 16,
  },
  tabBar: {
    position: "absolute",
    height: 56,
    paddingBottom: 0,
    marginHorizontal: 20,
    borderRadius: 20,
    borderTopWidth: 0,
    backgroundColor: colors.tabBar,
  },
});

export default MainNavigator;
