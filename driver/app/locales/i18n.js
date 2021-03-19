import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import { colors } from "react-native-elements";
import { saveLanguages, getLanguages } from "../utils/AsyncStorageHelper";

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;
// Define the supported translations
I18n.translations = {
  en,
  ar
};

//export var currentLocale = I18n.currentLocale();
//currentLocale = "en"
let lan = I18n.currentLocale();
console.log("Sugan","I18n lang"+lan);

export var currentLocale = getLanguages(
  success => {
   if(success.language=="arabic")
   {

    console.log("Sugan","arabic is stored");
    I18n.locale = "ar";
    var lang ="ar";
    return lang;
   }
   else{

    console.log("Sugan","english is stored");
    I18n.locale = "en";

    var lang ="en";
    return lang;
   
   }
 
  },
  failure => {

    console.log("Sugan","error   english is stored");
    I18n.locale = "en";
    var lang ="en";
    return lang;

  }
)
//currentLocale = "ar"
console.log("Sugan" ,"Current language " +currentLocale);
//I18n.locale = currentLocale

console.log("Sugan" ,"Current locale " +I18n.locale);

// Is it a RTL language?
export const isRTL = I18n.currentLocale().indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
