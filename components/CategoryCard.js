import React from 'react';
import { View, ImageBackground, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

// import { SharedElement } from 'react-navigation-shared-element';

import { COLORS, SIZES, FONTS } from '../constants';

const CategoryCard = ({ sharedElementPrefix, category, containerStyle, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: 170,
                height: 150,
                margin: 5,
                borderRadius: 50,
                justifyContent: 'center',

            }}
        >
            {/* Image backgroud */}
            {/* <SharedElement
                id={`${sharedElementPrefix}-CategoryCard-Bg-${category.id}`}
                style={[ StyleSheet.absoluteFillObject ]}
            > */}

            <ImageBackground
                source={category.thumbnail}
                resizeMode="cover"
                style={{
                    width: '100%',
                    height: '100%',
                }}
                imageStyle={{ borderRadius: 30 }}
            />
            {/* </SharedElement> */}

            {/* Title */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: 15,
                }}
            >
                {/* <SharedElement
                    id={`${sharedElementPrefix}-CategoryCard-Title-${category?.id}`}
                    style={[StyleSheet.absoluteFillObject]}
                > */}
                <Text
                    style={{
                        ...FONTS.h2,
                        color: COLORS.white,
                    }}
                >
                    {category.title}
                </Text>
                {/* </SharedElement> */}
            </View>
        </TouchableOpacity>
    )
}

export default CategoryCard;