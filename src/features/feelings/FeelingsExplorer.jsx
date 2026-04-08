import { useMemo, useState } from 'react'
import SelectionGroup from '../conversation/components/SelectionGroup.jsx'
import { feelingsCatalog } from '../conversation/data/feelingsCatalog.js'
import useFeelingsState from './hooks/useFeelingsState.js'
import './FeelingsExplorer.css'

function buildSelectedSummary(items, onRemove) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="feelings-selected">
      <p className="feelings-selected__title">Selected feelings</p>
      <div className="feelings-selected__items">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onRemove(item)}
            className="feelings-selected__chip"
          >
            {item} ×
          </button>
        ))}
      </div>
    </div>
  )
}

function buildMessage(feelings) {
  if (feelings.length === 0) {
    return 'I am still figuring out how I feel.'
  }

  return `I am feeling: ${feelings.join(', ')}.`
}

function FeelingsExplorer({ onBackHome = () => {} }) {
  const { selectedMood, selectedFeelings, setSelectedMood, toggleFeeling, resetFeelingsState } =
    useFeelingsState()
  const [currentStep, setCurrentStep] = useState(() => (selectedMood ? 2 : 1))
  const [copied, setCopied] = useState(false)
  const stepLabel = currentStep === 3 ? 'Review' : `Step ${currentStep} of 2`

  const filteredCategories = useMemo(
    () => feelingsCatalog.filter((category) => category.type === selectedMood),
    [selectedMood],
  )

  const generatedMessage = buildMessage(selectedFeelings)

  const handleChooseMood = (mood) => {
    setSelectedMood(mood)
    setCurrentStep(2)
    setCopied(false)
  }

  const handleReset = () => {
    resetFeelingsState()
    setCurrentStep(1)
    setCopied(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="feelings-shell">
      <div className="feelings-header">
        <div>
          <p className="feelings-header__step">{stepLabel}</p>
          <h1 className="feelings-header__title">How am I feeling?</h1>
        </div>

        <div className="feelings-header__actions">
          <button type="button" onClick={onBackHome} className="feelings-header__secondary">
            Back to home
          </button>
          <button type="button" onClick={handleReset} className="feelings-header__secondary">
            Reset
          </button>
        </div>
      </div>

      {currentStep === 1 && (
        <section className="feelings-panel">
          <div className="feelings-panel__intro">
            <h2 className="feelings-panel__title">How are you feeling overall?</h2>
          </div>

          <div className="feelings-mood-grid">
            <button
              type="button"
              onClick={() => handleChooseMood('positive')}
              className="feelings-mood-card"
            >
              <span className="feelings-mood-card__title">Good</span>
            </button>

            <button
              type="button"
              onClick={() => handleChooseMood('negative')}
              className="feelings-mood-card feelings-mood-card--negative"
            >
              <span className="feelings-mood-card__title">Bad</span>
            </button>
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section className="feelings-stack">
          <div className="feelings-panel">
            <div className="feelings-panel__intro">
              <h2 className="feelings-panel__title">
                {selectedMood === 'positive' ? 'Good' : 'Bad'} feelings
              </h2>
              <p className="feelings-panel__subtitle">
                Browse the categories below and choose the words that feel closest.
              </p>
            </div>
          </div>

          {buildSelectedSummary(selectedFeelings, toggleFeeling)}

          {filteredCategories.map((category) => (
            <SelectionGroup
              key={category.title}
              title={category.title}
              options={category.options}
              selectedItems={selectedFeelings}
              onToggle={toggleFeeling}
              collapsible
              defaultOpen={false}
            />
          ))}
        </section>
      )}

      {currentStep === 3 && (
        <section className="feelings-panel feelings-panel--summary">
          <div className="feelings-panel__intro">
            <h2 className="feelings-panel__title">Your feelings list</h2>
            <p className="feelings-panel__subtitle">
              Keep this as a simple list, or copy the sentence below.
            </p>
          </div>

          <div className="feelings-summary">
            <div className="feelings-summary__list">
              {selectedFeelings.map((feeling) => (
                <span key={feeling} className="feelings-summary__chip">
                  {feeling}
                </span>
              ))}
            </div>

            <textarea readOnly value={generatedMessage} className="feelings-summary__textarea" />

            <button type="button" onClick={handleCopy} className="feelings-summary__copy">
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </section>
      )}

      <div className="feelings-nav">
        <button
          type="button"
          onClick={() => {
            if (currentStep === 2) {
              setCurrentStep(1)
            }

            if (currentStep === 3) {
              setCurrentStep(2)
            }
          }}
          disabled={currentStep === 1}
          className="feelings-nav__button feelings-nav__button--secondary"
        >
          Back
        </button>

        {currentStep === 2 && (
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            disabled={selectedFeelings.length === 0}
            className="feelings-nav__button feelings-nav__button--primary"
          >
            Review feelings
          </button>
        )}
      </div>
    </section>
  )
}

export default FeelingsExplorer
