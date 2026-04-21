"use client"

import * as React from "react"

type DynarisController = {
  show: () => void
  hide: () => void
  toggle: () => void
  send: (message: string) => void
  destroy: () => void
}

export function ChatWidget() {
  const ctrlRef = React.useRef<DynarisController | null>(null)

  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_DYNARIS_API_KEY
    const apiUrl = process.env.NEXT_PUBLIC_DYNARIS_API_URL
    const voiceAgentId = process.env.NEXT_PUBLIC_DYNARIS_VOICE_AGENT_ID

    if (!apiKey) {
      console.warn(
        "[DynarisWidget] Missing NEXT_PUBLIC_DYNARIS_API_KEY. Widget will not initialize."
      )
      return
    }

    if (!voiceAgentId) {
      console.warn(
        "[DynarisWidget] Missing NEXT_PUBLIC_DYNARIS_VOICE_AGENT_ID. Voice button will be hidden."
      )
    }

    let cancelled = false

    import("@dynaris/widget")
      .then(({ init }) => {
        if (cancelled) return
        ctrlRef.current = init({
          apiKey,
          apiUrl,
          voiceEnabled: Boolean(voiceAgentId),
          voiceAgentId,
          voiceCallLabel: "Talk to our AI",
          title: "Chat Support",
          welcomeMessage: "Hi! How can I help you?",
          position: "bottom-right",
        }) as DynarisController
      })
      .catch((err) => {
        console.error("[DynarisWidget] Failed to load widget package.", err)
      })

    return () => {
      cancelled = true
      ctrlRef.current?.destroy()
      ctrlRef.current = null
    }
  }, [])

  return null
}
