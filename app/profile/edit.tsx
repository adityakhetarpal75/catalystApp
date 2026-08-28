import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SelectField } from '../../components/SelectField';
import { Avatar } from '../../components/ui';
import { cities, sizeOptions, styleOptions } from '../../constants/data';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function EditProfile() {
  const router = useRouter();
  const { profile, setProfile, sellEnabled, rentEnabled, setSellEnabled, setRentEnabled } = useApp();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [email, setEmail] = useState(profile.email);
  const [persona, setPersona] = useState<string[]>(['retro']);
  const [topSize, setTopSize] = useState<string>('S');

  const togglePersona = (key: string) =>
    setPersona((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));

  const save = () => {
    setProfile({ firstName, lastName, username, bio, location, email });
    router.back();
  };

  return (
    <Screen scroll padded={false}>
      <Header title="Edit Profile" />
      <View style={styles.body}>
        <View style={styles.photoWrap}>
          <Avatar name={username} size={88} ring />
          <Pressable style={styles.editPhoto}>
            <Text style={styles.editPhotoText}>Edit Photo</Text>
          </Pressable>
        </View>

        <Input label="First Name" value={firstName} onChangeText={setFirstName} />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} />
        <Input label="User Name" value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Tell us a bit more about yourself"
          placeholderTextColor={colors.textFaint}
          multiline
          value={bio}
          onChangeText={setBio}
        />
        <View style={{ height: spacing.lg }} />

        <SelectField label="Location" placeholder="Selection" value={location} options={cities} onChange={setLocation} />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={styles.divider} />

        <Text style={styles.groupLabel}>Fashion Persona</Text>
        <View style={styles.circleRow}>
          {styleOptions.slice(0, 4).map((s) => {
            const active = persona.includes(s.key);
            return (
              <Pressable key={s.key} style={[styles.circle, active && styles.circleActive]} onPress={() => togglePersona(s.key)}>
                <Ionicons name="shirt-outline" size={20} color={active ? colors.white : colors.textMuted} />
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.groupLabel, { marginTop: spacing.lg }]}>My Sizes</Text>
        <View style={styles.circleRow}>
          {sizeOptions.tops.slice(0, 4).map((s) => {
            const active = topSize === s;
            return (
              <Pressable key={s} style={[styles.circle, active && styles.circleActive]} onPress={() => setTopSize(s)}>
                <Text style={[styles.circleText, active && { color: colors.white }]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.prefBox}>
          <Text style={styles.groupLabel}>Preferences</Text>
          <View style={styles.prefRow}>
            <Text style={styles.prefText}>I would like to sell items from my closet</Text>
            <Switch value={sellEnabled} onValueChange={setSellEnabled} trackColor={{ true: colors.ink }} />
          </View>
          <View style={styles.prefRow}>
            <Text style={styles.prefText}>I would like to rent items from my closet</Text>
            <Switch value={rentEnabled} onValueChange={setRentEnabled} trackColor={{ true: colors.ink }} />
          </View>
        </View>

        <Button label="Save" onPress={save} style={{ marginTop: spacing.xl, marginBottom: spacing.xl }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  photoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  editPhoto: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  editPhotoText: { ...font.small, color: colors.text, fontWeight: '600' },
  label: { ...font.label, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    ...font.body,
    color: colors.text,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.lg },
  groupLabel: { ...font.label, color: colors.textMuted, marginBottom: spacing.md, textTransform: 'uppercase' },
  circleRow: { flexDirection: 'row', gap: spacing.md },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  circleText: { ...font.bodyStrong, color: colors.textMuted },
  prefBox: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  prefText: { ...font.body, color: colors.text, flex: 1, marginRight: spacing.md },
});
