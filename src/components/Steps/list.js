import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formatDateKey } from "../../helper/date";
import { colors } from "../../theme";

const List = ({ data }) => {
  if (!data.length) {
    return <Text style={styles.empty}>Henüz veri yok</Text>;
  }

  return (
    <View>
      {data.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.dateColumn}>
            <View style={styles.iconBadge}>
              <FontAwesome name="calendar" size={20} color={colors.dark} />
            </View>
            <Text style={styles.text}>{formatDateKey(item.date)}</Text>
          </View>
          <View>
            <Text style={styles.text}>Adım: {item.steps ?? 0}</Text>
            <Text style={styles.text}>Kalori: {item.calories ?? 0} kcal</Text>
            <Text style={styles.text}>Mesafe: {Number(item.distance ?? 0).toFixed(2)} km</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  dateColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  iconBadge: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 10,
  },
  text: {
    color: colors.text,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: colors.text,
  },
});

export default List;
