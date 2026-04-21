import React, { useEffect } from 'react'

/**
 * ModalComponent — generic confirmation dialog with backdrop.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen        - Controls visibility
 * @param {string}   props.title         - Modal heading
 * @param {string}   props.message       - Body text / description
 * @param {string}   props.confirmLabel  - Label for confirm button (default: "Confirm")
 * @param {string}   props.cancelLabel   - Label for cancel button (default: "Cancel")
 * @param {Function} props.onConfirm     - Called when user confirms
 * @param {Function} props.onCancel      - Called when user cancels or closes
 * @param {boolean}  props.isDanger      - Applies red styling to confirm button
 */
function ModalComponent({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal panel — stop propagation so clicks inside don't close it */}
      <div
        className="bg-white rounded-2xl border-2 border-ink-100 shadow-2xl w-full max-w-md p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${isDanger ? 'bg-red-100' : 'bg-ink-100'}`}>
            {isDanger ? (
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            )}
          </div>
          <div>
            <h2 id="modal-title" className="font-display font-bold text-lg text-ink-800">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-500 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            className="btn-secondary text-sm py-2.5"
            onClick={onCancel}
            autoFocus={!isDanger}
          >
            {cancelLabel}
          </button>
          <button
            className={isDanger ? 'btn-danger text-sm py-2.5' : 'btn-primary text-sm py-2.5'}
            onClick={onConfirm}
            autoFocus={isDanger}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalComponent
