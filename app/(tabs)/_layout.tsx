import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Tabs } from 'expo-router'
import { TabBar } from '@/components';

const TabLayout = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
        <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{headerShown: false}}>
            <Tabs.Screen name="index" options={{title: 'Home'}} />
            <Tabs.Screen name="events" options={{title: 'Events'}} />
            <Tabs.Screen name="dashboard-tab" options={{title: 'Dashboard'}} />
        </Tabs>
        </GestureHandlerRootView>
    )
}

export default TabLayout