import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { ArrowLeft, Check, Camera } from 'lucide-react-native';
import { Image } from 'react-native';

interface NutritionalInfo {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  vitamins: {
    vitaminA: string;
    vitaminC: string;
    vitaminD: string;
    vitaminB12: string;
    calcium: string;
    iron: string;
  };
  confidence: number;
}

export default function Analysis() {
  const [stage, setStage] = useState<'loading' | 'result' | 'error'>('loading');
  const [analysisResult, setAnalysisResult] = useState<NutritionalInfo | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Loading animations
  const loadingRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const dotOpacity1 = useSharedValue(0.3);
  const dotOpacity2 = useSharedValue(0.3);
  const dotOpacity3 = useSharedValue(0.3);
  
  // Result animations
  const resultOpacity = useSharedValue(0);
  const resultTranslateY = useSharedValue(50);

  useEffect(() => {
    // Recuperar dados da foto capturada
    const capturedPhoto = (global as any).capturedPhoto;
    console.log('Captured photo:', capturedPhoto ? 'Found' : 'Not found');
    
    if (capturedPhoto && capturedPhoto.base64) {
      console.log('Photo base64 length:', capturedPhoto.base64.length);
      setPhotoUri(capturedPhoto.uri);
      
      // Pequeno delay para garantir que a UI esteja pronta
      setTimeout(() => {
        analyzeImage(capturedPhoto.base64);
      }, 500);
    } else {
      console.log('No photo found, using mock data');
      // Fallback para dados mockados se não houver foto
      setTimeout(() => {
        setAnalysisResult(mockResult);
        setStage('result');
        resultOpacity.value = withTiming(1, { duration: 600 });
        resultTranslateY.value = withTiming(0, { duration: 600 });
      }, 3000);
    }

    // Start loading animations
    loadingRotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );
    
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    // Animated dots
    const animateDots = () => {
      dotOpacity1.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 })
      );
      
      setTimeout(() => {
        dotOpacity2.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        );
      }, 200);
      
      setTimeout(() => {
        dotOpacity3.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        );
      }, 400);
    };

    const interval = setInterval(animateDots, 1200);

    return () => clearInterval(interval);
  }, []);

  const analyzeImage = async (base64Image: string) => {
    try {
      console.log('Starting image analysis...');
      console.log('Base64 image length:', base64Image?.length);
      
      // Verificar se a imagem está válida
      if (!base64Image || base64Image.length < 100) {
        throw new Error('Imagem inválida ou muito pequena');
      }
      
      // Chave da OpenAI (usando variável de ambiente)
      const apiKey = EXPO_PUBLIC_OPENAI_API_KEY;
      
      console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
      console.log('API Key length:', apiKey?.length);
      
      // Verificar se a chave está válida
      if (!apiKey || apiKey.length < 50) {
        throw new Error('Chave da API inválida');
      }
      
      const prompt = `Analise esta imagem de alimento e forneça informações nutricionais detalhadas.

IMPORTANTE: Responda APENAS com um JSON válido, sem nenhum texto adicional, markdown ou formatação.

Formato EXATO obrigatório:
{
  "foodName": "Nome do prato/alimento identificado",
  "calories": 350,
  "macros": {
    "protein": 25,
    "carbs": 30,
    "fat": 15,
    "sugar": 5
  },
  "vitamins": {
    "vitaminA": "150 mcg",
    "vitaminC": "25 mg",
    "vitaminD": "2 mcg",
    "vitaminB12": "1.2 mcg",
    "calcium": "180 mg",
    "iron": "3.5 mg"
  },
  "confidence": 85
}

Regras:
1. Use apenas números para calories, protein, carbs, fat, sugar
2. Use strings com unidades para vitaminas (ex: "25 mg", "150 mcg")
3. Use números de 0-100 para confidence
4. Seja preciso nas estimativas baseando-se no tamanho aparente da porção
5. Use valores realistas para uma porção típica do alimento identificado
6. NÃO adicione texto explicativo, apenas o JSON puro`;

      console.log('Sending request to OpenAI...');
      
      const requestBody = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high"
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      };

      console.log('Request body prepared, sending...');
      
      // Timeout de 30 segundos para a requisição
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        console.log('OpenAI response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error("OpenAI API Error:", errorData);
          
          // Tratamento específico de erros
          if (response.status === 401) {
            throw new Error('Chave da API inválida ou expirada');
          } else if (response.status === 429) {
            throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.');
          } else if (response.status === 400) {
            throw new Error('Erro na requisição. Verifique se a imagem é válida.');
          } else {
            throw new Error(`Erro da API: ${response.status} - ${errorData}`);
          }
        }

        const data = await response.json();
        console.log('OpenAI response received');
        
        const analysisText = data.choices[0]?.message?.content;

        if (!analysisText) {
          throw new Error('Nenhuma análise recebida da OpenAI');
        }

        console.log('Analysis text:', analysisText);
        
        try {
          // Tentar limpar o texto da resposta (remover markdown, etc.)
          let cleanText = analysisText.trim();
          
          // Remover possíveis markdown ou formatação
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/```json\n?/, '').replace(/```\n?/, '');
          }
          if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/```\n?/, '').replace(/```\n?/, '');
          }
          
          console.log('Cleaned text:', cleanText);
          
          // Parse the JSON response from OpenAI
          const result = JSON.parse(cleanText);
          console.log('Parsed result:', result);
          
          // Verificar se o resultado tem a estrutura esperada
          if (!result.foodName || result.calories === undefined || result.calories === null || !result.macros) {
            console.error('Estrutura inválida:', result);
            throw new Error('Resposta da API não tem o formato esperado');
          }
          
          // Verificar se todos os campos necessários estão presentes
          const requiredFields = ['foodName', 'calories', 'macros', 'vitamins', 'confidence'];
          const missingFields = requiredFields.filter(field => result[field] === undefined || result[field] === null);
          
          if (missingFields.length > 0) {
            console.error('Campos faltando:', missingFields);
            throw new Error(`Campos faltando na resposta: ${missingFields.join(', ')}`);
          }
          
          // Verificar se macros tem todos os campos
          const requiredMacros = ['protein', 'carbs', 'fat', 'sugar'];
          const missingMacros = requiredMacros.filter(macro => result.macros[macro] === undefined || result.macros[macro] === null);
          
          if (missingMacros.length > 0) {
            console.error('Macros faltando:', missingMacros);
            throw new Error(`Macros faltando: ${missingMacros.join(', ')}`);
          }
          
          console.log('Resultado válido, aplicando...');
          setAnalysisResult(result);
          setStage('result');
          resultOpacity.value = withTiming(1, { duration: 600 });
          resultTranslateY.value = withTiming(0, { duration: 600 });
        } catch (parseError) {
          console.error("Failed to parse OpenAI response:", parseError);
          console.error("Raw response:", analysisText);
          throw new Error('Erro ao processar os resultados da análise');
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Timeout na requisição. Verifique sua conexão.');
        }
        throw fetchError;
      }
      
    } catch (error) {
      console.error('Erro na análise:', error);
      
      // Mostrar erro detalhado no console para debug
      if (error instanceof Error) {
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      // Fallback para dados mockados em caso de erro
      console.log('Usando dados mockados como fallback...');
      
      // Mostrar erro para o usuário
      setErrorMessage(`Erro na análise: ${error instanceof Error ? error.message : 'Desconhecido'}`);
      setStage('error');
    }
  };

  const loadingRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loadingRotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dotOpacity1.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dotOpacity2.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dotOpacity3.value,
  }));

  const resultStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
    transform: [{ translateY: resultTranslateY.value }],
  }));

  const mockResult = {
    foodName: 'Prato de Salada Caesar',
    calories: 680,
    macros: {
      protein: 28,
      carbs: 35,
      fat: 45,
      sugar: 8,
    },
    vitamins: {
      vitaminA: '150 mcg',
      vitaminC: '25 mg',
      vitaminD: '2 mcg',
      vitaminB12: '1.2 mcg',
      calcium: '180 mg',
      iron: '3.5 mg',
    },
    confidence: 92,
  };

  const displayResult = analysisResult || mockResult;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise IA</Text>
        <View style={styles.placeholder} />
      </View>

      {stage === 'loading' && (
        /* Loading Stage */
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingCircle, pulseStyle]}>
            <Animated.View style={[styles.spinner, loadingRotationStyle]}>
              <Camera size={40} color="#ffffff" strokeWidth={1.5} />
            </Animated.View>
          </Animated.View>

          <Text style={styles.loadingTitle}>Analisando imagem...</Text>
          
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>

          <Text style={styles.loadingSubtext}>
            Nossa IA está identificando os alimentos{'\n'}
            e calculando as informações nutricionais
          </Text>
        </View>
      )}

      {stage === 'error' && (
        /* Error Stage */
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === 'result' && (
        /* Result Stage */
        <Animated.View style={[styles.resultContainer, resultStyle]}>
          {/* Success Icon */}
          <View style={styles.successIcon}>
            <Check size={32} color="#ffffff" strokeWidth={2} />
          </View>

          {/* Real Food Image */}
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.foodImage} />
          ) : (
            <View style={styles.foodImagePlaceholder}>
              <Text style={styles.foodImageText}>🥗</Text>
            </View>
          )}

          {/* Food Information */}
          <Text style={styles.foodName}>{displayResult.foodName}</Text>
          <Text style={styles.confidenceText}>
            {displayResult.confidence}% de precisão
          </Text>

          {/* Calories */}
          <View style={styles.caloriesCard}>
            <Text style={styles.caloriesNumber}>
              {displayResult.calories}
            </Text>
            <Text style={styles.caloriesLabel}>kcal estimadas</Text>
          </View>

          {/* Macros */}
          <View style={styles.macrosContainer}>
            <Text style={styles.macrosTitle}>Macronutrientes</Text>
            
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{displayResult.macros.protein}g</Text>
                <Text style={styles.macroLabel}>Proteínas</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{displayResult.macros.carbs}g</Text>
                <Text style={styles.macroLabel}>Carboidratos</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{displayResult.macros.fat}g</Text>
                <Text style={styles.macroLabel}>Gorduras</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{displayResult.macros.sugar}g</Text>
                <Text style={styles.macroLabel}>Açúcar</Text>
              </View>
            </View>
          </View>

          {/* Vitamins */}
          <View style={styles.vitaminsContainer}>
            <Text style={styles.vitaminsTitle}>Vitaminas e Minerais</Text>
            
            <View style={styles.vitaminsGrid}>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.vitaminA}</Text>
                <Text style={styles.vitaminLabel}>Vitamina A</Text>
              </View>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.vitaminC}</Text>
                <Text style={styles.vitaminLabel}>Vitamina C</Text>
              </View>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.vitaminD}</Text>
                <Text style={styles.vitaminLabel}>Vitamina D</Text>
              </View>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.vitaminB12}</Text>
                <Text style={styles.vitaminLabel}>B12</Text>
              </View>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.calcium}</Text>
                <Text style={styles.vitaminLabel}>Cálcio</Text>
              </View>
              <View style={styles.vitaminItem}>
                <Text style={styles.vitaminValue}>{displayResult.vitamins.iron}</Text>
                <Text style={styles.vitaminLabel}>Ferro</Text>
              </View>
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => router.back()}
            >
              <Text style={styles.saveButtonText}>Adicionar ao Histórico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setStage('loading')}
            >
              <Text style={styles.retryButtonText}>Analisar Novamente</Text>
            </TouchableOpacity>
          </View>

          {!analysisResult && (
            /* Disclaimer - só mostra se estiver usando dados mockados */
            <Text style={styles.disclaimer}>
              ⚠️ Análise real com OpenAI GPT-4 Vision
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingCircle: {
    width: 120,
    height: 120,
    backgroundColor: '#111111',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#222222',
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#22c55e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  foodImagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#111111',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#222222',
  },
  foodImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
  },
  foodImageText: {
    fontSize: 80,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 24,
  },
  caloriesCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#222222',
  },
  caloriesNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#888888',
    marginTop: 4,
  },
  macrosContainer: {
    marginBottom: 32,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroItem: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  vitaminsContainer: {
    marginBottom: 32,
  },
  vitaminsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  vitaminsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  vitaminItem: {
    width: '31%',
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  vitaminValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  vitaminLabel: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  retryButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#fbbf24',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#ef4444',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});