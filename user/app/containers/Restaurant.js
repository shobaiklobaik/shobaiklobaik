import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  SectionList,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import BaseContainer from './BaseContainer';
import ImageViewRadius from '../components/ImageViewRadius';
import ReviewContainer from '../components/ReviewContainer';
import RestaurantOverview from '../components/RestaurantOverview';
import {ETFonts} from '../assets/FontConstants';
import ImageGrid from '../components/ImageGrid';
import Assets from '../assets';
import {apiPost} from '../api/APIManager';
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  ADD_REVIEW,
} from '../utils/Constants';
import {showDialogue, showValidationAlert} from '../utils/CMAlert';
import ProgressLoader from '../components/ProgressLoader';
import {EDColors} from '../assets/Colors';
import {Rating} from 'react-native-ratings';
import ETextViewNormalLable from '../components/ETextViewNormalLable';
import {connect} from 'react-redux';
import {saveCartCount} from '../redux/actions/Checkout';
import {netStatus} from '../utils/NetworkStatusConnection';
import EditText from '../components/EditText';
import {strings} from '../locales/i18n';
import {getLanguage} from '../utils/AsyncStorageHelper';
import FastImage from 'react-native-fast-image';

export class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.MgeneralWebServiceError = strings('Messages.generalWebServiceError');
    this.MinternetConnnection = strings('Messages.internetConnnection');
    this.MloginValidation = strings('Messages.loginValidation');
    this.CheckLanguage();

    this.Photos = strings('Restaurant.Photos');
    this.PopularItems = strings('Restaurant.PopularItems');
    this.Reviews = strings('Restaurant.Reviews');

    (this.restaurantArray = []), (this.popularItems = []), (this.menuItem = []);
    // (this.reviews = []);
    //   (this.reviewStar = 0);
    // this.reviewText = "";
  }

  state = {
    language: '',
    isLoading: false,
    restaurant_id: this.props.navigation.state.params.restId,
    refresh: this.props.navigation.state.params.refresh,
    isReview: false,
    isPhotoClick: false,
    selectedPhotoUrl: '',
    reviewStar: 0,
    reviewText: '',
    // reviews: []
    reviews: undefined,
  };

  addReview() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          ADD_REVIEW,
          {
            language: this.state.language,
            restaurant_id: this.state.restaurant_id,
            user_id: this.props.userID,
            rating: this.state.reviewStar,
            review: this.state.reviewText,
          },
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
              this.setState({isLoading: false});
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                this.getRestaurantDetails();
                this.setState({isLoading: false});
              } else {
                showValidationAlert(response.message);
                this.setState({isLoading: false});
              }
            }
          },
          error => {},
        );
      } else {
        showValidationAlert(this.MinternetConnnection);
      }
    });
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
  getRestaurantDetails() {
    netStatus(status => {
      if (status) {
        this.setState({isLoading: true});
        apiPost(
          GET_RESTAURANT_DETAIL,
          {
            language: this.state.language,
            restaurant_id: this.state.restaurant_id,
          },
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : this.MgeneralWebServiceError,
              );
              this.setState({isLoading: false});
            } else if (response.status == RESPONSE_SUCCESS) {
              console.log('GET_RESTAURANT_DETAIL APi call==>', response);

              this.restaurantArray = response.restaurant;
              this.popularItems = response.popular_item;
              this.menuItem = response.menu_item;

              this.setState({reviews: response.review, isLoading: false});
            } else if (response.status == RESPONSE_FAIL) {
              this.state.reviews = [];
              this.setState({isLoading: false});
            }
          },
          error => {
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

  componentDidMount() {
    this.getRestaurantDetails();
  }

  render() {
    return (
      <BaseContainer
        title={strings('Restaurant.Restaurant')}
        left="Back"
        right={[]}
        onLeft={() => {
          this.state.refresh();
          this.props.navigation.goBack();
        }}>
        {this.state.isLoading ? <ProgressLoader /> : null}

        <Modal
          visible={this.state.isPhotoClick}
          animationType="slide"
          transparent={true}
          style={{backgroundColor: 'red'}}
          onRequestClose={() => {
            this.setState({isPhotoClick: false});
          }}>
          <View style={style.modalContainerImage}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                padding: 20,
                marginTop: 10,
              }}
              onPress={() => {
                this.setState({isPhotoClick: false});
              }}>
              <Image
                style={{
                  alignContent: 'flex-end',
                  height: 25,
                  width: 25,
                  marginTop: 10,
                }}
                source={Assets.delete_White}
              />
            </TouchableOpacity>
            <FastImage
              style={{
                flex: 1,
                borderRadius: 4,
                margin: 20,
              }}
              resizeMode="contain"
              source={{uri: this.state.selectedPhotoUrl}}
            />
          </View>
        </Modal>

        <Modal
          visible={this.state.isReview}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.setState({isReview: false});
          }}>
          <View style={style.modalContainer}>
            <View style={style.modalSubContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 20,
                    flex: 1,
                    color: EDColors.primary,
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: ETFonts.satisfy,
                  }}>
                  {strings('Restaurant.Give')}
                </Text>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    this.setState({
                      isReview: false,
                      reviewStar: 0,
                      reviewText: '',
                    });
                  }}>
                  <FastImage
                    style={{alignSelf: 'center', height: 15, width: 15}}
                    source={Assets.ic_close}
                  />
                </TouchableOpacity>
              </View>
              <Rating
                style={{alignSelf: 'center', marginTop: 10}}
                imageSize={25}
                ratingCount={5}
                minValue={1}
                fractions={10}
                startingValue={
                  this.props.rating !== undefined &&
                  this.props.rating !== null &&
                  this.props.rating !== ''
                    ? parseInt(this.props.rating)
                    : 0
                }
                onFinishRating={star => {
                  this.setState({
                    reviewStar: star,
                  });
                }}
              />

              <View
                style={{
                  borderColor: '#000',
                  marginTop: 15,
                  marginLeft: 20,
                  marginRight: 20,
                  // borderBottomWidth:1
                }}>
                <EditText
                  placeholder={strings('Restaurant.comment')}
                  style={{
                    color: '#000',
                    textAlignVertical: 'top',
                    fontFamily: ETFonts.regular,
                    fontSize: 15,
                  }}
                  onChangeText={newText => {
                    this.setState({
                      reviewText: newText,
                    });
                  }}
                  maxLength={250}
                />
              </View>

              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: ETFonts.bold,
                  paddingLeft: 30,
                  paddingRight: 30,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 6,
                  marginTop: 20,
                  color: '#fff',
                  backgroundColor:
                    this.state.reviewStar !== 0 && this.state.reviewText !== ''
                      ? EDColors.primary
                      : EDColors.buttonUnreserve,
                }}
                onPress={() => {
                  if (
                    this.state.reviewStar !== 0 &&
                    this.state.reviewText !== ''
                  ) {
                    this.addReview();
                    this.setState({isReview: false});
                  }
                }}>
                {strings('Restaurant.SUBMIT')}
              </Text>
            </View>
          </View>
        </Modal>

        <View style={{backgroundColor: '#fff'}}>
          <SectionList
            showsVerticalScrollIndicator={false}
            extraData={this.state}
            renderSectionHeader={({section: {title, data, index}}) => {
              return title != '' &&
                data[0] != undefined &&
                data[0].length > 0 ? (
                index == 3 ? (
                  <View style={{backgroundColor: '#fff', flexDirection: 'row'}}>
                    <ETextViewNormalLable text={title} />
                    <View
                      style={{
                        alignItems: 'flex-end',
                        flex: 1,
                        marginRight: 10,
                      }}>
                      <Text
                        style={style.NewFooter}
                        onPress={() => {
                          this.setState({isReview: true});
                        }}>
                        {strings('Restaurant.ADDREVIEW')}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{backgroundColor: '#fff'}}>
                    <ETextViewNormalLable text={title} />
                  </View>
                )
              ) : null;
            }}
            sections={[
              {title: '', data: this.restaurantArray, index: 0},
              {title: this.Photos, data: [this.popularItems], index: 1},
              {
                title: this.PopularItems,
                data: [this.popularItems],
                index: 2,
              },
              {
                title: this.Reviews,
                data: [
                  this.state.reviews != undefined ? this.state.reviews : [],
                ],
                index: 3,
              },
            ]}
            renderItem={({item, index, section}) => {
              if (section.index == 0) {
                return (
                  <View>
                    {/* <FastImage
                      source={{uri: item.image}}
                      style={{width: '100%', height: 180}}
                    /> */}
                    <Image
                      source={{uri: item.image}}
                      style={{width: '100%', height: 180}}
                    />
                    <View
                      style={{
                        position: 'relative',
                        marginTop: -50,
                      }}>
                      <RestaurantOverview
                        resName={item.name}
                        review={item.rating}
                        isShow={true}
                        timing={
                          item.timings.open != '' && item.timings.close != ''
                            ? item.timings.open + '-' + item.timings.close
                            : ''
                        }
                        address={item.address}
                        buttonText={item.timings.off}
                        onButtonClick={str => {
                          this.props.navigation.navigate('CategoryContainer', {
                            resName: item.name,
                            resid: item.restuarant_id,
                            menuItem: this.menuItem,
                            image: item.image,
                          });
                        }}
                      />
                    </View>
                  </View>
                );
              } else if (section.index == 1) {
                return this.photosList(item);
              } else if (section.index == 2) {
                return this.popularList(item);
              } else if (section.index == 3) {
                return this.reviewList(item);
              } else {
                return <Text>{}</Text>;
              }
            }}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </BaseContainer>
    );
  }

  photosList(data) {
    return (
      <FlatList
        horizontal={true}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <ImageViewRadius
              imageUrl={item.image}
              onButtonClick={() => {
                this.setState({
                  isPhotoClick: true,
                  selectedPhotoUrl: item.image,
                });
              }}
            />
          );
        }}
        keyExtractor={(item, index) => item + index}
      />
    );
  }

  popularList(data) {
    return (
      <FlatList
        horizontal={true}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <ImageGrid
              imageUrl={item.image}
              title={item.name}
              price={item.price}
            />
          );
        }}
        keyExtractor={(item, index) => item + index}
      />
    );
  }

  reviewList(data) {
    return data.length > 0 && this.state.reviews != undefined ? (
      <FlatList
        style={{margin: 10}}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <ReviewContainer
              userImage={item.image}
              name={item.first_name + ' ' + item.last_name}
              review={item.review}
              size={15}
              rating={item.rating}
              date="Jun 15"
              onReview={count => {}}
              readonly={true}
            />
          );
        }}
        // ListFooterComponent={() => {
        //   return this.props.userID != undefined && this.props.userID != null ? (
        //     <Text
        //       style={style.footer}
        //       onPress={() => {
        //         this.setState({ isReview: true });
        //       }}
        //     >
        //       ADD REVIEW
        //     </Text>
        //   ) : null;
        // }}
        keyExtractor={(item, index) => item + index}
      />
    ) : this.props.userID != undefined &&
      this.props.userID != null &&
      this.state.reviews != undefined ? (
      <Text
        style={style.footer}
        onPress={() => {
          this.setState({isReview: true});
        }}>
        {strings('Restaurant.ADDREVIEW')}
      </Text>
    ) : null;
  }
}

export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux,
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(Restaurant);

export const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: ETFonts.regular,
    marginLeft: 5,
    color: '#000',
    paddingLeft: 10,
    paddingRight: 10,
  },
  image: {
    width: 20,
    height: 20,
  },
  footer: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: ETFonts.regular,
    alignItems: 'center',
  },
  NewFooter: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    marginBottom: 5,
    marginTop: 10,

    color: '#fff',
    fontSize: 14,
    fontFamily: ETFonts.regular,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  modalContainerImage: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.90)',
  },
  modalSubContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20,
  },
});
