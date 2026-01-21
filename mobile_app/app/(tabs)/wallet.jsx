import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  getWalletSummary,
  getWalletTransactions,
} from "../../services/wallet";

export default function WalletScreen() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
                ₹{summary?.today ?? 0}
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
                      {new Date(
                        tx.createdAt
                      ).toDateString()} · {tx.channel}
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
                  {isCredit ? "+" : "-"}₹{tx.amount}
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
    letterSpacing: 0.5,
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
