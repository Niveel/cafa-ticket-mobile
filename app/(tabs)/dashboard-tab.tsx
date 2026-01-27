import React from 'react'

import { Screen, Nav, DashboardList } from '@/components'

const DashboardTab = () => {
    return (
        <Screen>
            <Nav title="Dashboard" />

            <DashboardList />
        </Screen>
    )
}

export default DashboardTab