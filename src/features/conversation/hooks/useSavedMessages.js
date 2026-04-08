import { useEffect, useState } from 'react'

const MESSAGES_KEY = 'unbox_saved_messages'

function readMessages() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildTopicTitle(message) {
  const topics = Array.isArray(message.selectedTopics)
    ? message.selectedTopics
    : message.selectedTopic
      ? [message.selectedTopic]
      : []
  const customTopic = message.customTopic?.trim() || ''
  const combined = [...topics]

  if (customTopic) {
    combined.push(customTopic)
  }

  if (combined.length === 0) {
    return ''
  }

  const shortList = combined.slice(0, 2).join('; ')
  return combined.length > 2 ? `${shortList}...` : shortList
}

function buildMessageTitle(message) {
  const audience = message.selectedAudience ? `To ${message.selectedAudience}` : 'Saved message'
  const topic = buildTopicTitle(message)
  return topic ? `${audience}: ${topic}` : audience
}

export default function useSavedMessages() {
  const [messages, setMessages] = useState(() => readMessages())

  useEffect(() => {
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }, [messages])

  const saveMessage = (message) => {
    const nextMessage = {
      id: crypto.randomUUID(),
      title: buildMessageTitle(message),
      updatedAt: new Date().toISOString(),
      ...message,
    }

    setMessages((prev) => [nextMessage, ...prev])
  }

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((message) => message.id !== messageId))
  }

  return {
    messages,
    saveMessage,
    deleteMessage,
  }
}
