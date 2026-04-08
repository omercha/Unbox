import { useEffect, useState } from 'react'
import AudienceSelector from './components/AudienceSelector.jsx'
import ChecklistSummary from './components/ChecklistSummary.jsx'
import SelectionGroup from './components/SelectionGroup.jsx'
import {
  audienceOptions,
  goalOptions,
  needsCategories,
  topicOptions,
  understandingCategories,
} from './data/conversationOptions.js'
import useConversationState from './hooks/useConversationState.js'
import './ConversationWizard.css'

function buildSelectedSummary(items, onRemove, tone = 'default', title = 'Selected') {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="wizard-selection-summary">
      <div className="wizard-selection-summary__header">
        <p className="wizard-selection-summary__title">{title}</p>
      </div>
      <div className="wizard-selection-summary__items">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onRemove(item)}
            className={`wizard-selection-summary__chip wizard-selection-summary__chip--${tone}`}
          >
            {item} ×
          </button>
        ))}
      </div>
    </div>
  )
}

function ConversationWizard({
  onBackHome = () => {},
  onSaveDraft = () => {},
  onOpenDrafts = () => {},
  onSaveMessage = () => {},
  onOpenSavedMessages = () => {},
  draftToLoad,
  onDraftLoaded,
}) {
  const [activeDraftId, setActiveDraftId] = useState(null)
  const [hasSavedDraft, setHasSavedDraft] = useState(false)
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState('')
  const [expandedTopicTitle, setExpandedTopicTitle] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [showUnderstandingOptions, setShowUnderstandingOptions] = useState(false)
  const {
    selectedAudience,
    selectedTopics,
    customTopic,
    selectedGoal,
    selectedNeeds,
    selectedUnderstandings,
    setSelectedAudience,
    setCustomTopic,
    setSelectedGoal,
    toggleTopic,
    toggleNeed,
    toggleUnderstanding,
    loadConversationState,
    getConversationSnapshot,
    resetConversationState,
  } = useConversationState()

  const currentSnapshot = getConversationSnapshot()
  const currentSnapshotToken = JSON.stringify(currentSnapshot)
  const isDraftSaved =
    hasSavedDraft && lastSavedSnapshot.length > 0 && lastSavedSnapshot === currentSnapshotToken
  const displayedStep = Math.min(currentStep, 3)

  const hasObjectiveSelection =
    selectedGoal.trim().length > 0 ||
    selectedNeeds.length > 0 ||
    selectedUnderstandings.length > 0

  const hasTopicSelection = selectedTopics.length > 0 || customTopic.trim().length > 0

  const canMoveForward =
    (currentStep === 1 && selectedAudience) ||
    (currentStep === 2 && hasTopicSelection) ||
    (currentStep === 3 && hasObjectiveSelection) ||
    currentStep === 4

  useEffect(() => {
    if (draftToLoad) {
      loadConversationState(draftToLoad)
      setActiveDraftId(draftToLoad.id || null)
      setHasSavedDraft(Boolean(draftToLoad.id))
      setLastSavedSnapshot(
        JSON.stringify({
          selectedAudience: draftToLoad.selectedAudience || '',
          selectedTopics:
            draftToLoad.selectedTopics ||
            (draftToLoad.selectedTopic ? [draftToLoad.selectedTopic] : []),
          customTopic: draftToLoad.customTopic || '',
          selectedGoal: draftToLoad.selectedGoal || '',
          selectedNeeds: draftToLoad.selectedNeeds || [],
          selectedUnderstandings: draftToLoad.selectedUnderstandings || [],
        }),
      )
      setExpandedTopicTitle('')
      setCurrentStep(1)
      onDraftLoaded()
    }
  }, [draftToLoad, loadConversationState, onDraftLoaded])

  useEffect(() => {
    if (!hasSavedDraft || !lastSavedSnapshot) {
      return
    }

    if (currentSnapshotToken !== lastSavedSnapshot) {
      setHasSavedDraft(false)
    }
  }, [currentSnapshotToken, hasSavedDraft, lastSavedSnapshot])

  const handleResetAll = () => {
    resetConversationState()
    setActiveDraftId(null)
    setHasSavedDraft(false)
    setLastSavedSnapshot('')
    setExpandedTopicTitle('')
    setCurrentStep(1)
  }

  const handleBackHome = () => {
    setExpandedTopicTitle('')
    setCurrentStep(1)
    onBackHome()
  }

  const handleSaveDraft = () => {
    const savedDraft = onSaveDraft({
      ...currentSnapshot,
      id: activeDraftId,
    })

    if (savedDraft) {
      setActiveDraftId(savedDraft.id)
      setLastSavedSnapshot(JSON.stringify(currentSnapshot))
      setHasSavedDraft(true)
    }
  }

  return (
    <section className="wizard-shell">
      <div className="wizard-progress">
        <div className="wizard-progress__bar">
          <div
            className="wizard-progress__value"
            style={{ width: `${(displayedStep / 3) * 100}%` }}
          />
        </div>
        <div className="wizard-progress__header">
          <div>
            <p className="wizard-progress__step">
              {currentStep === 4 ? 'Review' : `Step ${currentStep} of 3`}
            </p>
            <p className="wizard-progress__hint">
              Move from frozen thoughts to a message you can actually send.
            </p>
          </div>
          <div className="wizard-progress__actions">
            <button
              type="button"
              onClick={handleBackHome}
              className="wizard-progress__back-home"
            >
              Back to home
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isDraftSaved}
              className="wizard-progress__save"
            >
              {isDraftSaved ? 'Saved!' : 'Save draft'}
            </button>
            <button type="button" onClick={handleResetAll} className="wizard-progress__reset">
              Reset
            </button>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <section className="wizard-panel">
          <div className="wizard-panel__intro">
            <h2 className="wizard-panel__title">Who do you need to talk to?</h2>
            <p className="wizard-panel__subtitle">
              Start with the person you need to speak to so the wording can fit the
              situation.
            </p>
          </div>

          <AudienceSelector
            options={audienceOptions}
            selectedAudience={selectedAudience}
            onSelect={setSelectedAudience}
          />
        </section>
      )}

      {currentStep === 2 && (
        <section className="wizard-step-stack">
          <div className="wizard-panel">
            <div className="wizard-panel__intro">
              <h2 className="wizard-panel__title">What is the topic you want to discuss?</h2>
              <p className="wizard-panel__subtitle">
                Open any topic below, then select one or more statements that match.
              </p>
            </div>

            {buildSelectedSummary(selectedTopics, toggleTopic, 'soft', 'Selected topics')}

            <div className="wizard-topic-stack">
              {topicOptions.map((topic) => {
                const isExpanded = expandedTopicTitle === topic.title
                const selectedCount = topic.options.filter((option) =>
                  selectedTopics.includes(option),
                ).length

                return (
                  <div
                    key={topic.title}
                    className={`wizard-topic-group ${
                      isExpanded ? 'wizard-topic-group--expanded' : ''
                    } ${selectedCount > 0 ? 'wizard-topic-group--selected' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedTopicTitle(isExpanded ? '' : topic.title)}
                      className="wizard-topic-group__trigger"
                    >
                      <span className="wizard-topic-group__title">{topic.title}</span>
                      <span className="wizard-topic-group__meta">
                        {selectedCount > 0
                          ? `${selectedCount} selected`
                          : isExpanded
                            ? 'Hide options'
                            : 'View options'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="wizard-topic-group__options">
                        {topic.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleTopic(option)}
                            className={`wizard-topic-option ${
                              selectedTopics.includes(option)
                                ? 'wizard-topic-option--selected'
                                : ''
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <label className="wizard-goals__field wizard-goals__field--topic">
              <span className="wizard-goals__label">Or type your own topic</span>
              <textarea
                value={customTopic}
                onChange={(event) => setCustomTopic(event.target.value)}
                placeholder="For example: my mental health, stress at work, our relationship..."
                className="wizard-goals__input wizard-goals__input--textarea"
                rows="3"
              />
            </label>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section className="wizard-step-stack">
          <div className="wizard-panel">
            <div className="wizard-panel__intro">
              <h2 className="wizard-panel__title">What do you need from this conversation?</h2>
              <p className="wizard-panel__subtitle">
                Choose the main outcome, then add the most helpful support.
              </p>
            </div>

            <div className="wizard-goals__section">
              <p className="wizard-goals__section-label">Main goal</p>
              <div className="wizard-goals__options">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setSelectedGoal(goal)}
                    className={`wizard-goals__chip ${
                      selectedGoal === goal ? 'wizard-goals__chip--selected' : ''
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div className="wizard-step-three-simple">
              <div className="wizard-step-three-simple__section">
                <div className="wizard-step-three-simple__header">
                  <p className="wizard-goals__section-label">What would help most?</p>
                  {selectedNeeds.length > 0 && (
                    <span className="wizard-step-three-simple__count">{selectedNeeds.length} selected</span>
                  )}
                </div>
                <div className="wizard-goals__options">
                  {needsCategories.flatMap((category) => category.options).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleNeed(option)}
                      className={`wizard-goals__chip ${
                        selectedNeeds.includes(option) ? 'wizard-goals__chip--selected' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wizard-step-three-simple__section">
                <button
                  type="button"
                  onClick={() => setShowUnderstandingOptions((prev) => !prev)}
                  className={`wizard-step-three-simple__toggle ${
                    showUnderstandingOptions ? 'wizard-step-three-simple__toggle--open' : ''
                  }`}
                >
                  <span>Anything else they should know?</span>
                  <span className="wizard-step-three-simple__toggle-meta">
                    {selectedUnderstandings.length > 0
                      ? `${selectedUnderstandings.length} selected`
                      : showUnderstandingOptions
                        ? 'Hide'
                        : 'Optional'}
                  </span>
                </button>

                {showUnderstandingOptions && (
                  <div className="wizard-step-three-simple__details">
                    <div className="wizard-goals__options">
                      {understandingCategories.flatMap((category) => category.options).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleUnderstanding(option)}
                          className={`wizard-goals__chip ${
                            selectedUnderstandings.includes(option)
                              ? 'wizard-goals__chip--selected'
                              : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {currentStep === 4 && (
        <ChecklistSummary
          selectedAudience={selectedAudience}
          selectedTopics={selectedTopics}
          customTopic={customTopic}
          selectedGoal={selectedGoal}
          selectedNeeds={selectedNeeds}
          selectedUnderstandings={selectedUnderstandings}
          onSaveMessage={onSaveMessage}
          onOpenSavedMessages={onOpenSavedMessages}
          onOpenDrafts={onOpenDrafts}
        />
      )}

      <div className="wizard-nav">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="wizard-nav__button wizard-nav__button--secondary"
        >
          Back
        </button>

        {currentStep < 4 && (
          <button
            type="button"
            onClick={() => {
              if (canMoveForward) {
                setCurrentStep((prev) => Math.min(4, prev + 1))
              }
            }}
            disabled={!canMoveForward}
            className="wizard-nav__button wizard-nav__button--primary"
          >
            Next
          </button>
        )}
      </div>

    </section>
  )
}

export default ConversationWizard
