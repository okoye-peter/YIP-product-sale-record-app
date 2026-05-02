import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'outline' | 'error';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const isOutline = variant === 'outline';
  const isError = variant === 'error';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline && styles.outlineButton,
        isError && styles.errorButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? Colors.primary : Colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  errorButton: {
    backgroundColor: Colors.error,
    shadowColor: Colors.error,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: Colors.primary,
  },
});
