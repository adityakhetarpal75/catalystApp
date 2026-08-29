import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { cities } from '../../constants/data';
import { colors, font, radius, spacing } from '../../constants/theme';

export default function PersonalInfo() {
  const router = useRouter();
  const { profile, setProfile } = useApp();
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location || '');

  useEffect(() => {
    if (user?.username && !username) setUsername(user.username);
  }, [user?.username]);

  const canContinue = username.trim().length > 0 && location.trim().length > 0;

  return (
    <Screen scroll>
      <Header title="Personal Information" />
      <Text style={styles.title}>Tell us about yourself!</Text>
      <Text style={styles.subtitle}>
        In less than 5 minutes, you can be matched with closets and people that fit your profile.
      </Text>

      <Pressable style={styles.photo}>
        <View style={styles.photoCircle}>
          <Ionicons name="camera-outline" size={26} color={colors.textMuted} />
        </View>
        <Text style={styles.photoLabel}>Share your favourite profile photo</Text>
      </Pressable>

      {user ? (
        <Text style={styles.accountHint}>
          Signed up as {user.firstName} {user.lastName} · {user.email}
        </Text>
      ) : null}

      <Input
        label="User Name*"
        placeholder="This is how you appear in Catalyst"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.fieldLabel}>Bio</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Tell us a bit more about yourself"
        placeholderTextColor={colors.textFaint}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <View style={{ height: spacing.lg }} />
      <SelectField
        label="Location*"
        placeholder="Selection"
        value={location}
        options={cities}
        onChange={setLocation}
      />

      <Button
        label="Continue"
        disabled={!canContinue}
        style={{ marginTop: spacing.md }}
        onPress={async () => {
          const clean = username.trim().replace(/^@/, '');
          setProfile({ username: clean, bio, location });
          await updateUser({ username: clean });
          router.push('/(onboarding)/community');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...font.h1, color: colors.text, marginTop: spacing.md },
  subtitle: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 21, marginBottom: spacing.lg },
  accountHint: { ...font.small, color: colors.textMuted, marginBottom: spacing.lg },
  photo: { alignItems: 'center', marginBottom: spacing.xl },
  photoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  photoLabel: { ...font.small, color: colors.textMuted },
  fieldLabel: {
    ...font.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
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
});
