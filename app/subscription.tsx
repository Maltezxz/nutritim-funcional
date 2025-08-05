import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check, X, Star, Zap, Target, History } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  useAnimatedProps,
} from 'react-native-reanimated';

export default function Subscription() {
  const premiumScale = useSharedValue(1);

  const handleSubscribe = () => {
    premiumScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Simular assinatura - aqui seria integração com RevenueCat
    setTimeout(() => {
      router.back();
    }, 200);
  };

  const premiumButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: premiumScale.value }],
  }));

  const features = {
    free: [
      { text: '2 análises por dia', included: true },
      { text: 'Histórico básico (7 dias)', included: true },
      { text: 'Informações nutricionais básicas', included: true },
      { text: 'Análises ilimitadas', included: false },
      { text: 'Histórico completo', included: false },
      { text: 'Metas personalizadas', included: false },
      { text: 'Relatórios detalhados', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
    premium: [
      { text: 'Análises ilimitadas', included: true },
      { text: 'Histórico completo', included: true },
      { text: 'Metas personalizadas', included: true },
      { text: 'Relatórios detalhados', included: true },
      { text: 'IA mais precisa', included: true },
      { text: 'Análise de macronutrientes', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'Sem anúncios', included: true },
    ]
  };

  const benefits = [
    {
      icon: <Zap size={24} color="#ffffff" strokeWidth={1.5} />,
      title: 'Análises Ilimitadas',
      description: 'Escaneie quantos alimentos quiser, sem limites diários'
    },
    {
      icon: <History size={24} color="#ffffff" strokeWidth={1.5} />,
      title: 'Histórico Completo',
      description: 'Acesse todo seu histórico nutricional, sem prazo de validade'
    },
    {
      icon: <Target size={24} color="#ffffff" strokeWidth={1.5} />,
      title: 'Metas Personalizadas',
      description: 'Configure metas específicas para seus objetivos de saúde'
    },
    {
      icon: <Star size={24} color="#ffffff" strokeWidth={1.5} />,
      title: 'IA Mais Precisa',
      description: 'Tecnologia avançada para análises mais detalhadas e precisas'
    },
  ];

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
        <Text style={styles.headerTitle}>NutriScan Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.premiumBadge}>
            <Star size={20} color="#000000" strokeWidth={2} />
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Desbloqueie o poder completo{'\n'}do NutriScan
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Análises ilimitadas, histórico completo e muito mais
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Por que Premium?</Text>
          
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                {benefit.icon}
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Comparison Table */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Compare os Planos</Text>
          
          <View style={styles.comparisonTable}>
            {/* Headers */}
            <View style={styles.comparisonHeader}>
              <View style={styles.featureColumn}>
                <Text style={styles.comparisonHeaderText}>Recursos</Text>
              </View>
              <View style={styles.planColumn}>
                <Text style={styles.comparisonHeaderText}>Free</Text>
              </View>
              <View style={styles.planColumn}>
                <View style={styles.premiumHeader}>
                  <Text style={styles.comparisonHeaderText}>Premium</Text>
                  <Star size={16} color="#ffffff" strokeWidth={1.5} />
                </View>
              </View>
            </View>

            {/* Feature Rows */}
            {features.free.map((feature, index) => (
              <View key={index} style={styles.comparisonRow}>
                <View style={styles.featureColumn}>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
                <View style={styles.planColumn}>
                  {feature.included ? (
                    <Check size={20} color="#22c55e" strokeWidth={2} />
                  ) : (
                    <X size={20} color="#ef4444" strokeWidth={2} />
                  )}
                </View>
                <View style={styles.planColumn}>
                  <Check size={20} color="#22c55e" strokeWidth={2} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>R$ 19,90</Text>
            <Text style={styles.pricePeriod}>por mês</Text>
            <Text style={styles.priceDescription}>
              Cancele quando quiser
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <Animated.View style={premiumButtonStyle}>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribe}
            >
              <Text style={styles.subscribeButtonText}>
                Assinar Premium
              </Text>
              <Star size={20} color="#000000" strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.back()}
          >
            <Text style={styles.continueButtonText}>
              Continuar com Free
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ⚠️ Esta é uma simulação. Integração real com RevenueCat será implementada posteriormente.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#111111',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
  },
  comparisonSection: {
    marginBottom: 32,
  },
  comparisonTable: {
    backgroundColor: '#111111',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222222',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#222222',
    paddingVertical: 16,
  },
  comparisonHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  featureColumn: {
    flex: 2,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#ffffff',
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  priceCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    minWidth: 200,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  priceDescription: {
    fontSize: 12,
    color: '#888888',
  },
  ctaSection: {
    gap: 12,
    marginBottom: 32,
  },
  subscribeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888888',
  },
  footer: {
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#fbbf24',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});