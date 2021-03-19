import { StyleSheet } from "react-native";
import { EDColors } from "../assets/Colors";
import metrics from "../utils/metrics";

export default StyleSheet.create({
  navHeader: {
    flex: 1,
    // flexDirection: "column-reverse",
    backgroundColor: EDColors.primary,
    // alignItems: "center",
    paddingRight:20
  },
  navItemContainer: {
    flex: 5,
    paddingBottom: 20,
    marginTop: metrics.screenHeight * 0.025,
    backgroundColor: EDColors.white
  },
  navMobile: {
    flexDirection: "row",
    color: "#fff",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  navItem: {
    color: "#000",
    fontSize: 15,
    marginLeft: 40,
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center"
  },
  sideMenuText: {
    marginLeft: 30,
    color: "#000"
  },
  sideMenuTextSelected: {
    marginLeft: 30,
    color: "yellow"
  }
});
