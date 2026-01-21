import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

export default function Analytics() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSub}>
          Insights & performance
        </Text>
      </LinearGradient>

      {/* 🚧 COMING SOON */}
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Feather name="bar-chart-2" size={48} color="#7860E3" />
        </View>

        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          We're building powerful analytics to show your
          feedback impact and earnings growth 📈
        </Text>

        <View style={styles.features}>
          <Text style={styles.feature}>• Earnings trends</Text>
          <Text style={styles.feature}>• Channel insights</Text>
          <Text style={styles.feature}>• Impact score</Text>
          <Text style={styles.feature}>• Smart suggestions</Text>
        </View>
      </View>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },

  header: {
    paddingTop: 56,
    paddingBottom: 26,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },

  headerSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },

  content: {
    alignItems: "center",
    marginTop: height * 0.18,
    paddingHorizontal: 30,
  },

  iconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f1f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,

    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },

  features: {
    marginTop: 10,
    alignItems: "center",
  },

  feature: {
    fontSize: 15,
    color: "#7860E3",
    fontWeight: "700",
    marginBottom: 6,
  },
});
