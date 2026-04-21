import React from 'react'
import { todayISO } from '../utils/dateUtils'

/**
 * FilterBar — provides keyword search and date range filtering.
 *
 * @param {Object}   props
 * @param {Object}   props.filters          - Current filter state { keyword, dateFrom, dateTo }
 * @param {Function} props.onFilterChange   - Called with updated filters object
 * @param {number}   props.resultCount      - Number of entries currently shown
 * @param {number}   props.totalCount       - Total number of entries
 */
function FilterBar({ filters, onFilterChange, resultCount, totalCount }) {
  /**
   * Updates a single filter key and propagates the change upward.
   * @param {string} key   - Filter key
   * @param {string} value - New value
   */
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  /** Resets all filter fields. */
  const handleReset = () => {
    onFilterChange({ keyword: '', dateFrom: '', dateTo: '' })
  }

  const hasActiveFilters = filters.keyword || filters.dateFrom || filters.dateTo

  return (
    <div className="bg-white rounded-2xl border-2 border-ink-100 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink-700 text-sm uppercase tracking-widest">
          Filter Feedback
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-mono text-accent-orange hover:text-ink-800 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Keyword search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, or message…"
          value={filters.keyword}
          onChange={(e) => handleChange('keyword', e.target.value)}
          className="input-field pl-10 text-sm"
          aria-label="Keyword search"
        />
      </div>

      {/* Date range row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-ink-400 uppercase tracking-wider">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || todayISO()}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="input-field text-sm"
            aria-label="Filter from date"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-ink-400 uppercase tracking-wider">To</label>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom}
            max={todayISO()}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="input-field text-sm"
            aria-label="Filter to date"
          />
        </div>
      </div>

      {/* Result count badge */}
      <div className="flex items-center gap-2 pt-1">
        <div className={`h-1.5 w-1.5 rounded-full ${hasActiveFilters ? 'bg-accent-lime' : 'bg-ink-300'}`} />
        <span className="text-xs font-mono text-ink-400">
          Showing{' '}
          <span className="text-ink-700 font-medium">{resultCount}</span>
          {' '}of{' '}
          <span className="text-ink-700 font-medium">{totalCount}</span>
          {' '}entries
        </span>
      </div>
    </div>
  )
}

export default FilterBar
