import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "userToken";

export const getStoredUser = async () => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = ({ uid, email, displayName }) =>
  AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ uid, email, displayName }));

export const clearStoredUser = () => AsyncStorage.removeItem(SESSION_KEY);
