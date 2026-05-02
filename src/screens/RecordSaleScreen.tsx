import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { recordSale } from '../store/slices/productSlice';
import { saveSale, updateProductQuantity } from '../utils/db';
import { Colors } from '../theme/colors';
import { Input } from '../components/ui/Input';
import { ChevronLeft, Info, ShoppingBag, ArrowRight } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export const RecordSaleScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === productId)
  );

  const [customerName, setCustomerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <ShoppingBag size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>Item not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.errorBtn}>
          <Text style={styles.errorBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSale = async () => {
    const qty = parseInt(quantity);

    if (!customerName) {
      Toast.show({ type: 'error', text1: 'Who is buying?', text2: 'Please enter customer name.' });
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      Toast.show({ type: 'error', text1: 'Quantity?', text2: 'Enter a valid amount.' });
      return;
    }

    if (qty > product.quantity) {
      Toast.show({ type: 'error', text1: 'Stock Low', text2: `Only ${product.quantity} units available.` });
      return;
    }

    setLoading(true);
    const newQuantity = product.quantity - qty;

    try {
      const sale = {
        id: Date.now().toString(),
        productId: product.id,
        customerName,
        quantity: qty,
        createdAt: Date.now(),
      };

      await saveSale(sale);
      await updateProductQuantity(product.id, newQuantity);
      
      dispatch(recordSale({ productId: product.id, quantity: qty }));
      
      const updatedQuantity = product.quantity - qty;

      Toast.show({
        type: 'success',
        text1: 'Sale Recorded!',
        text2: `Sold ${qty} units to ${customerName}.`
      });

      if (updatedQuantity <= product.quantityToWarn) {
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: 'Low Stock Alert',
            text2: `${product.name} is now at ${updatedQuantity} units.`,
            visibilityTime: 4000,
          });
        }, 1500);
      }

      setTimeout(() => {
        navigation.goBack();
      }, updatedQuantity <= product.quantityToWarn ? 3000 : 1000);

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Transaction Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.yummyHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.yummyBack}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.orderCard}>
            <View style={styles.imageBox}>
              <Image source={{ uri: product.image }} style={styles.productImg} />
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</Text>
              <View style={styles.stockRow}>
                 <View style={styles.stockDot} />
                 <Text style={styles.stockText}>{product.quantity} units available</Text>
              </View>
            </View>
          </View>

          <View style={styles.formArea}>
            <Text style={styles.formTitle}>Transaction Info</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Customer Identity</Text>
              <Input
                placeholder="Who is buying this?"
                value={customerName}
                onChangeText={setCustomerName}
                containerStyle={styles.yummyInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Order Quantity</Text>
              <Input
                placeholder="1"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                containerStyle={styles.yummyInput}
              />
            </View>

            <View style={styles.warningBox}>
               <View style={styles.infoCircle}>
                  <Info size={16} color={Colors.primary} />
               </View>
               <Text style={styles.warningText}>
                 Inventory will be updated automatically upon confirmation.
               </Text>
            </View>

            <TouchableOpacity 
              style={styles.yummyConfirm}
              onPress={handleSale}
              disabled={loading}
            >
              <Text style={styles.yummyConfirmText}>{loading ? 'Processing...' : 'Complete Transaction'}</Text>
              <ArrowRight size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  yummyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  yummyBack: {
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
  scrollArea: {
    padding: 24,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  metaBox: {
    marginLeft: 20,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  formArea: {
    marginTop: 8,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 20,
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 8,
    marginLeft: 4,
  },
  yummyInput: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  infoCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 18,
  },
  yummyConfirm: {
    backgroundColor: Colors.primary,
    height: 64,
    borderRadius: 32,
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
  yummyConfirmText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 24,
  },
  errorBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
  },
  errorBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
});
