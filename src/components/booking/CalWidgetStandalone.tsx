'use client'

import { useState } from 'react'
import CalWidget from './CalWidget'

interface Props {
  eventTypeId: string
  title:       string
  description: string
}

/**
 * Thin client wrapper so that CalWidget can be used directly inside
 * Server Components without passing an event-handler prop across the
 * Server → Client boundary.
 */
export default function CalWidgetStandalone({ eventTypeId, title, description }: Props) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <CalWidget
      eventTypeId={eventTypeId}
      title={title}
      description={description}
      onClose={() => setVisible(false)}
    />
  )
}
