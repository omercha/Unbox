import { useEffect, useMemo, useRef, useState } from 'react'
import './ChecklistSummary.css'

function joinList(items, fallback = 'not specified yet') {
  return items.length > 0 ? items.join(', ') : fallback
}

function audienceLabel(audience) {
  if (!audience) {
    return 'you'
  }

  return audience === 'other' ? 'you' : `my ${audience}`
}

function audienceChecklistLabel(audience) {
  if (!audience) {
    return 'Person not selected'
  }

  if (audience === 'other') {
    return 'Someone else'
  }

  return audience.charAt(0).toUpperCase() + audience.slice(1)
}

function buildTopicLine(selectedTopics = [], customTopic = '') {
  const combined = [...selectedTopics]

  if (customTopic.trim()) {
    combined.push(customTopic.trim())
  }

  return combined.length > 0 ? combined.join('; ') : 'something important'
}

function buildUniversalMessage({
  audience,
  topics,
  customTopic,
  goal,
  needs,
  understandings,
}) {
  const toWho = audienceLabel(audience)
  const topicLine = buildTopicLine(topics, customTopic)

  return `Message to ${toWho}:\nI want to talk to you about ${topicLine}. What would help from you is ${joinList(needs, 'patience and support')}, and I want you to understand ${joinList(understandings, 'I am trying to explain this honestly')}. My goal for this conversation is ${goal || 'to talk openly and be heard'}.`
}

function buildChecklist({ audience, topics, customTopic, needs, understandings, goal }) {
  const checklist = []
  const topicLine = buildTopicLine(topics, customTopic)

  checklist.push(`Person: ${audienceChecklistLabel(audience)}`)

  if (topics.length > 0 || customTopic.trim()) {
    checklist.push(`Topic I need to discuss: ${topicLine}`)
  }

  if (goal) {
    checklist.push(`My goal: ${goal}`)
  }

  if (needs.length > 0) {
    checklist.push(`What I need: ${needs.join(', ')}`)
  }

  if (understandings.length > 0) {
    checklist.push(`What I want them to understand: ${understandings.join(', ')}`)
  }

  return checklist
}

function getSmsHref(encodedText) {
  const isAppleDevice =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)

  return isAppleDevice ? `sms:&body=${encodedText}` : `sms:?&body=${encodedText}`
}

function buildSavedMessagePayload(props, messageText) {
  const topicLine = buildTopicLine(props.selectedTopics, props.customTopic)

  return {
    selectedAudience: props.selectedAudience,
    selectedTopics: props.selectedTopics,
    customTopic: props.customTopic,
    title: topicLine
      ? `To ${audienceLabel(props.selectedAudience)}: ${topicLine}`
      : `To ${audienceLabel(props.selectedAudience)}`,
    messageText,
  }
}

function ChecklistSummary(props) {
  const [copiedState, setCopiedState] = useState('')
  const [copyError, setCopyError] = useState(false)
  const [messageSaved, setMessageSaved] = useState(false)
  const messageTextareaRef = useRef(null)

  const messageText = useMemo(
    () =>
      buildUniversalMessage({
        audience: props.selectedAudience,
        topics: props.selectedTopics,
        customTopic: props.customTopic,
        goal: props.selectedGoal,
        needs: props.selectedNeeds,
        understandings: props.selectedUnderstandings,
      }),
    [
      props.selectedAudience,
      props.selectedGoal,
      props.selectedNeeds,
      props.selectedTopics,
      props.customTopic,
      props.selectedUnderstandings,
    ],
  )

  const checklist = buildChecklist({
    audience: props.selectedAudience,
    topics: props.selectedTopics,
    customTopic: props.customTopic,
    needs: props.selectedNeeds,
    understandings: props.selectedUnderstandings,
    goal: props.selectedGoal,
  })

  const encodedMessage = encodeURIComponent(messageText)

  useEffect(() => {
    setMessageSaved(false)
  }, [messageText])

  useEffect(() => {
    if (!messageTextareaRef.current) {
      return
    }

    const textarea = messageTextareaRef.current
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [messageText])

  const handleCopy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyError(false)
      setCopiedState(key)
      window.setTimeout(() => {
        setCopiedState('')
      }, 1500)
    } catch {
      setCopyError(true)
      setCopiedState('')
    }
  }

  const handleSaveMessage = () => {
    props.onSaveMessage(buildSavedMessagePayload(props, messageText))
    setMessageSaved(true)
  }

  return (
    <section className="summary-card">
      <div className="summary-card__header">
        <div>
          <h2 className="summary-card__title">Review and put it into words</h2>
          <p className="summary-card__subtitle">
            This is your final message draft. You can copy it or share it directly.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        <section className="summary-panel">
          <p className="summary-panel__label">Your message</p>
          <textarea
            ref={messageTextareaRef}
            readOnly
            value={messageText}
            className="summary-panel__textarea"
          />
        </section>
      </div>

      <section className="summary-panel">
        <p className="summary-panel__label">Face-to-face checklist</p>
        <ul className="summary-list">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="summary-actions">
        <button
          type="button"
          onClick={handleSaveMessage}
          className="summary-actions__primary"
        >
          {messageSaved ? 'Saved!' : 'Save message'}
        </button>

        <button
          type="button"
          onClick={props.onOpenSavedMessages}
          className="summary-actions__primary"
        >
          View saved messages
        </button>

        <a
          href={`https://wa.me/?text=${encodedMessage}`}
          target="_blank"
          rel="noreferrer"
          className="summary-actions__secondary"
        >
          Share via WhatsApp
        </a>

        <a href={getSmsHref(encodedMessage)} className="summary-actions__secondary">
          Share via SMS
        </a>

        <a
          href={`mailto:?subject=${encodeURIComponent(
            'Preparing for our conversation',
          )}&body=${encodedMessage}`}
          className="summary-actions__secondary"
        >
          Share via Email
        </a>

        <button
          type="button"
          onClick={() => handleCopy(messageText, 'message')}
          className="summary-actions__secondary"
        >
          {copiedState === 'message' ? 'Copied!' : 'Copy message'}
        </button>
      </div>

      {copyError && (
        <p className="summary-card__error">
          Clipboard access was blocked in this browser. You can still copy from the message box
          manually.
        </p>
      )}
    </section>
  )
}

export default ChecklistSummary
