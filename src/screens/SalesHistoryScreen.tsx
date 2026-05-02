import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllSales } from '../utils/db';
import { Colors } from '../theme/colors';
import { ChevronLeft, ReceiptText, Calendar, User, Package } from 'lucide-react-native';

export const SalesHistoryScreen = ({ navigation }: any) => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getAllSales();
        setSales(data);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderSaleItem = ({ item }: { item: any }) => (
    <View style={styles.saleCard}>
      <View style={styles.productRow}>
        <View style={styles.imageBox}>
          <Image source={{ uri: item.productImage }} style={styles.productImg} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <View style={styles.dateRow}>
            <Calendar size={12} color={Colors.textMuted} />
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>x{item.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.customerRow}>
        <View style={styles.customerInfo}>
          <User size={14} color={Colors.primary} />
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales History</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id}
          renderItem={renderSaleItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyArea}>
              <ReceiptText size={48} color={Colors.border} />
              <Text style={styles.emptyTitle}>No sales yet</Text>
              <Text style={styles.emptySubtitle}>Start selling items to see your history here.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  saleCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: 12,
    marginBottom: 12,
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  quantityBadge: {
    backgroundColor: '#F0F5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  emptyArea: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
