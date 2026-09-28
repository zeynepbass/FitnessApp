import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import Screen from "./Screen";
import StepsLimit from "./StepsLimit";
import { getDailySteps, getUserProfile } from "../helper/http";
import { getStoredUser } from "../helper/session";
import { formatDateKey } from "../helper/date";
import { CONTENT_MAX_WIDTH, colors } from "../theme";

const CHART_DAYS = 7;

const sliceColors = [
  "rgb(201,235,100)",
  "rgb(156,193,43)",
  "rgb(255,159,67)",
  "rgb(90,90,90)",
  "rgb(52,172,224)",
  "rgb(255,105,180)",
  "rgb(155,89,182)",
];

const chartConfig = {
  color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  labelColor: () => colors.text,
};

export default function Activity() {
  const { width } = useWindowDimensions();
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        const user = await getStoredUser();
        const [steps, profile] = await Promise.all([
          getDailySteps(user?.email),
          getUserProfile(user?.uid),
        ]);
        if (cancelled) return;
        setData(steps);
        setGoals(profile);
      };

      load().catch(() => {});
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const pieData = useMemo(
    () =>
      [...data]
        .filter((item) => item.steps > 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-CHART_DAYS)
        .map((item, index) => ({
          name: formatDateKey(item.date, { day: "numeric", month: "short" }),
          population: item.steps,
          calories: item.calories,
          color: sliceColors[index % sliceColors.length],
          legendFontColor: colors.text,
          legendFontSize: 12,
        })),
    [data]
  );

  const chartSize = Math.min(width, CONTENT_MAX_WIDTH) - 40;

  return (
    <Screen>
      <StepsLimit steps={goals?.steps} calories={goals?.calories} />

      <Text style={styles.title}>Günlük Adım Dağılımı</Text>

      {pieData.length ? (
        <View style={styles.chartWrapper}>
          <PieChart
            data={pieData}
            width={chartSize}
            height={Math.min(chartSize, 260)}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft={String(chartSize / 4)}
            hasLegend={false}
          />

          <View style={styles.legend}>
            {pieData.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => setSelectedItem(item)}
                style={styles.legendItem}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>Henüz adım verisi yok</Text>
      )}

      <Modal
        transparent
        visible={!!selectedItem}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <Text style={styles.modalValue}>{selectedItem?.population} adım</Text>
            <Text style={styles.modalValue}>{selectedItem?.calories ?? 0} kcal</Text>

            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  chartWrapper: {
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 6,
    padding: 6,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    color: colors.text,
    fontSize: 14,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 20,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    marginBottom: 8,
  },
  modalValue: {
    color: colors.primary,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  closeText: {
    fontWeight: "bold",
  },
});
