import React from 'react';
import {View, StyleSheet} from 'react-native';
import RadioGroupWithHeader from '../components/RadioGroupWithHeader';
import BaseContainer from './BaseContainer';
import ETSlider from '../components/ETSlider';
import TextviewRadius from '../components/TextviewRadius';
import {strings} from '../locales/i18n';

export default class FilterContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.TypeofFood = strings('FilterContainer.TypeofFood');
    this.TypeofRecipe = strings('FilterContainer.TypeofRecipe');
    this.Both = strings('FilterContainer.Both');
    this.Veg = strings('FilterContainer.Veg');
    this.NonVeg = strings('FilterContainer.NonVeg');
    this.High = strings('FilterContainer.High');
    this.Low = strings('FilterContainer.Low');

    this.cookTime = this.props.navigation.state.params.time || 30;
    this.recipeType = this.props.navigation.state.params.food;
    this.distance = this.props.navigation.state.params.distance || 5;
    this.priceType = this.props.navigation.state.params.price;
  }

  state = {
    priceSortvalue: 1,

    foodType: [
      {
        label: 'Both',
        size: 15,
        selected: this.props.navigation.state.params.food === '' ? true : false,
      },
      {
        label: 'Veg',
        size: 15,
        selected: this.props.navigation.state.params.food == 1 ? true : false,
      },
      {
        label: 'Non-Veg',
        size: 15,
        selected: this.props.navigation.state.params.food == 0 ? true : false,
      },
    ],
    priceSort: [
      {
        label: 'High to Low',
        size: 15,
        selected: this.props.navigation.state.params.price == 1 ? true : false,
      },
      {
        label: 'Low to High',
        size: 15,
        selected: this.props.navigation.state.params.price == 0 ? true : false,
      },
    ],
    sendFilterDetailsBack: this.props.navigation.state.params.getFilterDetails,
    filterType: this.props.navigation.state.params.filterType,
  };

  applyFilter(data) {
    console.log('applyFilter :: ', data);
    if (this.state.sendFilterDetailsBack != undefined) {
      this.state.sendFilterDetailsBack(data);
    }
    this.props.navigation.goBack();
  }

  render() {
    console.log('this.priceType', this.priceType);
    console.log(
      'this.props.navigation.state.params.price',
      this.props.navigation.state.params.price,
    );

    console.log('this.state.filterType', this.state.filterType);
    return (
      <BaseContainer
        title={strings('FilterContainer.Filter')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}>
        <View style={{flex: 8}}>
          <RadioGroupWithHeader
            data={this.state.foodType}
            title={
              this.state.filterType == 'Main' || this.state.filterType == 'menu'
                ? this.TypeofFood
                : this.TypeofRecipe
            }
            onSelected={selected => {
              this.recipeType = selected;
            }}
          />

          {this.state.filterType == 'Main' ? (
            <ETSlider
              title={strings('FilterContainer.SortByDistance')}
              onSlide={values => {
                this.distance = values;
              }}
              max={8}
              initialValue={this.distance}
              valueType="km"
            />
          ) : this.state.filterType == 'Recipe' ? (
            <ETSlider
              title={strings('FilterContainer.CookingTime')}
              onSlide={values => {
                this.cookTime = values;
              }}
              max={240}
              min={5}
              initialValue={this.cookTime}
              valueType="min"
            />
          ) : (
            <RadioGroupWithHeader
              data={this.state.priceSort}
              title={strings('FilterContainer.SortByPrice')}
              onSelected={selected => {
                console.log('selected', selected);
                this.setState(
                  {
                    priceSortvalue: selected == 'High to Low' ? 1 : 0,
                  },
                  () => {
                    console.log('priceSortvalue', this.state.priceSortvalue);
                  },
                );
                // this.priceType = parseString(selected);
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            flex: 1,
          }}>
          <TextviewRadius
            text={strings('FilterContainer.APPLYFILTER')}
            onPress={() => {
              console.log('this.state.filterType', this.state.filterType);
              if (this.state.filterType == 'Main') {
                var data = {
                  food:
                    this.recipeType == 'Veg' || this.recipeType === 1
                      ? 1
                      : this.recipeType == 'Non-Veg' || this.recipeType === 0
                      ? 0
                      : '',
                  distance: this.distance != '' ? this.distance : '',
                };
                this.applyFilter(data);
              } else if (this.state.filterType == 'Recipe') {
                var data = {
                  food:
                    this.recipeType == 'Veg' || this.recipeType === 1
                      ? 1
                      : this.recipeType == 'Non-Veg' || this.recipeType === 0
                      ? 0
                      : '',
                  timing: this.cookTime != '' ? this.cookTime : '',
                };
                this.applyFilter(data);
              } else {
                console.log('this.state.priceSort', this.state.priceSort);
                var data = {
                  food:
                    this.recipeType == 'Veg' || this.recipeType === 1
                      ? 1
                      : this.recipeType == 'Non-Veg' || this.recipeType === 0
                      ? 0
                      : '',
                  price: this.state.priceSortvalue,
                  // price: this.priceType === 'High to low' ? 1 : 0,
                };
              }
              this.applyFilter(data);
            }}
          />
          <TextviewRadius
            text={strings('FilterContainer.RESET')}
            onPress={() => {
              if (this.state.filterType == 'Main') {
                var data = {
                  food: '',
                  distance: '',
                };
                this.applyFilter(data);
              } else if (this.state.filterType == 'Recipe') {
                var data = {
                  food: '',
                  timing: '',
                };
                this.applyFilter(data);
              } else {
                var data = {
                  food: '',
                  price: 0,
                };
              }
              this.applyFilter(data);
            }}
          />
        </View>
      </BaseContainer>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
