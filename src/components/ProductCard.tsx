import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Product } from '../store/slices/productSlice';
import { Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react-native';

// No props interface needed here as we use inline types for the component

export const ProductCard: React.FC<{ product: Product, navigation: any, onDelete?: (id: string) => void }> = ({ product, navigation, onDelete }) => {
  const isLowStock = product.quantity <= product.quantityToWarn;
  const isOutOfStock = product.quantity <= 0;

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {isOutOfStock && <View style={styles.stockOverlay}><Text style={styles.stockOverlayText}>OUT</Text></View>}
        </View>

        <TouchableOpacity 
          onPress={() => onDelete && onDelete(product.id)} 
          style={styles.deleteIndicator}
        >
          <Trash2 size={14} color={Colors.accentRed} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceSymbol}>$</Text>
              <Text style={styles.priceText}>{parseFloat(product.price).toFixed(2)}</Text>
            </View>
            <View style={[styles.stockBadge, isLowStock && styles.stockAlert]}>
              <Text style={[styles.stockText, isLowStock && styles.stockAlertText]}>
                {product.quantity} left
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
             <View style={styles.trendInfo}>
                <TrendingUp size={12} color={Colors.accentGreen} />
                <Text style={styles.trendText}>Fast Moving</Text>
             </View>
             <TouchableOpacity 
                style={styles.yummyPlus}
                onPress={() => navigation.navigate('RecordSale', { productId: product.id })}
              >
                <Plus size={20} color={Colors.white} strokeWidth={3} />
              </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#F9F9F9',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(29, 29, 40, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockOverlayText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  deleteIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 1,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  stockBadge: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textLight,
  },
  stockAlert: {
    backgroundColor: '#FFF0F0',
  },
  stockAlertText: {
    color: Colors.accentRed,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accentGreen,
  },
  yummyPlus: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
