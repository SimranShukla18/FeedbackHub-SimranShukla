import React from 'react'
import FeedbackItem from './FeedbackItem'

/**
 * Skeleton placeholder shown while data loads.
 */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-ink-100 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded-md shimmer" />
          <div className="h-3 w-44 rounded-md shimmer" />
        </div>
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-3 w-full rounded-md shimmer" />
        <div className="h-3 w-5/6 rounded-md shimmer" />
        <div className="h-3 w-4/6 rounded-md shimmer" />
      </div>
      <div className="h-3 w-36 rounded-md shimmer pt-2" />
    </div>
  )
}

/**
 * FeedbackList — renders filtered feedback entries or states (loading / empty).
 *
 * @param {Object}   props
 * @param {Array}    props.feedbackEntries   - Filtered array of feedback objects
 * @param {boolean}  props.loading           - Shows skeleton loaders
 * @param {string}   props.error             - Error message string
 * @param {Function} props.onDeleteRequest   - Passed down to each FeedbackItem
 * @param {boolean}  props.isFiltered        - True when active filters are applied
 */
function FeedbackList({ feedbackEntries, loading, error, onDeleteRequest, isFiltered }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="font-display font-semibold text-ink-700 mb-1">Failed to load feedback</p>
        <p className="text-sm text-ink-400">{error}</p>
      </div>
    )
  }

  if (feedbackEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
          {isFiltered ? (
            <svg className="w-7 h-7 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          )}
        </div>
        <p className="font-display font-semibold text-ink-700 mb-1">
          {isFiltered ? 'No results found' : 'No feedback yet'}
        </p>
        <p className="text-sm text-ink-400 max-w-xs">
          {isFiltered
            ? 'Try adjusting your search or date range filters.'
            : 'Be the first to submit feedback using the form.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedbackEntries.map((entry, idx) => (
        <div
          key={entry._id}
          style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
          className="animate-slide-up"
        >
          <FeedbackItem
            feedback={entry}
            onDeleteRequest={onDeleteRequest}
          />
        </div>
      ))}
    </div>
  )
}

export default FeedbackList
