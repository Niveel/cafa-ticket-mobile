import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {AppText} from "@/components"

type Props = {
    error?: string;
    visible?: boolean;
}

const AppErrorMessage = ({ error, visible }: Props) => {
    if (!error || !visible) return null;

    return (
        <View 
            className="flex-row items-start gap-2 bg-red-50 border-2 border-red-500 rounded-lg p-2"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
        >
            <Ionicons 
                name="alert-circle" 
                size={16} 
                color="#ef4444" 
                style={{ marginTop: 2 }}
            />
            <AppText className="text-xs text-red-600 font-isemibold flex-1 leading-tight">
                {error}
            </AppText>
        </View>
    );
}

export default AppErrorMessage;