import React from 'react';
import {View, Image, StyleSheet, ScrollView, FlatList} from 'react-native';
import BaseContainer from './BaseContainer';
import {showValidationAlert} from '../utils/CMAlert';
import Assets from '../assets';
import RightSearchBox from '../components/RightSearchBox';
import FoodOverview from '../components/FoodOverview';
import {apiPost} from '../api/APIManager';
import {
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  GET_RECIPE_LIST,
} from '../utils/Constants';
import ProgressLoader from '../components/ProgressLoader';
import {ETFonts} from '../assets/FontConstants';
import DataNotAvailableContainer from '../components/DataNotAvailableContainer';
//import { Messages } from "../utils/Messages";
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

export default class RecipeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.Search = strings('RecipeContainer.Search');
    this.CheckLanguage();

    this.state = {
      language: '',
      isLoading: false,
    };

    this.itemSearch = '';
    this.food = '';
    this.timing = '';

    this.foodData = [];
  }
  CheckLanguage() {
    getLanguage(
      success => {
        if (success.language == 'arabic') {
          console.log('Sugan', 'arabic language');
          this.state.language = 'arabic';
        } else {
          console.log('Sugan', 'english language');
          this.state.language = 'english';
        }
      },
      failure => {},
    );
  }

  getRecipeList() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          GET_RECIPE_LIST,
          {
            language: this.state.language,
            itemSearch: this.itemSearch,
            food: '' + this.food,
            timing: '' + this.timing,
          },
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
                [],
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.foodData = response.items;
              this.setState({isLoading: false});
            } else if (response.status == RESPONSE_FAIL) {
              this.foodData = [];
              this.setState({isLoading: false});
            }
          },
          error => {
            this.foodData = [];
            this.setState({isLoading: false});
            showValidationAlert(
              error.response != undefined
                ? error.response
                : this.MgeneralWebServiceError,
            );
          },
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
  }

  onSearchClick() {
    this.getRecipeList();
  }

  componentDidMount() {
    this.getRecipeList();
  }

  testFunction = data => {
    this.food = data.food;
    this.timing = data.timing;

    this.getRecipeList();
  };

  rightClick = index => {
    if (index == 0) {
      this.props.navigation.navigate('Filter', {
        getFilterDetails: this.testFunction,
        filterType: 'Recipe',
        food: this.food,
        time: this.timing,
      });
    }
  };

  render() {
    return (
      <BaseContainer
        title={strings('RecipeContainer.Recipe')}
        left="Menu"
        right={[{url: Assets.ic_filter}]}
        onLeft={() => {
          this.props.navigation.openDrawer();
        }}
        onRight={this.rightClick}>
        {this.state.isLoading ? <ProgressLoader /> : null}

        <ScrollView
          style={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={style.container}>
            <Image
              source={Assets.header_placeholder}
              style={{width: '100%', height: 200}}
            />
            <View style={style.searchBox}>
              <RightSearchBox
                placeholder={strings('RecipeContainer.Search')}
                onChangeText={text => {
                  this.itemSearch = text;
                }}
                onSearchClick={() => {
                  this.onSearchClick();
                }}
              />
            </View>

            {this.foodData != undefined && this.foodData.length > 0 ? (
              <FlatList
                data={this.foodData}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <FoodOverview
                      imageUrl={item.image}
                      title={item.name}
                      desc={item.menu_detail}
                      is_veg={item.is_veg}
                      onClick={() => {
                        console.log('FoodOverview liked--- Sugan ');

                        this.props.navigation.navigate('RecipeDetail', {
                          detail: item,
                        });
                      }}
                    />
                  );
                }}
                keyExtractor={(item, index) => item + index}
              />
            ) : this.foodData != undefined ? (
              this.state.isLoading ? (
                <View />
              ) : (
                this.emptyView()
              )
            ) : null}
          </View>
        </ScrollView>
      </BaseContainer>
    );
  }

  emptyView() {
    return <DataNotAvailableContainer />;
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'relative',
    marginTop: -30,
    marginBottom: 10,
  },
  emptyView: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    color: '#000',
    fontSize: 15,
    alignSelf: 'center',
    fontFamily: ETFonts.regular,
  },
});
