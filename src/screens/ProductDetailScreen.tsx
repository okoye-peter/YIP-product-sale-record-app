import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getProductSales } from '../utils/db';
import { Colors } from '../theme/colors';
import { ChevronLeft, ShoppingBag, Calendar, User, TrendingUp, AlertCircle, Plus } from 'lucide-react-native';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === productId)
  );

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getProductSales(productId);
        setSales(data);
      } catch (error) {
        console.error('Failed to fetch product sales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [productId]);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLowStock = product.quantity <= product.quantityToWarn;

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Product Detail</Text>
      <View style={{ width: 44 }} />
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.infoSection}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.mainImage} />
        {isLowStock && (
          <View style={styles.lowStockBadge}>
            <AlertCircle size={14} color={Colors.white} />
            <Text style={styles.lowStockText}>Low Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.detailsBox}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Current Price</Text>
          <Text style={styles.priceValue}>${parseFloat(product.price).toFixed(2)}</Text>
        </View>
        
        <View style={styles.stockRow}>
          <View style={styles.stockCard}>
            <Text style={styles.stockLabel}>IN STOCK</Text>
            <Text style={[styles.stockValue, isLowStock && { color: Colors.accentRed }]}>
              {product.quantity} units
            </Text>
          </View>
          <View style={styles.stockCard}>
            <Text style={styles.stockLabel}>THRESHOLD</Text>
            <Text style={styles.stockValue}>{product.quantityToWarn} units</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.recordBtn}
        onPress={() => navigation.navigate('RecordSale', { productId: product.id })}
      >
        <Plus size={20} color={Colors.white} strokeWidth={3} />
        <Text style={styles.recordBtnText}>Record New Sale</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSaleItem = ({ item }: { item: any }) => (
    <View style={styles.saleItem}>
      <View style={styles.saleIcon}>
        <TrendingUp size={16} color={Colors.success} />
      </View>
      <View style={styles.saleInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.saleDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.saleQuantity}>
        <Text style={styles.qtyText}>-{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderProductInfo()}
        
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Sale History</Text>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : sales.length > 0 ? (
            sales.map((sale) => <View key={sale.id}>{renderSaleItem({ item: sale })}</View>)
          ) : (
            <View style={styles.emptyHistory}>
              <ShoppingBag size={40} color={Colors.border} />
              <Text style={styles.emptyText}>No sales recorded yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  circleBtn: {
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
  scrollContent: {
    paddingBottom: 40,
  },
  infoSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 40,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.accentRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lowStockText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  detailsBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  productName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  stockRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stockCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  recordBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  recordBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  historySection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  saleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  saleInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  saleDate: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  saleQuantity: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accentRed,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
