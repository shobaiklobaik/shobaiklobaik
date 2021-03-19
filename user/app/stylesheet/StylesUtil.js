import { StyleSheet } from "react-native";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

export const Style = StyleSheet.create({
  loginBlankView: { flex: 4 },
  loginView: {
    color: "#fff",
    marginLeft: 25,
    marginRight: 25
  },
  textview: {
    color: EDColors.primary,
    fontSize: 18,
    marginTop: 10,
    fontFamily: ETFonts.regular
  },
  textviewNormal: {
    color: "#000",
    fontSize: 18,
    
    fontFamily: ETFonts.regular
  }
});
