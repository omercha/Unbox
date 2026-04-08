import './SavedMessagesPage.css'

function formatSavedDate(value) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function SavedMessagesPage({
  messages = [],
  onDeleteMessage = () => {},
  onBackHome = () => {},
}) {
  return (
    <section className="messages-shell">
      <div className="messages-card">
        <div className="messages-card__header">
          <button type="button" onClick={onBackHome} className="messages-card__back">
            Back to home
          </button>
          <p className="messages-card__eyebrow">Saved messages</p>
          <h1 className="messages-card__title">Messages you have finished and kept</h1>
          <p className="messages-card__subtitle">
            These are final message drafts stored locally on this device.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="messages-empty">
            <p className="messages-empty__title">No saved messages yet</p>
            <p className="messages-empty__text">
              When you reach the final generation step, you will be able to save completed
              messages here.
            </p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => {
              const bodyText = message.messageText || message.fullMessage || message.openingLine || ''

              return (
                <article key={message.id} className="messages-item">
                  <div className="messages-item__meta">
                    <p className="messages-item__title">{message.title}</p>
                    <p className="messages-item__date">
                      Saved {formatSavedDate(message.updatedAt)}
                    </p>
                  </div>

                  <div className="messages-item__body">
                    <p className="messages-item__label">Message</p>
                    <p className="messages-item__text">{bodyText}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteMessage(message.id)}
                    className="messages-item__delete"
                  >
                    Delete
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default SavedMessagesPage
