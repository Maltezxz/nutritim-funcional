import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { User, CreditCard as Edit3, Save } from 'lucide-react-native';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    weight: '75',
    goalWeight: '70',
    calories: '2000',
    height: '175',
    age: '28',
    trainingFrequency: '3-5x por semana',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aqui seria onde salvamos os dados - por enquanto apenas mockado
  };

  const ProfileField = ({ label, value, onChangeText, keyboardType = 'default' }: any) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="#666666"
        />
      ) : (
        <View style={styles.fieldValue}>
          <Text style={styles.fieldText}>{value}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Perfil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <Save size={20} color="#ffffff" strokeWidth={1.5} />
            ) : (
              <Edit3 size={20} color="#ffffff" strokeWidth={1.5} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Gerencie suas informações</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={40} color="#666666" strokeWidth={1.5} />
          </View>
          <Text style={styles.username}>Usuário</Text>
          <Text style={styles.userStatus}>Conta Free</Text>
        </View>

        {/* Profile Data */}
        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          
          <ProfileField
            label="Peso atual (kg)"
            value={userData.weight}
            onChangeText={(text: string) => setUserData({...userData, weight: text})}
            keyboardType="numeric"
          />

          <ProfileField
            label="Meta de peso (kg)"
            value={userData.goalWeight}
            onChangeText={(text: string) => setUserData({...userData, goalWeight: text})}
            keyboardType="numeric"
          />

          <ProfileField
            label="Meta de calorias (kcal)"
            value={userData.calories}
            onChangeText={(text: string) => setUserData({...userData, calories: text})}
            keyboardType="numeric"
          />

          <ProfileField
            label="Altura (cm)"
            value={userData.height}
            onChangeText={(text: string) => setUserData({...userData, height: text})}
            keyboardType="numeric"
          />

          <ProfileField
            label="Idade (anos)"
            value={userData.age}
            onChangeText={(text: string) => setUserData({...userData, age: text})}
            keyboardType="numeric"
          />

          <ProfileField
            label="Frequência de treino"
            value={userData.trainingFrequency}
            onChangeText={(text: string) => setUserData({...userData, trainingFrequency: text})}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Análises</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Dias ativos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>1.8k</Text>
              <Text style={styles.statLabel}>Kcal média</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Meta atingida</Text>
            </View>
          </View>
        </View>

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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#111111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222222',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#111111',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#222222',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#888888',
  },
  dataSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  fieldInput: {
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
  },
  fieldValue: {
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  fieldText: {
    fontSize: 16,
    color: '#ffffff',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});