import { useState } from 'react'

function toggleInArray(items, value) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value]
}

export default function useFeelingsState() {
  const [selectedMood, setSelectedMood] = useState('')
  const [selectedFeelings, setSelectedFeelings] = useState([])

  return {
    selectedMood,
    selectedFeelings,
    setSelectedMood: (mood) => {
      setSelectedMood(mood)
      setSelectedFeelings([])
    },
    toggleFeeling: (value) => {
      setSelectedFeelings((prev) => toggleInArray(prev, value))
    },
    resetFeelingsState: () => {
      setSelectedMood('')
      setSelectedFeelings([])
    },
  }
}
