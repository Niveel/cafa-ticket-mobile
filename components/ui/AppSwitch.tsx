import { Platform, Switch, SwitchProps, Vibration } from "react-native";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

type AppSwitchProps = Omit<SwitchProps, "onValueChange"> & {
  onValueChange?: (value: boolean) => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  enableStrongFeedback?: boolean;
};

const AppSwitch = ({
  value = false,
  onValueChange,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  enableStrongFeedback = true,
  ...rest
}: AppSwitchProps) => {
  const handleChange = useCallback(
    (nextValue: boolean) => {
      // Update UI state first so the switch animation is immediate.
      onValueChange?.(nextValue);

      if (enableStrongFeedback && nextValue) {
        // Trigger feedback in parallel with UI animation.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
          // Ignore haptic failures on unsupported environments.
        });

        if (Platform.OS === "android") {
          // Two short pulses feel noticeable without being harsh.
          Vibration.vibrate([0, 35, 45, 75]);
        } else {
          // iOS only allows fixed vibration duration.
          Vibration.vibrate(80);
        }
      }
    },
    [enableStrongFeedback, onValueChange]
  );

  return (
    <Switch
      value={value}
      disabled={disabled}
      onValueChange={handleChange}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      {...rest}
    />
  );
};

export default AppSwitch;
