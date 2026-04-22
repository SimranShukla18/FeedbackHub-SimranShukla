import React, { useState, useEffect, useCallback, useMemo } from 'react'
import FeedbackForm from '../components/FeedbackForm'
import FeedbackList from '../components/FeedbackList'
import FilterBar from '../components/FilterBar'
import ModalComponent from '../components/ModalComponent'
import FeedbackService from '../services/FeedbackService'
import { applyFilters } from '../utils/dateUtils'

/**
 * HomePage — orchestrates state, data fetching, and user interactions.
 * Manages: feedback entries, filters, delete confirmation, loading & error states.
 */
function HomePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({ keyword: '', dateFrom: '', dateTo: '' })

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, targetId: null, targetName: '' })

  /**
   * Loads all feedback entries from the API.
   */
  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await FeedbackService.getAllFeedback()

      // Guard: ensure we always work with an array regardless of server shape
      const list = Array.isArray(data) ? data : []

      // Sort newest first
      const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setEntries(sorted)
    } catch (err) {
      setError(err.message || 'Could not load feedback entries.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  /**
   * Submits feedback data to the backend and prepends the result to the list.
   * @param {Object} feedbackData - { name, email, message }
   */
  const handleSubmit = async (feedbackData) => {
    setSubmitLoading(true)
    try {
      const created = await FeedbackService.submitFeedback(feedbackData)
      setEntries((prev) => [created, ...prev])
    } finally {
      setSubmitLoading(false)
    }
  }

  /**
   * Opens the delete confirmation modal for a specific feedback entry.
   * @param {string} id - Feedback entry ID
   */
  const handleDeleteRequest = (id) => {
    const target = entries.find((e) => e._id === id)
    setDeleteModal({ open: true, targetId: id, targetName: target?.name || '' })
  }

  /** Closes the delete modal without taking action. */
  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, targetId: null, targetName: '' })
  }

  /**
   * Confirms and executes deletion of the targeted feedback entry.
   */
  const handleDeleteConfirm = async () => {
    const { targetId } = deleteModal
    setDeleteModal({ open: false, targetId: null, targetName: '' })
    try {
      await FeedbackService.deleteFeedback(targetId)
      // Optimistic removal — no re-fetch needed
      setEntries((prev) => prev.filter((e) => e._id !== targetId))
    } catch (err) {
      setError(`Failed to delete entry: ${err.message}`)
    }
  }

  /** Apply keyword + date filters to the full entries array. */
  const filteredEntries = useMemo(() => applyFilters(entries, filters), [entries, filters])

  const hasActiveFilters = filters.keyword || filters.dateFrom || filters.dateTo

  return (
    <div className="min-h-screen bg-ink-50 grain">
      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <header className="bg-ink-800 border-b-2 border-ink-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-lime flex items-center justify-center">
              <svg className="w-4 h-4 text-ink-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">
              FeedbackHub
            </span>
          </div>

          {/* Entry count badge */}
          {!loading && (
            <div className="flex items-center gap-2 bg-ink-700 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-lime animate-pulse" />
              <span className="font-mono text-xs text-ink-300">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ─── Hero strip ──────────────────────────────────────────────────────── */}
      <div className="bg-ink-800 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
            Collect. Review.<br />
            <span className="text-accent-lime">Act on feedback.</span>
          </h1>
          <p className="mt-2 text-ink-400 text-sm max-w-md">
            Submit feedback, filter by keyword or date, and manage entries — all in one place.
          </p>
        </div>
      </div>

      {/* ─── Main content ────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left sidebar: form */}
          <aside className="lg:col-span-2 space-y-4">
            <FeedbackForm onSubmit={handleSubmit} loading={submitLoading} />
          </aside>

          {/* Right main: filters + list */}
          <section className="lg:col-span-3 space-y-4">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredEntries.length}
              totalCount={entries.length}
            />
            <FeedbackList
              feedbackEntries={filteredEntries}
              loading={loading}
              error={error}
              onDeleteRequest={handleDeleteRequest}
              isFiltered={!!hasActiveFilters}
            />
          </section>
        </div>
      </main>

      {/* ─── Delete confirmation modal ────────────────────────────────────────── */}
      <ModalComponent
        isOpen={deleteModal.open}
        title="Delete Feedback"
        message={`Are you sure you want to permanently delete the feedback from "${deleteModal.targetName}"? This action cannot be undone.`}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDanger
      />
    </div>
  )
}

export default HomePage