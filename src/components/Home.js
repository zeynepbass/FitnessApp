import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Screen from "./Screen";
import Steps from "./Steps";
import Filtered from "./Steps/filtered";
import List from "./Steps/list";
import { getDailySteps } from "../helper/http";
import { getStoredUser } from "../helper/session";
import { colors } from "../theme";

const Home = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    getStoredUser().then(setUser);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!user?.email) return;
      let cancelled = false;

      getDailySteps(user.email)
        .then((result) => {
          if (!cancelled) setData(result);
        })
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    }, [user?.email])
  );

  const filteredData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
    return active ? sorted.filter((item) => item.date === active) : sorted;
  }, [data, active]);

  return (
    <Screen>
      <Text style={styles.greeting}>Merhaba, {user?.displayName || "Kullanıcı"}</Text>
      <Text style={styles.welcome}>Fitness'a Hoşgeldin!</Text>

      <Steps userEmail={user?.email} />
      <Filtered active={active} onSelect={setActive} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <List data={filteredData} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    padding: 5,
  },
  welcome: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    padding: 5,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 10,
  },
});

export default Home;
