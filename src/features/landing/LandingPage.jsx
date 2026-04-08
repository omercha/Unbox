import { useEffect, useState } from 'react'
import './LandingPage.css'

const previewMessage =
  'Message to my manager:\nI want to talk about work stress and burnout. What would help from you is patience, space, and listening. This is hard for me to say, and my goal is to be heard.'

const featureCards = [
  {
    title: 'Choose the person',
    text: 'Start with who you need to talk to so the message fits the situation.',
  },
  {
    title: 'Pick the topic',
    text: 'Select a topic from examples or type your own if it is not listed.',
  },
  {
    title: 'Set the objective',
    text: 'Clarify what you need, what you want to gain, and what matters most.',
  },
]

function LandingPage({
  onStart = () => {},
  onOpenDrafts = () => {},
  onOpenSavedMessages = () => {},
  onOpenFeelings = () => {},
}) {
  const [typedPreview, setTypedPreview] = useState('')

  useEffect(() => {
    let index = 0

    const timer = window.setInterval(() => {
      index += 1
      setTypedPreview(previewMessage.slice(0, index))

      if (index >= previewMessage.length) {
        window.clearInterval(timer)
      }
    }, 22)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return (
    <section className="landing-shell">
      <div className="landing-hero">
        <div className="landing-grid">
          <div className="landing-copy">
            <div className="animate-fade-up animation-delay-1 landing-copy__intro">
              <h1 className="landing-copy__title">
                Hard conversations made easy.
              </h1>
              <p className="landing-copy__text">
                Unbox helps people understand what is worrying them and provides the tools
                to turn it into a conversation.
              </p>
            </div>

            <div className="animate-fade-up animation-delay-2 landing-copy__actions">
              <button type="button" onClick={onStart} className="landing-copy__cta">
                Get Started
              </button>
              <div className="landing-copy__secondary-row">
                <button
                  type="button"
                  onClick={onOpenDrafts}
                  className="landing-copy__secondary"
                >
                  View saved drafts
                </button>
                <button
                  type="button"
                  onClick={onOpenSavedMessages}
                  className="landing-copy__secondary"
                >
                  View saved messages
                </button>
              </div>
            </div>

            <div className="animate-fade-up animation-delay-3 landing-feature-marquee">
              <div className="landing-feature-track">
                {[...featureCards, ...featureCards].map((card, index) => (
                  <div
                    key={`${card.title}-${index}`}
                    className="landing-feature-card"
                    aria-hidden={index >= featureCards.length}
                  >
                    <p className="landing-feature-card__title">{card.title}</p>
                    <p className="landing-feature-card__text">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="animate-fade-up animation-delay-3 landing-copy__disclaimer">
              Disclaimer: Unbox is a preparation tool and not a medical or counseling
              service.
            </p>
          </div>

          <div className="animate-fade-up animation-delay-2 landing-preview">
            <div className="landing-preview__window">
              <div className="landing-preview__header">
                <div>
                  <p className="landing-preview__eyebrow">Preview</p>
                  <p className="landing-preview__title">Generate one clear message draft.</p>
                </div>
                <div className="landing-preview__lights">
                  <span className="landing-preview__light landing-preview__light--rose" />
                  <span className="landing-preview__light landing-preview__light--amber" />
                  <span className="landing-preview__light landing-preview__light--emerald" />
                </div>
              </div>

              <div className="landing-preview__content">
                <div className="landing-preview__columns">
                  <div className="landing-preview__panel landing-preview__panel--steps">
                    <p className="landing-preview__label">3 simple steps</p>
                    <div className="landing-preview__steps">
                      <div className="landing-preview__step">
                        <span className="landing-preview__step-number">1</span>
                        <span>Choose the person</span>
                      </div>
                      <div className="landing-preview__step">
                        <span className="landing-preview__step-number">2</span>
                        <span>Pick the topic</span>
                      </div>
                      <div className="landing-preview__step">
                        <span className="landing-preview__step-number">3</span>
                        <span>Set the objective</span>
                      </div>
                    </div>
                  </div>

                  <div className="landing-preview__panel landing-preview__panel--dark">
                    <p className="landing-preview__label landing-preview__label--dark">
                      Draft message
                    </p>
                    <div className="landing-preview__typed-box">
                      <p className="landing-preview__typed-text">
                        {typedPreview}
                        <span className="typing-caret" aria-hidden="true" />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="landing-preview__panel">
                  <p className="landing-preview__label">Face-to-face checklist</p>
                  <p className="landing-preview__summary">
                    Person: Manager. Topic: work stress and burnout. Goal: to be heard. What
                    I need: patience, space, and for you to just listen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="feelings-tool" className="landing-feelings">
        <div className="landing-feelings__card">
          <div className="landing-feelings__copy">
            <h2 className="landing-feelings__title">How am I feeling?</h2>
            <p className="landing-feelings__text">
              Browse feeling categories and copy a short list of words that
              match how you feel.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFeelings}
            className="landing-feelings__cta"
          >
            Find out
          </button>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
