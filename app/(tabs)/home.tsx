import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Plus, Target } from 'lucide-react-native';
import { useState, useRef } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Declaração de tipo para global
declare global {
  var capturedPhoto: {
    uri: string;
    base64: string;
  } | undefined;
}

// Modo desenvolvedor - remover antes do lançamento na App Store
const __DEV__ = true;

export default function Home() {
  const [userIsPremium, setUserIsPremium] = useState(false); // Mockado - pode ser alterado para testar
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const consumed = 1250;
  const goal = 2000;
  const percentage = (consumed / goal) * 100;
  
  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    progress.value = withTiming(percentage / 100, { duration: 1500 });
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = 377 * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const handlePlusPress = async () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    
    if (userIsPremium) {
      // Verificar permissão da câmera
      if (!permission) {
        return;
      }
      
      if (!permission.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          return;
        }
      }
      
      // Abrir câmera
      setShowCamera(true);
    } else {
      router.push('/subscription');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        console.log('Tirando foto...');
        setIsCapturing(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        console.log('Foto tirada, URI:', photo.uri);
        
        // Converter imagem para base64
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        console.log('Base64 convertido, tamanho:', base64.length);
        
        // Verificar se a conversão foi bem-sucedida
        if (!base64 || base64.length < 1000) {
          throw new Error('Falha na conversão da imagem');
        }
        
        // Salvar dados da foto para usar na análise
        (global as any).capturedPhoto = {
          uri: photo.uri,
          base64: base64,
        };
        
        console.log('Dados da foto salvos, indo para análise...');
        
        // Pequeno delay antes de fechar a câmera para evitar o erro de unmount
        setTimeout(() => {
          setShowCamera(false);
          router.push('/analysis');
        }, 200);
        
      } catch (error) {
        console.error('Erro ao tirar foto:', error);
        setIsCapturing(false);
        alert('Erro ao capturar a foto. Tente novamente.');
      }
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const recentMeals = [
    { name: 'Café da manhã', calories: 420, time: '08:30' },
    { name: 'Almoço', calories: 680, time: '12:45' },
    { name: 'Lanche', calories: 150, time: '15:20' },
  ];

  // Se a câmera estiver aberta, mostrar interface da câmera
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            {/* Header da câmera */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraCloseButton} onPress={closeCamera}>
                <Text style={styles.cameraCloseText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Fotografe seu alimento</Text>
              <TouchableOpacity style={styles.cameraFlipButton} onPress={toggleCameraFacing}>
                <Text style={styles.cameraFlipText}>🔄</Text>
              </TouchableOpacity>
            </View>

            {/* Área de foco central */}
            <View style={styles.cameraFocusArea}>
              <View style={styles.focusFrame} />
            </View>

            {/* Botões da câmera */}
            <View style={styles.cameraControls}>
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.captureButton, 
                    isCapturing && styles.captureButtonDisabled
                  ]} 
                  onPress={takePicture}
                  disabled={isCapturing}
                >
                  <View style={styles.captureButtonInner} />
                  {isCapturing && (
                    <View style={styles.captureLoading}>
                      <Text style={styles.captureLoadingText}>...</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Usuário!</Text>
          <Text style={styles.date}>Hoje, {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Progresso Diário</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.circleContainer}>
              <Svg width="160" height="160" style={styles.progressRing}>
                <Circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#333333"
                  strokeWidth="8"
                  fill="transparent"
                />
                <AnimatedCircle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#ffffff"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="377"
                  strokeLinecap="round"
                  animatedProps={animatedProps}
                  transform="rotate(-90 80 80)"
                />
              </Svg>
              <View style={styles.progressText}>
                <Text style={styles.consumedText}>{consumed}</Text>
                <Text style={styles.kcalText}>kcal</Text>
              </View>
            </View>
          </View>

          <View style={styles.goalInfo}>
            <Text style={styles.goalText}>Meta: {goal} kcal</Text>
            <Text style={styles.percentageText}>{Math.round(percentage)}% da meta</Text>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Refeições Recentes</Text>
          {recentMeals.map((meal, index) => (
            <View key={index} style={styles.mealCard}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão de modo desenvolvedor - REMOVER ANTES DO LANÇAMENTO */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => setUserIsPremium(!userIsPremium)}
        >
          <Text style={styles.devButtonText}>
            {userIsPremium ? 'DEV: Premium ON' : 'DEV: Premium OFF'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, buttonStyle]}>
        <TouchableOpacity style={styles.fabButton} onPress={handlePlusPress}>
          <Plus size={32} color="#000000" strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#888888',
  },
  mainCard: {
    backgroundColor: '#111111',
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222222',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    transform: [{ rotate: '-90deg' }],
  },
  progressText: {
    position: 'absolute',
    alignItems: 'center',
  },
  consumedText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  kcalText: {
    fontSize: 14,
    color: '#888888',
    marginTop: -4,
  },
  goalInfo: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 4,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  recentSection: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#888888',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devButton: {
    position: 'absolute',
    bottom: 200,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  devButtonText: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.7,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraFlipButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFlipText: {
    fontSize: 18,
  },
  cameraFocusArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  cameraControls: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  cameraButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
  },
  captureLoadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});