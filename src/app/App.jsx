import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout.jsx'
import ConversationWizard from '../features/conversation/ConversationWizard.jsx'
import DraftsPage from '../features/drafts/DraftsPage.jsx'
import FeelingsExplorer from '../features/feelings/FeelingsExplorer.jsx'
import LandingPage from '../features/landing/LandingPage.jsx'
import useDrafts from '../features/conversation/hooks/useDrafts.js'
import useSavedMessages from '../features/conversation/hooks/useSavedMessages.js'
import SavedMessagesPage from '../features/messages/SavedMessagesPage.jsx'

const THEME_KEY = 'unbox_theme'

function App() {
  const [view, setView] = useState('home')
  const [draftToLoad, setDraftToLoad] = useState(null)
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_KEY) || 'light'
    } catch {
      return 'light'
    }
  })
  const { drafts, saveDraft, deleteDraft } = useDrafts()
  const { messages, saveMessage, deleteMessage } = useSavedMessages()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <Layout
      onHome={() => setView('home')}
      theme={theme}
      onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
    >
      {view === 'wizard' ? (
        <ConversationWizard
          onBackHome={() => setView('home')}
          onSaveDraft={saveDraft}
          onOpenDrafts={() => setView('drafts')}
          onSaveMessage={saveMessage}
          onOpenSavedMessages={() => setView('messages')}
          draftToLoad={draftToLoad}
          onDraftLoaded={() => setDraftToLoad(null)}
        />
      ) : view === 'drafts' ? (
        <DraftsPage
          onBackHome={() => setView('home')}
          drafts={drafts}
          onOpenDraft={(draft) => {
            setDraftToLoad(draft)
            setView('wizard')
          }}
          onDeleteDraft={deleteDraft}
        />
      ) : view === 'messages' ? (
        <SavedMessagesPage
          onBackHome={() => setView('home')}
          messages={messages}
          onDeleteMessage={deleteMessage}
        />
      ) : view === 'feelings' ? (
        <FeelingsExplorer onBackHome={() => setView('home')} />
      ) : (
        <LandingPage
          onStart={() => setView('wizard')}
          onOpenDrafts={() => setView('drafts')}
          onOpenSavedMessages={() => setView('messages')}
          onOpenFeelings={() => setView('feelings')}
        />
      )}
    </Layout>
  )
}

export default App
