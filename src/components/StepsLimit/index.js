import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";

const StepsLimit = ({ steps, calories }) => {
  const goals = [
    { label: "Adım Hedefi", value: steps },
    { label: "Kalori Hedefi", value: calories },
  ];

  return (
    <View style={styles.container}>
      {goals.map((goal) => (
        <View key={goal.label} style={styles.card}>
          <Text style={styles.label}>{goal.label}</Text>
          <Text style={styles.value}>{goal.value || "-"}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  label: {
    color: colors.text,
    marginBottom: 8,
  },
  value: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 18,
  },
});

export default StepsLimit;
