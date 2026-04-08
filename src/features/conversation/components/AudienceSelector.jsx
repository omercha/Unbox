import './AudienceSelector.css'

function AudienceSelector({ options, selectedAudience, onSelect }) {
  return (
    <div className="audience-grid">
      {options.map((option) => {
        const isSelected = selectedAudience === option.id

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`audience-card ${isSelected ? 'audience-card--selected' : ''}`}
          >
            <span className="audience-card__label">{option.label}</span>
            <span className="audience-card__description">{option.description}</span>
          </button>
        )
      })}
    </div>
  )
}

export default AudienceSelector
