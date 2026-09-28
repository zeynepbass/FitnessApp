import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { toDateKey } from "../../helper/date";
import { colors } from "../../theme";

const DAY_COUNT = 7;

const getLastDays = () => {
  const today = new Date();
  return Array.from({ length: DAY_COUNT }, (_, index) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (DAY_COUNT - 1 - index));
    return {
      key: toDateKey(day),
      dayShort: day.toLocaleDateString("tr-TR", { weekday: "short" }),
      date: day.getDate(),
    };
  });
};

export default function Filtered({ active, onSelect }) {
  const days = useMemo(getLastDays, []);

  return (
    <View style={styles.container}>
      {days.map((item) => {
        const selected = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.card, selected && styles.cardActive]}
            onPress={() => onSelect(selected ? null : item.key)}
          >
            <Text style={[styles.dayText, selected && styles.textActive]} numberOfLines={1}>
              {item.dayShort}
            </Text>
            <View style={[styles.date, selected && styles.dateActive]}>
              <Text style={[styles.dateText, selected && styles.textActive]}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    elevation: 3,
  },
  cardActive: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontSize: 12,
  },
  date: {
    justifyContent: "center",
    alignItems: "center",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
  },
  dateActive: {
    backgroundColor: colors.text,
  },
  dateText: {
    fontSize: 12,
    color: colors.text,
  },
  textActive: {
    color: colors.dark,
  },
});
