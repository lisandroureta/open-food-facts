// app/(tabs)/_layout.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: Platform.OS === "ios" ? 90 : 75,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={focused ? styles.activeCircle : styles.inactiveContainer}
            >
              <MaterialCommunityIcons
                name="home"
                size={28}
                color={focused ? "#FFFFFF" : "#95A5A6"}
              />
              {!focused && <Text style={styles.inactiveText}>HOME</Text>}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={focused ? styles.activeCircle : styles.inactiveContainer}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={28}
                color={focused ? "#FFFFFF" : "#95A5A6"}
              />
              {!focused && <Text style={styles.inactiveText}>SEARCH</Text>}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={focused ? styles.activeCircle : styles.inactiveContainer}
            >
              <MaterialCommunityIcons
                name={focused ? "heart" : "heart-outline"}
                size={26}
                color={focused ? "#FFFFFF" : "#95A5A6"}
              />
              {!focused && <Text style={styles.inactiveText}>FAVORITES</Text>}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  inactiveContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 80,
  },
  inactiveText: {
    fontSize: 10,
    color: "#95A5A6",
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  activeCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D8348",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
