// It is used when we have to navigate to a screen from a file which is not in our Root navigator
// We have used it in our App.js file.
import { NavigationActions, StackActions } from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {

  _navigator = navigatorRef;
}

// function navigate(routeName, params) {
//   _navigator.dispatch(
//     NavigationActions.navigate({
//       routeName,
//       params
//     })
//   );
// }

function navigateToSpecificRoute(specifiedRouteName) {
  // CHANGE THE ROOT SCREEN
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: ("MainContainer") })]
    })
  );

  _navigator.dispatch(
    NavigationActions.navigate({
      routeName: specifiedRouteName
    })
  );
}

function navigate(routeName, action) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      action,
    }));
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  navigateToSpecificRoute
};
