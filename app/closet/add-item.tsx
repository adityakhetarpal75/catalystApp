import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SelectField } from '../../components/SelectField';
import {
  itemCategories,
  itemColors,
  itemConditions,
  itemMaterials,
  sizeOptions,
} from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function AddItem() {
  const router = useRouter();
  const { addItem } = useApp();
  const [category, setCategory] = useState<string>();
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<string>();
  const [condition, setCondition] = useState<string>();
  const [color, setColor] = useState<string>();
  const [material, setMaterial] = useState<string>();
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const allSizes = [...new Set([...sizeOptions.tops, ...sizeOptions.pants, ...sizeOptions.shoes])];

  const onAdd = () => {
    addItem({
      id: String(Date.now()),
      brand: 'My Brand',
      name: description ? description.slice(0, 24) : category || 'New Item',
      price: Number(price) || 0,
      size: size || 'M',
      category: category || 'Tops',
      color,
      condition,
      material,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    setShowSuccess(true);
  };

  return (
    <Screen scroll>
      <Header title="Add Items" />

      <SelectField label="Item Category" placeholder="Select the type of item" value={category} options={itemCategories} onChange={setCategory} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Describe your item in as much detail as possible. The more you share, the higher chances of you selling the item!"
        placeholderTextColor={colors.textFaint}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={{ height: spacing.lg }} />

      <SelectField label="Item Size" placeholder="Select the size of your item" value={size} options={allSizes} onChange={setSize} />
      <SelectField label="Item Condition" placeholder="Select the condition of your item" value={condition} options={itemConditions} onChange={setCondition} />
      <SelectField label="Select the closest primary color" placeholder="Select the color of your item" value={color} options={itemColors} onChange={setColor} />
      <SelectField label="Select the material of your item" placeholder="Select the material of your item" value={material} options={itemMaterials} onChange={setMaterial} />

      <Text style={styles.label}>Add Images</Text>
      <Text style={styles.hint}>Upload at least 3 images, ideally one that shows how it fits</Text>
      <View style={styles.imagesRow}>
        {[0, 1, 2].map((i) => (
          <Pressable key={i} style={styles.imageWell}>
            <Ionicons name="add" size={26} color={colors.textFaint} />
          </Pressable>
        ))}
      </View>

      <Input
        label="Enter Price"
        placeholder="Enter the price you want for your item"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        containerStyle={{ marginTop: spacing.lg }}
      />

      <Input
        label="Add Tags"
        icon="pricetag-outline"
        placeholder="Type keywords that describe your item"
        value={tags}
        onChangeText={setTags}
      />

      <Button label="Add" onPress={onAdd} style={{ marginTop: spacing.sm, marginBottom: spacing.xl }} />

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.successCard}>
            <Pressable
              style={styles.close}
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </Pressable>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={28} color={colors.white} />
            </View>
            <Text style={styles.successText}>The item was successfully added to your closet!</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...font.label, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    ...font.body,
    color: colors.text,
  },
  hint: { ...font.tiny, color: colors.textMuted, marginBottom: spacing.md, marginTop: -4 },
  imagesRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  imageWell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  successCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  close: { position: 'absolute', top: spacing.md, right: spacing.md },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  successText: { ...font.h3, color: colors.text, textAlign: 'center', lineHeight: 24 },
});
