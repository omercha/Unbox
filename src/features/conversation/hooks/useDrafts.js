import { useEffect, useState } from 'react'

const DRAFTS_KEY = 'unbox_saved_drafts'

function readDrafts() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(DRAFTS_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildTopicTitle(draft) {
  const topics = Array.isArray(draft.selectedTopics)
    ? draft.selectedTopics
    : draft.selectedTopic
      ? [draft.selectedTopic]
      : []
  const customTopic = draft.customTopic?.trim() || ''
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

function buildDraftTitle(draft) {
  const audience = draft.selectedAudience ? `To ${draft.selectedAudience}` : 'Untitled'
  const topic = buildTopicTitle(draft)
  return topic ? `${audience}: ${topic}` : audience
}

export default function useDrafts() {
  const [drafts, setDrafts] = useState(() => readDrafts())

  useEffect(() => {
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
  }, [drafts])

  const saveDraft = (draftState) => {
    const now = new Date().toISOString()
    const nextDraft = {
      id: draftState.id || crypto.randomUUID(),
      title: buildDraftTitle(draftState),
      updatedAt: now,
      ...draftState,
    }

    setDrafts((prev) => {
      const existingIndex = prev.findIndex((draft) => draft.id === nextDraft.id)

      if (existingIndex === -1) {
        return [nextDraft, ...prev]
      }

      const updatedDrafts = [...prev]
      updatedDrafts[existingIndex] = nextDraft
      return updatedDrafts.sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      )
    })

    return nextDraft
  }

  const deleteDraft = (draftId) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== draftId))
  }

  return {
    drafts,
    saveDraft,
    deleteDraft,
  }
}
