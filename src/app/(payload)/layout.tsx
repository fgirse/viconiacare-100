import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'
import { serverFunction } from './actions'
import React from 'react'

import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
