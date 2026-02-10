import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import {
  getWalletSummary,
  getWalletTransactions,
} from "../../services/wallet";

export default function WalletScreen() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* 🎯 Animated progress */
  const progressAnim = useRef(new Animated.Value(0)).current;

  /* 🔄 LOAD WALLET ON TAB FOCUS */
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadWallet = async () => {
        try {
          setLoading(true);

          const [s, t] = await Promise.all([
            getWalletSummary(),
            getWalletTransactions(),
          ]);

          if (active) {
            setSummary(s);
            setTransactions(t);
          }
        } catch (err) {
          console.log("WALLET ERROR:", err.message);
        } finally {
          setLoading(false);
        }
      };

      loadWallet();
      return () => (active = false);
    }, [])
  );

  /* 🔄 Pull-down refresh */
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const [s, t] = await Promise.all([
        getWalletSummary(),
        getWalletTransactions(),
      ]);
      setSummary(s);
      setTransactions(t);
    } catch (err) {
      console.log("REFRESH ERROR:", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  /* 🎬 Animate progress when points change */
  useEffect(() => {
    if (summary?.points !== undefined) {
      const progress = summary.points / 1000;

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [summary?.points]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🌈 HEADER */}
      <LinearGradient
        colors={["#7860E3", "#D66767"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSub}>
            Your anonymous earnings
          </Text>
        </View>
        <Text style={styles.headerIcon}>💳</Text>
      </LinearGradient>

      {/* 🔥 CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7860E3"
            colors={["#7860E3"]}
          />
        }
      >
        {/* 💳 BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            Available Balance
          </Text>

          <Text style={styles.balanceAmount}>
            ₹{summary?.balance ?? 0}{" "}
            <Text style={styles.currency}>INR</Text>
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, styles.todayBox]}>
              <Text style={styles.statLabel}>Today</Text>
              <Text style={styles.statValue}>
                {summary?.today ?? 0} Points
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>
                ₹{summary?.total ?? 0}
              </Text>
            </View>
          </View>
        </View>

        {/* 🎯 POINTS PROGRESS */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {summary?.points ?? 0} / 1000 Points
          </Text>

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["2%", "100%"], // 👈 minimum visible
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.progressHint}>
            {1000 - (summary?.points ?? 0)} points away from ₹1
          </Text>
        </View>

        {/* ───────── Divider ───────── */}
        <View style={styles.divider} />

        {/* 📜 TRANSACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>

          {loading && (
            <Text style={styles.centerText}>
              Loading wallet…
            </Text>
          )}

          {!loading && transactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💸</Text>
              <Text style={styles.emptyTitle}>
                No earnings yet
              </Text>
              <Text style={styles.emptySub}>
                Start giving feedback to earn!
              </Text>
            </View>
          )}

          {transactions.map((tx) => {
            const isCredit = tx.type === "credit";
            const isPointTx = !tx.title.includes("Wallet");

            const amountText = isPointTx
              ? `${isCredit ? "+" : "-"}${tx.amount} Point${tx.amount > 1 ? "s" : ""}`
              : `${isCredit ? "+" : "-"}₹${tx.amount}`;

            return (
              <View key={tx._id} style={styles.tx}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIcon,
                      {
                        backgroundColor: isCredit
                          ? "#e6f9f0"
                          : "#fdecec",
                      },
                    ]}
                  >
                    <Text style={styles.txEmoji}>
                      {isCredit ? "➕" : "➖"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.txTitle}>
                      {tx.title}
                    </Text>
                    <Text style={styles.txSub}>
                      {new Date(tx.createdAt).toDateString()}
                      {tx.channel ? ` · ${tx.channel}` : ""}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    {
                      color: isCredit
                        ? "#16a34a"
                        : "#dc2626",
                    },
                  ]}
                >
                  {amountText}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 🚫 WITHDRAW */}
        <View style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>
            Withdraw — Coming Soon
          </Text>
        </View>

        <Text style={styles.note}>
          Withdrawals will be enabled after MVP
        </Text>
      </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  headerIcon: {
    fontSize: 28,
  },

  scrollView: {
    marginTop: -20,
  },

  scroll: {
    paddingBottom: 24,
  },

  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },

  balanceLabel: {
    fontSize: 14,
    color: "#777",
  },

  balanceAmount: {
    marginTop: 6,
    fontSize: 32,
    fontWeight: "900",
  },

  currency: {
    fontSize: 16,
    color: "#777",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    padding: 12,
  },

  todayBox: {
    backgroundColor: "#ede9fe",
  },

  statLabel: {
    fontSize: 13,
    color: "#777",
  },

  statValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "800",
  },

  /* 🎯 Progress */
  progressContainer: {
    marginTop: 18,
    marginHorizontal: 20,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  progressBar: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#7860E3",
    borderRadius: 999,
    shadowColor: "#7860E3",
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },

  progressHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
    marginTop: 24,
  },

  section: {
    marginTop: 22,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },

  centerText: {
    textAlign: "center",
    marginTop: 10,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 30,
  },

  emptyEmoji: {
    fontSize: 40,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
  },

  emptySub: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  tx: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  txEmoji: {
    fontSize: 16,
  },

  txTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  txSub: {
    marginTop: 1,
    fontSize: 12,
    color: "#777",
  },

  txAmount: {
    fontWeight: "800",
  },

  withdrawBtn: {
    marginTop: 22,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#ccc",
  },

  withdrawText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  note: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#777",
  },
});
