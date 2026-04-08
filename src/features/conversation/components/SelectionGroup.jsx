import { useState } from 'react'
import './SelectionGroup.css'

function SelectionGroup({
  title,
  options,
  selectedItems,
  onToggle,
  collapsible = false,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const selectedCount = options.filter((option) => selectedItems.includes(option)).length

  return (
    <section className="selection-group">
      <div className="selection-group__header">
        <div className="selection-group__title-wrap">
          <h3 className="selection-group__title">{title}</h3>
          {selectedCount > 0 && (
            <span className="selection-group__count">{selectedCount} selected</span>
          )}
        </div>

        <div className="selection-group__actions">
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="selection-group__toggle"
            >
              {isOpen ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>

      <div className={`selection-group__items ${!isOpen ? 'hidden' : ''}`}>
        {options.map((option) => {
          const isSelected = selectedItems.includes(option)

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`selection-chip ${isSelected ? 'selection-chip--selected' : ''}`}
            >
              {isSelected ? `\u2713 ${option}` : option}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default SelectionGroup
