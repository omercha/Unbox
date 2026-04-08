import { useState } from 'react'

function toggleInArray(items, value) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value]
}

function normalizeTopics(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return [value]
  }

  return []
}

export default function useConversationState() {
  const [selectedAudience, setSelectedAudience] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [customTopic, setCustomTopic] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedConcerns, setSelectedConcerns] = useState([])
  const [selectedNeeds, setSelectedNeeds] = useState([])
  const [selectedUnderstandings, setSelectedUnderstandings] = useState([])

  return {
    selectedAudience,
    selectedTopics,
    customTopic,
    selectedGoal,
    selectedConcerns,
    selectedNeeds,
    selectedUnderstandings,
    setSelectedAudience,
    setCustomTopic,
    setSelectedGoal,
    toggleTopic: (value) => {
      setSelectedTopics((prev) => toggleInArray(prev, value))
    },
    clearTopics: () => {
      setSelectedTopics([])
    },
    toggleConcern: (value) => {
      setSelectedConcerns((prev) => toggleInArray(prev, value))
    },
    toggleNeed: (value) => {
      setSelectedNeeds((prev) => toggleInArray(prev, value))
    },
    toggleUnderstanding: (value) => {
      setSelectedUnderstandings((prev) => toggleInArray(prev, value))
    },
    loadConversationState: (draft) => {
      setSelectedAudience(draft.selectedAudience || '')
      setSelectedTopics(normalizeTopics(draft.selectedTopics ?? draft.selectedTopic))
      setCustomTopic(draft.customTopic || '')
      setSelectedGoal(draft.selectedGoal || '')
      setSelectedConcerns(draft.selectedConcerns || [])
      setSelectedNeeds(draft.selectedNeeds || [])
      setSelectedUnderstandings(draft.selectedUnderstandings || [])
    },
    getConversationSnapshot: () => ({
      selectedAudience,
      selectedTopics,
      customTopic,
      selectedGoal,
      selectedConcerns,
      selectedNeeds,
      selectedUnderstandings,
    }),
    resetConversationState: () => {
      setSelectedAudience('')
      setSelectedTopics([])
      setCustomTopic('')
      setSelectedGoal('')
      setSelectedConcerns([])
      setSelectedNeeds([])
      setSelectedUnderstandings([])
    },
  }
}
