import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setProducts, removeProduct } from '../store/slices/productSlice';
import { initDatabase, getAllProducts, deleteProduct } from '../utils/db';
import { Colors } from '../theme/colors';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from '../components/AddProductModal';
import { Plus, Search, MapPin, Bell, ChevronDown, History, ReceiptText } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [modalVisible, setModalVisible] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        const storedProducts = await getAllProducts();
        dispatch(setProducts(storedProducts));
      } catch (error) {
        console.error('Failed to init DB:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    setup();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      dispatch(removeProduct(id));
      Toast.show({ type: 'success', text1: 'Item removed', text2: 'Your inventory was updated.' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete item.' });
    }
  };

// handleRecordSale removed as it is now handled via navigation in ProductCard

  const renderHeader = () => (
    <View style={styles.yummyHeader}>
      <View style={styles.locationRow}>
        <View style={styles.locationInfo}>
          <MapPin size={18} color={Colors.primary} />
          <Text style={styles.locationText}>Main Warehouse, Lagos</Text>
          <ChevronDown size={14} color={Colors.textMuted} />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notifBtn}
            onPress={() => navigation.navigate('SalesHistory')}
          >
            <History size={22} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greetingArea}>
        <Text style={styles.greetingText}>Hello, Okoye Peter! 👋</Text>
        <Text style={styles.taglineText}>What's moving in stock today?</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInner}>
          <Search size={20} color={Colors.textMuted} />
          <TextInput 
            placeholder="Search products, orders..." 
            style={styles.searchInput}
            placeholderTextColor={Colors.textMuted}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterBtn}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => {
    const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValue = products.reduce((acc, p) => acc + (parseFloat(p.price) * p.quantity), 0);

    return (
      <View style={styles.statsRow}>
        <View style={[styles.statItem, { backgroundColor: '#F0F5FF' }]}>
          <Text style={styles.statLabel}>STOCK VALUATION</Text>
          <Text style={[styles.statValue, { color: Colors.accentBlue }]}>${totalValue.toLocaleString()}</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: '#FFF7ED' }]}>
          <Text style={styles.statLabel}>TOTAL UNITS</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{totalItems}</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Nothing here yet!</Text>
      <Text style={styles.emptySubtitle}>Start adding items to build your inventory.</Text>
      <TouchableOpacity 
        style={styles.yummyAddBtn}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.yummyAddText}>Add First Product</Text>
      </TouchableOpacity>
    </View>
  );

  if (isInitializing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <>
              {renderHeader()}
              {renderStats()}
              <Text style={styles.sectionTitle}>Product Inventory</Text>
            </>
          )}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              navigation={navigation}
              onDelete={handleDelete} 
            />
          )}
          contentContainerStyle={styles.listArea}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <AddProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  yummyHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentRed,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  greetingArea: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  taglineText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  filterBtn: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listArea: {
    paddingBottom: 40,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  yummyAddBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  yummyAddText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
