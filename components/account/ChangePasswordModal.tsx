import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { colors, spacing, typography } from "../../theme";
import ModalHeader from "./ModalHeader";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChangePassword = () => {
    if (!passwords.current) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }
    if (passwords.new.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    Alert.alert("Success", "Password changed successfully");
    setPasswords({ current: "", new: "", confirm: "" });
    onClose();
  };

  return (
    <View style={styles.container}>
      <ModalHeader title="Change Password" onClose={onClose} />
      <ScrollView style={styles.content}>
        <Text style={styles.inputLabel}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={passwords.current}
          onChangeText={(text) => setPasswords({ ...passwords, current: text })}
          placeholder="Enter current password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          value={passwords.new}
          onChangeText={(text) => setPasswords({ ...passwords, new: text })}
          placeholder="Enter new password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Text style={styles.inputLabel}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={passwords.confirm}
          onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
          placeholder="Confirm new password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Text style={styles.passwordHint}>
          Password must be at least 6 characters long
        </Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  passwordHint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});
