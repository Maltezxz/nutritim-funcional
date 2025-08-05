import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Utensils } from 'lucide-react-native';

export default function History() {
  const historyData = [
    {
      id: 1,
      date: 'Hoje',
      meals: [
        { name: 'Pão integral com ovos', calories: 420, time: '08:30', type: 'breakfast' },
        { name: 'Salada Caesar', calories: 680, time: '12:45', type: 'lunch' },
        { name: 'Iogurte grego', calories: 150, time: '15:20', type: 'snack' },
      ]
    },
    {
      id: 2,
      date: 'Ontem',
      meals: [
        { name: 'Smoothie de frutas', calories: 280, time: '07:45', type: 'breakfast' },
        { name: 'Frango grelhado', calories: 520, time: '13:15', type: 'lunch' },
        { name: 'Castanhas', calories: 180, time: '16:00', type: 'snack' },
        { name: 'Salmão com legumes', calories: 640, time: '19:30', type: 'dinner' },
      ]
    },
    {
      id: 3,
      date: 'Anteontem',
      meals: [
        { name: 'Aveia com banana', calories: 350, time: '08:00', type: 'breakfast' },
        { name: 'Wrap de frango', calories: 480, time: '12:30', type: 'lunch' },
        { name: 'Maçã', calories: 95, time: '15:45', type: 'snack' },
        { name: 'Massa integral', calories: 550, time: '20:00', type: 'dinner' },
      ]
    },
  ];

  const getMealIcon = (type: string) => {
    return <Utensils size={16} color="#888888" strokeWidth={1.5} />;
  };

  const getDayTotal = (meals: any[]) => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Suas refeições analisadas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {historyData.map((day) => (
          <View key={day.id} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <View style={styles.dayInfo}>
                <Calendar size={20} color="#ffffff" strokeWidth={1.5} />
                <Text style={styles.dayTitle}>{day.date}</Text>
              </View>
              <Text style={styles.dayTotal}>
                {getDayTotal(day.meals)} kcal
              </Text>
            </View>

            {day.meals.map((meal, index) => (
              <TouchableOpacity key={index} style={styles.mealItem}>
                <View style={styles.mealIcon}>
                  {getMealIcon(meal.type)}
                </View>
                
                <View style={styles.mealDetails}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealMeta}>
                    <Clock size={12} color="#666666" strokeWidth={1.5} />
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                </View>

                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  daySection: {
    marginBottom: 32,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  dayTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  mealItem: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  mealIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#222222',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomPadding: {
    height: 100,
  },
});