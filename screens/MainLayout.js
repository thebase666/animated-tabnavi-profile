import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native';
import Home from './Home';
import Profile from './Profile';
import Search from './Search';
import { COLORS, SIZES, icons, FONTS, constants } from '../constants';

const bottom_tabs = constants.bottom_tabs.map((bottom_tab) => ({
  ...bottom_tab,
  ref: React.createRef()
}))

const TabIndicator = ({ measureLayout, scrollX }) => {//没用map 不需要devide 就是一个小滑块 不是三个滑块

  const translateX = scrollX.interpolate({//调下形式 打印出来 看看
    inputRange: bottom_tabs.map((_, i) => i * SIZES.width),//[0, 384, 768]
    outputRange: measureLayout.map(measure => measure.x)//[0,112,224 ] 通过x的位置 动画效果 
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        height: "100%",
        width: 112,//tabIndicatorWidth,
        transform: [{ translateX }],//挂钩动画 
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary
      }}
    />
  )
}

const Tabs = ({ scrollX, onBottomTabPress }) => {

  const containerRef = React.useRef();
  const [measureLayout, setMeasureLayout] = React.useState([]);

  React.useEffect(() => {
    let ml = []
    // console.log("------------");
    bottom_tabs.forEach(bottom_tab => {
      bottom_tab?.ref?.current?.measureLayout(containerRef.current, (x, y, width, height) => {
        ml.push({ x, y, width, height })
        // console.log("+++++++++++"); //这个位置好像一直在循环
        if (ml.length === bottom_tabs.length) { setMeasureLayout(ml); }
      })
    })
  }, [containerRef.current])//得到bottom_tabs坐标

  // Array [
  //   Object {
  //     "height": 85.33333587646484,
  //     "width": 112,
  //     "x": 0,
  //     "y": 0,
  //   },
  //   Object {
  //     "height": 85.33333587646484,
  //     "width": 112,
  //     "x": 112,
  //     "y": 0,
  //   },
  //   Object {
  //     "height": 85.33333587646484,
  //     "width": 112,
  //     "x": 224,
  //     "y": 0,
  //   },
  // ]

  return (
    <View
      ref={containerRef}
      style={{
        flex: 1,
        flexDirection: 'row'
      }}
    >
      {/* Tab Indicator */}
      {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />}
      {/* Tabs */}
      {bottom_tabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`BottomTab-${index}`}
            ref={item.ref}
            onPress={() => onBottomTabPress(index)}
            style={{
              flex: 1,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={item.icon}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.white
              }}
            />
            <Text
              style={{
                marginTop: 3,
                color: COLORS.white,
                ...FONTS.h3
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const MainLayout = () => {

  const flatListRef = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const onBottomTabPress = React.useCallback(bottomTabIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: bottomTabIndex * SIZES.width
    })
  })//点击 函数挂钩flatlist进行scroll flatlist变化通过xscroll传递给indecator 变化的值通过measure拿到的坐标加x

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentContainer: {
      flex: 1,
      // backgroundColor: COLORS.black,
      // bottom: -60
    }
  });

  function renderContent() {
    return (
      <View style={styles.contentContainer}>
        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={SIZES.width}//only use for ios
          decelerationRate="fast"//only use for ios  跟snapToInterval配合使用
          scrollEnabled={false} // no scrolling
          showsHorizontalScrollIndicator={false}
          data={constants.bottom_tabs}
          keyExtractor={item => `Main-${item.id}`}
          onScroll={
            Animated.event([
              { nativeEvent: { contentOffset: { x: scrollX } } }
            ], {
              useNativeDriver: false
            })
          }
          renderItem={({ item, index }) => {
            return (
              <View style={{ width: SIZES.width, height: '100%' }}>
                {item.label == constants.screens.home && <Home />}
                {item.label == constants.screens.search && <Search />}
                {item.label == constants.screens.profile && <Profile />}
              </View>
            )
          }}
        />
      </View>
    )
  }

  function renderBottomTab() {
    return (
      <View
        style={{
          position: 'absolute', // remove if dont need tab bar to be transparent
          paddingBottom: SIZES.padding,
          bottom: 0, // remove if dont need tab bar to be transparent
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.radius,
          // backgroundColor: COLORS.transparentBlack1 // remove if dont need tab bar to be transparent
        }}
      >
        <View
          style={{ height: 85, width: SIZES.width - SIZES.padding * 2 }} // shadow container
        >
          <View
            style={{
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary3,
              // elevation: 7,//可以用elevation 也可以用zIndex
              zIndex: 10,
              shadowColor: COLORS.black
            }}
          >
            <Tabs
              scrollX={scrollX}
              onBottomTabPress={onBottomTabPress}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderContent()}
      {renderBottomTab()}
    </View>
  )
}

export default MainLayout;

