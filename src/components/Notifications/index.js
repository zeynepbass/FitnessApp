import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Screen from "../Screen";
import { toDateKey } from "../../helper/date";
import { colors } from "../../theme";

const LATEST_KEY = "latestNotification";
const DAILY_NOTIFICATION_ID = "daily-motivation";

const motivationalMessages = [
  "Bugün harika bir gün olacak!",
  "Küçük adımlar büyük fark yaratır!",
  "Haydi kalk, hareket et ve enerji kazan!",
  "Başarı seninle, devam et!",
  "Her adım seni hedeflerine yaklaştırıyor!",
];

const getMessageForDay = (dateKey) => {
  const seed = dateKey.split("-").reduce((sum, part) => sum + Number(part), 0);
  return motivationalMessages[seed % motivationalMessages.length];
};

const scheduleDailyNotification = async () => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduled.some((item) => item.identifier === DAILY_NOTIFICATION_ID)) return;

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIFICATION_ID,
    content: {
      title: "Motivasyon Zamanı!",
      body: getMessageForDay(toDateKey()),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
};

export default function NotificationsScreen() {
  const [latest, setLatest] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const todayMessage = getMessageForDay(toDateKey());

  useEffect(() => {
    let active = true;

    const init = async () => {
      const stored = await AsyncStorage.getItem(LATEST_KEY);
      if (stored && active) setLatest(JSON.parse(stored));

      const { status } = await Notifications.requestPermissionsAsync();
      if (!active) return;
      if (status !== "granted") {
        setPermissionDenied(true);
        return;
      }
      await scheduleDailyNotification();
    };

    init().catch(() => {});

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      const received = { title, body, time: new Date().toISOString() };
      setLatest(received);
      AsyncStorage.setItem(LATEST_KEY, JSON.stringify(received)).catch(() => {});
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bugünün Sözü</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Motivasyon Zamanı!</Text>
        <Text style={styles.cardBody}>{todayMessage}</Text>
      </View>

      {latest && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{latest.title}</Text>
          <Text style={styles.cardBody}>{latest.body}</Text>
          <Text style={styles.cardTime}>{new Date(latest.time).toLocaleString("tr-TR")}</Text>
        </View>
      )}

      {permissionDenied && (
        <Text style={styles.hint}>
          Günlük hatırlatmaları almak için bildirim iznini ayarlardan açabilirsin.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  cardBody: {
    color: colors.text,
    marginBottom: 5,
  },
  cardTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  hint: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 10,
  },
});
