import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const steps = [
  {
    id: 1,
    title: 'Qual seu peso atual?',
    placeholder: '75',
    unit: 'kg',
    type: 'numeric',
  },
  {
    id: 2,
    title: 'Qual sua meta de peso?',
    placeholder: '70',
    unit: 'kg',
    type: 'numeric',
  },
  {
    id: 3,
    title: 'Meta de calorias diárias?',
    placeholder: '2000',
    unit: 'kcal',
    type: 'numeric',
  },
  {
    id: 4,
    title: 'Qual sua altura?',
    placeholder: '175',
    unit: 'cm',
    type: 'numeric',
  },
  {
    id: 5,
    title: 'Qual sua idade?',
    placeholder: '28',
    unit: 'anos',
    type: 'numeric',
  },
  {
    id: 6,
    title: 'Frequência de treino semanal?',
    placeholder: '',
    unit: '',
    type: 'options',
    options: ['Nenhuma', '1-2x', '3-5x', '6+'],
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(steps.length).fill(''));
  const [selectedOption, setSelectedOption] = useState('');
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar onboarding
      router.push('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    updateAnswer(option);
  };

  const canProceed = () => {
    if (steps[currentStep].type === 'options') {
      return selectedOption !== '';
    }
    return answers[currentStep] !== '';
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft 
            size={24} 
            color={currentStep === 0 ? '#333333' : '#ffffff'} 
            strokeWidth={1.5} 
          />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} de {steps.length}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>

          {currentStepData.type === 'numeric' ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={answers[currentStep]}
                onChangeText={updateAnswer}
                placeholder={currentStepData.placeholder}
                placeholderTextColor="#666666"
                keyboardType="numeric"
                maxLength={4}
              />
              <Text style={styles.unit}>{currentStepData.unit}</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {currentStepData.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Text>
          <ChevronRight 
            size={20} 
            color={canProceed() ? '#000000' : '#666666'} 
            strokeWidth={1.5} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '70%',
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
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#222222',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    justifyContent: 'center',
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 36,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    minWidth: 120,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    paddingBottom: 8,
    marginRight: 16,
  },
  unit: {
    fontSize: 24,
    color: '#888888',
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#222222',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  optionTextSelected: {
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    paddingTop: 20,
    backgroundColor: '#000000',
  },
  nextButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#222222',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  nextButtonTextDisabled: {
    color: '#666666',
  },
});