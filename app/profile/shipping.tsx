import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Screen } from '../../components/Screen';
import { SelectField } from '../../components/SelectField';
import { regions, states } from '../../constants/data';
import { spacing } from '../../constants/theme';

export default function Shipping() {
  const router = useRouter();
  const [region, setRegion] = useState<string>('United States');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState<string>();
  const [zip, setZip] = useState('');

  return (
    <Screen scroll padded={false}>
      <Header title="Shipping Information" />
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
        <SelectField label="Region" placeholder="No selection" value={region} options={regions} onChange={setRegion} />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="(555) 000-0000" />
        <Input label="Address" value={address} onChangeText={setAddress} placeholder="123 Market St, Apt 4" />
        <Input label="City" value={city} onChangeText={setCity} placeholder="San Francisco" />
        <SelectField label="State" placeholder="No selection" value={state} options={states} onChange={setState} />
        <Input label="Zip Code" value={zip} onChangeText={setZip} keyboardType="number-pad" placeholder="94103" />
        <Button label="Save Address" onPress={() => router.back()} style={{ marginTop: spacing.md, marginBottom: spacing.xl }} />
      </View>
    </Screen>
  );
}
