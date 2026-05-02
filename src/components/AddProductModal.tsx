import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Input } from './ui/Input';
import { X, Camera, Package, Info, Trash2, Edit3 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../store/slices/productSlice';
import { RootState } from '../store';
import { saveProduct } from '../utils/db';
import Toast from 'react-native-toast-message';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityToWarn, setQuantityToWarn] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    price?: string; 
    image?: string;
    quantity?: string;
    quantityToWarn?: string;
  }>({});

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Need gallery access.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setErrors({ ...errors, image: undefined });
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleAdd = async () => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Please name your product';
    if (!price) newErrors.price = 'Set a price';
    if (!image) newErrors.image = 'Add a clear photo';
    if (!quantity) newErrors.quantity = 'Initial stock?';
    if (!quantityToWarn) newErrors.quantityToWarn = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (products.length >= 5) {
      Toast.show({ type: 'error', text1: 'Inventory Full', text2: 'Maximum 5 products allowed.' });
      return;
    }

    const q = parseInt(quantity);
    const qWarn = parseInt(quantityToWarn);

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      quantity: q,
      quantityToWarn: qWarn,
      image: image!,
      createdAt: Date.now(),
    };

    try {
      await saveProduct(newProduct);
      dispatch(addProduct(newProduct));

      Toast.show({ type: 'success', text1: 'Product Added!', text2: `"${name}" is ready for sale.` });

      if (q <= qWarn) {
        setTimeout(() => {
          Toast.show({ type: 'error', text1: 'Low Stock Alert', text2: `${name} stock is critically low.` });
        }, 2000);
      }

      setName('');
      setPrice('');
      setQuantity('');
      setQuantityToWarn('');
      setImage(null);
      setErrors({});
      onClose();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'System Error' });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.yummySheet}>
          <View style={styles.sheetHandle} />
          
          <View style={styles.modalHeader}>
            <View style={styles.titleWithIcon}>
              <View style={styles.iconCircle}>
                <Package size={20} color={Colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Add Product</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
            <View style={styles.imageContainer}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={pickImage} 
                style={[styles.imageArea, errors.image && { borderColor: Colors.accentRed }]}>
                {image ? (
                  <>
                    <Image source={{ uri: image }} style={styles.previewImg} />
                    <View style={styles.imageOverlay}>
                      <View style={styles.editBadge}>
                        <Edit3 size={16} color={Colors.white} />
                        <Text style={styles.editText}>Change</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <View style={styles.cameraCircle}>
                      <Camera size={28} color={Colors.white} />
                    </View>
                    <Text style={styles.uploadTitle}>Snap or Pick Imagery</Text>
                    <Text style={styles.uploadSub}>Make it look delicious!</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {image && (
                <TouchableOpacity 
                  style={styles.removeBtn} 
                  onPress={removeImage}
                  activeOpacity={0.7}
                >
                  <Trash2 size={18} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Product Identity</Text>
              <Input
                placeholder="What are you selling today?"
                value={name}
                onChangeText={setName}
                error={errors.name}
                containerStyle={styles.yummyInput}
              />
            </View>

            <View style={styles.sideBySide}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.fieldLabel}>Price ($)</Text>
                <Input
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  error={errors.price}
                  containerStyle={styles.yummyInput}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Initial Stock</Text>
                <Input
                  placeholder="0"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  error={errors.quantity}
                  containerStyle={styles.yummyInput}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Stock Warning Level</Text>
              <Input
                placeholder="Alert me when units are below..."
                keyboardType="numeric"
                value={quantityToWarn}
                onChangeText={setQuantityToWarn}
                error={errors.quantityToWarn}
                containerStyle={styles.yummyInput}
              />
            </View>

            <View style={styles.infoNote}>
              <Info size={14} color={Colors.textMuted} />
              <Text style={styles.infoNoteText}>
                You can add up to 5 products in this collection.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.yummySubmit}
              onPress={handleAdd}
            >
              <Text style={styles.yummySubmitText}>Add to Inventory</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(29, 29, 40, 0.4)',
    justifyContent: 'flex-end',
  },
  yummySheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: '92%',
    paddingHorizontal: 24,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 28,
    position: 'relative',
  },
  imageArea: {
    width: '100%',
    height: 200,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  uploadSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 8,
    marginLeft: 4,
  },
  yummyInput: {

    borderRadius: 18,
    borderWidth: 0,
    // paddingHorizontal: 16,
  },
  sideBySide: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  infoNoteText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  yummySubmit: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  yummySubmitText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
});
