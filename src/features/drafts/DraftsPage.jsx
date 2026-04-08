import './DraftsPage.css'

function formatDraftDate(value) {
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

function DraftsPage({
  drafts = [],
  onOpenDraft = () => {},
  onDeleteDraft = () => {},
  onBackHome = () => {},
}) {
  return (
    <section className="drafts-shell">
      <div className="drafts-card">
        <div className="drafts-card__header">
          <div>
            <button type="button" onClick={onBackHome} className="drafts-card__back">
              Back to home
            </button>
            <p className="drafts-card__eyebrow">Saved drafts</p>
            <h1 className="drafts-card__title">Your locally saved conversations</h1>
            <p className="drafts-card__subtitle">
              Reopen a draft to keep working, or remove one you no longer need.
            </p>
          </div>
        </div>

        {drafts.length === 0 ? (
          <div className="drafts-empty">
            <p className="drafts-empty__title">No saved drafts yet</p>
            <p className="drafts-empty__text">
              Once you generate a conversation summary, you will be able to save it here.
            </p>
          </div>
        ) : (
          <div className="drafts-list">
            {drafts.map((draft) => (
              <div key={draft.id} className="drafts-item">
                <button
                  type="button"
                  onClick={() => onOpenDraft(draft)}
                  className="drafts-item__open"
                >
                  <span className="drafts-item__title">{draft.title}</span>
                  <span className="drafts-item__meta">
                    Saved {formatDraftDate(draft.updatedAt)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteDraft(draft.id)}
                  className="drafts-item__delete"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DraftsPage
