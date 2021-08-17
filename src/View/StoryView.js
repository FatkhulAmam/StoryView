import React, {Component, createRef} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Dimensions,
  Platform,
  NativeEventEmitter,
  NativeAppEventEmitter,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {PanGestureHandler} from 'react-native-gesture-handler';

import Data from '../database/dummyData';
import ProgressBar from '../Components/indicatorBar';
import Stories from '../Components/Stories';

let CurrentSlide = 0;
let IntervalTime = 6000;
const {width, height} = Dimensions.get('window');
const SwipeConfig = {
  velocityThreshold: 0.1,
  directionalOffsetThreshold: 10,
};

export class StoryView extends Component {
  constructor() {
    super();
    this.state = {
      data: '',
    };
  }

  flatList = createRef();

  componentDidMount() {
    const {navigation} = this.props;
    // console.log(this.props);
    this._stopAutoPlay();
    this._startAutoPlay();
  }

  componentWillUnmount() {
    this._stopAutoPlay();
  }

  onSwipeLeft(gestureState) {
    console.log('left');
    const {navigation} = this.props;
    navigation.navigate('StoryView', 1);
  }

  onSwipeRight(gestureState) {
    console.log('right');
    const {navigation} = this.props;
    navigation.navigate('StoryView', 0);
  }

  _goToNextPage = () => {
    if (CurrentSlide >= 3 - 1) {
      CurrentSlide = 0;
    }

    this.flatList.current.scrollToIndex({
      index: ++CurrentSlide,
      animated: true,
    });
  };

  _startAutoPlay = () => {
    this._timerId = setInterval(this._goToNextPage, IntervalTime);
  };

  _stopAutoPlay = () => {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  };

  renderProgresStatus = item => {
    return (
      <View style={{flexDirection: 'row'}}>
        <ProgressBar
          width={width / item.stories.length}
          type="image"
          storyLength={item.stories.length}
        />
        <ProgressBar
          width={width / item.stories.length}
          type="image"
          storyLength={item.stories.length}
        />
        <ProgressBar
          width={width / item.stories.length}
          type="image"
          storyLength={item.stories.length}
        />
      </View>
    );
  };

  renderHeader = item => {
    console.log(item);
    return (
      <View
        style={{
          position: 'absolute',
        }}>
        {item.stories.map(e => {
          <ProgressBar
            width={width / item.stories.length}
            type="image"
            storyLength={item.stories.length}
          />;
        })}
        {this.renderProgresStatus(item)}
        {/* <ProgressBar
          width={width / item.stories.length}
          type="image"
          storyLength={item.stories.length}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            zIndex: 9,
            marginHorizontal: 20,
            marginVertical: 15,
          }}>
          <Image
            source={{uri: item.avatar}}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
          <Text style={{color: '#fff', fontSize: 20, marginHorizontal: 10}}>
            {item.username}
          </Text>
        </View>
      </View>
    );
  };

  onPanGestureEvent = nativeEvent => {
    console.log(nativeEvent);
  };

  renderImage = ({item}) => {
    return (
      <>
        {/* <GestureRecognizer
          onSwipeRight={state => this.onSwipeRight(state)}
          onSwipeLeft={state => this.onSwipeLeft(state)}
          config={SwipeConfig}> */}
        <LinearGradient
          colors={['rgba(10, 10, 10, 0.4)', 'rgba(0, 0, 0, 0)']}
          style={{
            width: '100%',
            height: 200,
            position: 'absolute',
            zIndex: 9,
          }}
        />
        <PanGestureHandler onGestureEvent={this.onPanGestureEvent} minDist={20}>
          <Image style={{width, height}} source={{uri: item.url}} />
        </PanGestureHandler>
        {this.renderFooter(item)}
        {/* </GestureRecognizer> */}
      </>
    );
  };

  renderItem = ({item}) => {
    const {route} = this.props;
    return route.params === item.idUser ? (
      <>
        {this.renderHeader(item)}
        {/* <Stories {...{item}} /> */}
        <FlatList
          data={item.stories}
          renderItem={this.renderImage}
          keyExtractor={item => item.id.toString()}
          horizontal
          flatListRef={React.createRef()}
          ref={this.flatList}
          pagingEnabled
          // onScroll={e => this.foo(e.target)}
        />
      </>
    ) : null;
  };

  foo = velocity => {
    if (Platform.OS === 'ios') {
      velocity > 0 ? console.log('to left') : console.log('to right');
    } else {
      velocity < 0
        ? console.log(velocity, 'to left')
        : console.log(velocity, 'to right');
    }
  };

  renderFooter = item => {
    return (
      <View
        style={{
          flex: 1,
          width,
          height: 125,
          alignItems: 'center',
          backgroundColor: 'rgba(38, 38, 38, 0.5)',
          zIndex: 9,
          bottom: 0,
          paddingTop: 10,
          position: 'absolute',
        }}>
        <Text style={{color: '#fff'}}>{item.caption}</Text>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <FlatList
          data={Data}
          renderItem={this.renderItem}
          keyExtractor={item => item.idUser}
        />
      </View>
    );
  }
}

export default StoryView;
