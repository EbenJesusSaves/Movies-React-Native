import * as React from "react";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { getMovies } from "./Api";
import Genres from "./Genre";
import Rating from "./Rating";
import MaskedView from "@react-native-community/masked-view";
import Svg, { Rect } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-paper";

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View
      style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}
      renderToHardwareTextureAndroid
    >
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key}
        removeClippedSubviews={false}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [-width, 0],
          });
          return (
            <MaskedView
              style={{
                width,
                height,
                position: "absolute",
              }}
              maskElement={
                <AnimatedSvg
                  width={width}
                  height={height}
                  style={{
                    backgroundColor: "transparent",
                    transform: [{ translateX }],
                  }}
                >
                  <Rect x="0" y="0" width={width} height={height} fill="red" />
                </AnimatedSvg>
              }
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width: width,
                  height: BACKDROP_HEIGHT,
                  resizeMode: "cover",
                }}
              />
            </MaskedView>
          );
        }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "black"]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

export const Home = ({ navigation }) => {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      // Add empty items to create fake space
      // [empty_item, ...movies, empty_item]
      setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  const [user, setUser] = React.useState(false);

  const changeUser = () => {
    // setUser(true);
    console.log("hi");
  };

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={0.2}
        contentContainerStyle={{ alignItems: "center" }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: "center",
                  transform: [{ translateY }],
                  backgroundColor: "#191626",
                  borderRadius: 34,
                }}
              >
                <Image
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <Text
                  style={{ fontSize: 24, color: "white" }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Rating rating={item.rating} />
                <Genres genres={item.genres} />
                <Text style={{ fontSize: 12, color: "#ccc" }} numberOfLines={3}>
                  {item.description}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
      <Button
        onPress={() => navigation.navigate("SignUpScreen")}
        style={{ marginBottom: 20, width: 200, alignSelf: "center" }}
        mode="contained"
      >
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});