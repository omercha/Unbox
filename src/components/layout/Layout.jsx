import './Layout.css'

function Layout({ children, onHome = () => {}, theme = 'light', onToggleTheme = () => {} }) {
  return (
    <div className="layout-shell">
      <div className="layout-shell__grid" />
      <div className="layout-shell__glow layout-shell__glow--left" />
      <div className="layout-shell__glow layout-shell__glow--right" />

      <header className="layout-header">
        <nav className="layout-header__nav">
          <button
            type="button"
            onClick={onHome}
            className="layout-header__brand"
          >
            <p className="layout-header__brand-name">UNBOX</p>
            <p className="layout-header__brand-subtitle">
              © 2026 The Black Box Approach Limited
            </p>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="layout-header__theme-toggle"
          >
            {theme === 'dark' ? 'Light mode' : 'Night mode'}
          </button>
        </nav>
      </header>

      <main className="layout-main">{children}</main>

      <footer className="layout-footer">
        <div className="layout-footer__inner">
          <div className="layout-footer__support">
            <div className="layout-footer__top">
              <div className="layout-footer__copy">
                <p className="layout-footer__text">
                  If you need immediate help, these services can offer more direct support:
                </p>
              </div>

              <div className="layout-footer__links">
                <a
                  href="https://www.samaritans.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="layout-footer__link"
                >
                  Samaritans
                </a>
                <a
                  href="https://www.nhs.uk/nhs-services/mental-health-services/"
                  target="_blank"
                  rel="noreferrer"
                  className="layout-footer__link"
                >
                  NHS Mental Health Services
                </a>
              </div>
            </div>

            <div className="layout-footer__meta">
              <p className="layout-footer__meta-text">Learn more at</p>
              <a
                href="https://theblackboxapproach.com/"
                target="_blank"
                rel="noreferrer"
                className="layout-footer__brand-link"
              >
                theblackboxapproach.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
