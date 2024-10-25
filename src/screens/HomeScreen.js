import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, IconButton } from 'react-native-paper';

const theme = {
  colors: {
    primary: '#1E4D8C',
    secondary: '#34A853',
    accent: '#4285F4',
    background: '#F8FAFD',
    surface: '#FFFFFF',
    error: '#DC3545',
    text: '#1A1F36',
    disabled: '#A0AEC0',
    placeholder: '#718096',
  },
};

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.userName}>Carlos</Text>
        </View>
        <Avatar.Image 
          size={50} 
          source={{ uri: 'https://ui-avatars.com/api/?name=Carlos&background=1E4D8C&color=fff' }}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Avatar.Icon 
              size={40} 
              icon="trending-up" 
              style={styles.statsIcon} 
              color={theme.colors.secondary}
            />
            <Text style={styles.statsValue}>$2,450</Text>
            <Text style={styles.statsLabel}>Ahorros del mes</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Avatar.Icon 
              size={40} 
              icon="list-status" 
              style={styles.statsIcon} 
              color={theme.colors.accent}
            />
            <Text style={styles.statsValue}>15</Text>
            <Text style={styles.statsLabel}>Listas activas</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      <View style={styles.actionsGrid}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('Products')}>
          <Card.Content style={styles.actionCardContent}>
            <Avatar.Icon 
              size={40} 
              icon="shopping" 
              style={styles.actionIcon}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Productos</Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard} onPress={() => navigation.navigate('Shops')}>
          <Card.Content style={styles.actionCardContent}>
            <Avatar.Icon 
              size={40} 
              icon="store" 
              style={styles.actionIcon}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Tiendas</Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard} onPress={() => navigation.navigate('Lists')}>
          <Card.Content style={styles.actionCardContent}>
            <Avatar.Icon 
              size={40} 
              icon="format-list-bulleted" 
              style={styles.actionIcon}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>Mis Listas</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Promo Card */}
      <Card style={styles.promoCard}>
        <Card.Content style={styles.promoContent}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>¡Nuevo!</Text>
            <Text style={styles.promoDescription}>
              Compara precios entre tiendas y ahorra en tus compras
            </Text>
            <Button 
              mode="contained"
              onPress={() => {}}
              style={styles.promoButton}
              theme={{ colors: theme.colors }}
            >
              Probar ahora
            </Button>
          </View>
          <Avatar.Icon 
            size={80} 
            icon="cash-multiple" 
            style={styles.promoIcon}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    elevation: 2,
  },
  statsIcon: {
    backgroundColor: 'transparent',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  actionCard: {
    width: '30%',
    marginHorizontal: '1.66%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  actionCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  promoCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: `${theme.colors.primary}05`,
    elevation: 2,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  promoTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
  },
  promoButton: {
    alignSelf: 'flex-start',
  },
  promoIcon: {
    backgroundColor: `${theme.colors.primary}10`,
  },
});

export default HomeScreen;