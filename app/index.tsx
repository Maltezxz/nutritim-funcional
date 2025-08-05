import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Sparkles, Zap, Target } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const [showContent, setShowContent] = useState(false);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  
  // Floating particles animation
  const particle1 = useSharedValue(0);
  const particle2 = useSharedValue(0);
  const particle3 = useSharedValue(0);

  useEffect(() => {
    // Start animations sequence
    titleOpacity.value = withTiming(1, { duration: 1000 });
    titleTranslateY.value = withTiming(0, { duration: 1000 });
    
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    buttonScale.value = withDelay(1000, withTiming(1, { duration: 600 }));

    // Floating particles
    particle1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      false
    );
    
    particle2.value = withDelay(1000, 
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 }),
          withTiming(0, { duration: 4000 })
        ),
        -1,
        false
      )
    );
    
    particle3.value = withDelay(2000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2500 }),
          withTiming(0, { duration: 2500 })
        ),
        -1,
        false
      )
    );

    setTimeout(() => setShowContent(true), 1500);
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const particle1Style = useAnimatedStyle(() => {
    const translateY = interpolate(particle1.value, [0, 1], [100, -100]);
    const opacity = interpolate(particle1.value, [0, 0.5, 1], [0, 1, 0]);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const particle2Style = useAnimatedStyle(() => {
    const translateY = interpolate(particle2.value, [0, 1], [80, -120]);
    const translateX = interpolate(particle2.value, [0, 1], [0, 50]);
    const opacity = interpolate(particle2.value, [0, 0.5, 1], [0, 0.8, 0]);
    return {
      opacity,
      transform: [{ translateY }, { translateX }],
    };
  });

  const particle3Style = useAnimatedStyle(() => {
    const translateY = interpolate(particle3.value, [0, 1], [60, -80]);
    const translateX = interpolate(particle3.value, [0, 1], [0, -30]);
    const opacity = interpolate(particle3.value, [0, 0.5, 1], [0, 0.6, 0]);
    return {
      opacity,
      transform: [{ translateY }, { translateX }],
    };
  });

  const handleStart = () => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setTimeout(() => {
      router.push('/onboarding');
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Floating Particles */}
      <Animated.View style={[styles.particle, styles.particle1, particle1Style]}>
        <Sparkles size={24} color="#ffffff" strokeWidth={1} />
      </Animated.View>
      <Animated.View style={[styles.particle, styles.particle2, particle2Style]}>
        <Zap size={20} color="#ffffff" strokeWidth={1} />
      </Animated.View>
      <Animated.View style={[styles.particle, styles.particle3, particle3Style]}>
        <Target size={18} color="#ffffff" strokeWidth={1} />
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>NutriScan</Text>
          <View style={styles.titleAccent} />
        </Animated.View>

        <Animated.View style={[styles.subtitleContainer, subtitleStyle]}>
          <Text style={styles.subtitle}>
            Descubra as calorias dos seus alimentos{'\n'}
            com tecnologia de IA
          </Text>
        </Animated.View>

        {showContent && (
          <Animated.View style={[styles.buttonContainer, buttonStyle]}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.buttonText}>Começar</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorationLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -1,
  },
  titleAccent: {
    width: 60,
    height: 3,
    backgroundColor: '#ffffff',
    marginTop: 8,
    borderRadius: 2,
  },
  subtitleContainer: {
    marginBottom: 64,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  particle: {
    position: 'absolute',
    opacity: 0.3,
  },
  particle1: {
    top: height * 0.2,
    left: width * 0.2,
  },
  particle2: {
    top: height * 0.3,
    right: width * 0.15,
  },
  particle3: {
    top: height * 0.7,
    left: width * 0.1,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  decorationLine: {
    width: 80,
    height: 2,
    backgroundColor: '#333333',
    borderRadius: 1,
  },
});