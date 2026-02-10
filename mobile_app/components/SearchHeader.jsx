import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

const categories = ["All", "Tech", "Startup", "College", "Gaming"];

export default function SearchHeader() {
  return (
    <View style={styles.wrapper}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#777" />
        <TextInput
          placeholder="Search channels..."
          placeholderTextColor="#777"
          style={styles.input}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {categories.map((cat) => (
          <View key={cat} style={styles.chip}>
            <Text style={styles.chipText}>{cat}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
  },

  input: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
    color: "#000",
  },

  categories: {
    marginTop: 14,
  },

  chip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  chipText: {
    fontWeight: "700",
    color: "#333",
  },
});
