import React from 'react'
import { formatDateTime } from '../utils/dateUtils'

/**
 * FeedbackItem — displays a single feedback entry card.
 *
 * @param {Object}   props
 * @param {Object}   props.feedback         - Feedback data { _id, name, email, message, createdAt }
 * @param {Function} props.onDeleteRequest  - Called with feedback._id when delete is clicked
 */
function FeedbackItem({ feedback, onDeleteRequest }) {
  const { _id, name, email, message, createdAt } = feedback

  /**
   * Generates initials for the avatar from the name.
   * @param {string} fullName
   * @returns {string} Up to 2 uppercase letters
   */
  const getInitials = (fullName) => {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  /**
   * Derives a deterministic background color for the avatar.
   * @param {string} str
   * @returns {string} Tailwind bg class
   */
  const getAvatarColor = (str) => {
    const colors = [
      'bg-violet-100 text-violet-700',
      'bg-sky-100 text-sky-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-teal-100 text-teal-700',
    ]
    const idx = str.charCodeAt(0) % colors.length
    return colors[idx]
  }

  return (
    <article className="card group p-5 animate-slide-up">
      {/* Header: avatar + name + email + delete */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            font-display font-bold text-sm select-none ${getAvatarColor(name)}`}>
            {getInitials(name)}
          </div>

          {/* Name + email */}
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-ink-800 truncate">{name}</h3>
            <a
              href={`mailto:${email}`}
              className="text-xs text-ink-400 hover:text-accent-blue transition-colors font-mono truncate block"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDeleteRequest(_id)}
          aria-label={`Delete feedback from ${name}`}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                     text-ink-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150
                     opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Message body */}
      <p className="mt-4 text-sm text-ink-600 leading-relaxed whitespace-pre-wrap">
        {message}
      </p>

      {/* Footer: timestamp */}
      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between">
        <span className="tag">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          {formatDateTime(createdAt)}
        </span>

        {/* Explicit delete label — visible on mobile / for accessibility */}
        <button
          onClick={() => onDeleteRequest(_id)}
          className="text-xs text-ink-300 hover:text-red-500 transition-colors font-mono
                     md:hidden flex items-center gap-1"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default FeedbackItem
