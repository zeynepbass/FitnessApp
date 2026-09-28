import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import { saveDailySteps } from "../../helper/http";
import { toDateKey } from "../../helper/date";
import { colors } from "../../theme";

const KM_PER_STEP = 0.0008;
const KCAL_PER_STEP = 0.05;
const INACTIVITY_LIMIT_MS = 60 * 60 * 1000;
const INACTIVITY_CHECK_MS = 60 * 1000;

const toStats = (steps) => ({
  steps,
  calories: Math.round(steps * KCAL_PER_STEP),
  distance: steps * KM_PER_STEP,
});

export default function StepCounter({ userEmail }) {
  const [steps, setSteps] = useState(0);
  const [today, setToday] = useState(() => toDateKey());
  const [loaded, setLoaded] = useState(false);

  const stepsRef = useRef(0);
  const lastPedometerValueRef = useRef(0);
  const lastStepTimeRef = useRef(Date.now());
  const hasNotifiedRef = useRef(false);

  const storageKey = `stepData_${userEmail}`;

  useEffect(() => {
    if (!userEmail) return;
    let cancelled = false;
    setLoaded(false);

    const load = async () => {
      const currentDate = toDateKey();
      let initialSteps = 0;

      try {
        const raw = await AsyncStorage.getItem(storageKey);
        const stored = raw ? JSON.parse(raw) : null;

        if (stored?.date === currentDate) {
          initialSteps = stored.steps ?? 0;
        } else if (stored?.date) {
          saveDailySteps(userEmail, { ...toStats(stored.steps ?? 0), date: stored.date }).catch(
            () => {}
          );
        }
      } catch {
        initialSteps = 0;
      }

      if (cancelled) return;
      stepsRef.current = initialSteps;
      setSteps(initialSteps);
      setToday(currentDate);
      setLoaded(true);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userEmail, storageKey]);

  useEffect(() => {
    if (!loaded || !userEmail) return;
    AsyncStorage.setItem(storageKey, JSON.stringify({ ...toStats(steps), date: today })).catch(
      () => {}
    );
  }, [loaded, userEmail, storageKey, steps, today]);

  useEffect(() => {
    if (!loaded || !userEmail) return;
    let subscription;
    let active = true;

    Pedometer.isAvailableAsync()
      .then((available) => {
        if (!available || !active) return;
        lastPedometerValueRef.current = 0;
        subscription = Pedometer.watchStepCount(({ steps: total }) => {
          const diff = total - lastPedometerValueRef.current;
          lastPedometerValueRef.current = total;
          if (diff <= 0) return;

          stepsRef.current += diff;
          setSteps(stepsRef.current);
          lastStepTimeRef.current = Date.now();
          hasNotifiedRef.current = false;
        });
      })
      .catch(() => {});

    return () => {
      active = false;
      subscription?.remove();
    };
  }, [loaded, userEmail]);

  useEffect(() => {
    if (!loaded || !userEmail) return;
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const timeout = setTimeout(() => {
      saveDailySteps(userEmail, { ...toStats(stepsRef.current), date: today }).catch(() => {});
      stepsRef.current = 0;
      setSteps(0);
      setToday(toDateKey(nextMidnight));
    }, nextMidnight.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, [loaded, userEmail, today]);

  useEffect(() => {
    if (!userEmail) return;
    const interval = setInterval(() => {
      if (hasNotifiedRef.current) return;
      if (Date.now() - lastStepTimeRef.current < INACTIVITY_LIMIT_MS) return;

      hasNotifiedRef.current = true;
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Hareketsiz kaldın!",
          body: `Son adım sayın: ${stepsRef.current} 🚶‍♂️`,
        },
        trigger: null,
      }).catch(() => {});
    }, INACTIVITY_CHECK_MS);

    return () => clearInterval(interval);
  }, [userEmail]);

  const { calories, distance } = toStats(steps);
  const stats = [
    { label: "Adım", value: steps, unit: "adım" },
    { label: "Kalori", value: calories, unit: "kcal" },
    { label: "Mesafe", value: distance.toFixed(2), unit: "km" },
  ];

  return (
    <View style={styles.container}>
      {stats.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {item.value}
          </Text>
          <Text style={styles.unit}>{item.unit}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 20,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  label: {
    color: colors.text,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 4,
  },
  unit: {
    color: colors.primary,
    fontSize: 12,
  },
});
