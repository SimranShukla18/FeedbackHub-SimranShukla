import React, { useState } from 'react'
import { validateFeedbackForm } from '../utils/validators'

/**
 * FeedbackForm — controlled form for collecting user feedback.
 * Handles field-level validation and submission.
 *
 * @param {Object}   props
 * @param {Function} props.onSubmit  - Async function called with { name, email, message }
 * @param {boolean}  props.loading   - Disables form while submission is in progress
 */
function FeedbackForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [success, setSuccess] = useState(false)

  /**
   * Handles input changes and clears field errors on the fly.
   * @param {React.ChangeEvent} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Live-clear error once user starts correcting the field
    if (touched[name] && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Marks a field as touched on blur and runs validation for that field.
   * @param {React.FocusEvent} e
   */
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldErrors = validateFeedbackForm(formData)
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || '' }))
  }

  /**
   * Submits feedback after full-form validation.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mark all fields as touched to show all errors at once
    setTouched({ name: true, email: true, message: true })

    const fieldErrors = validateFeedbackForm(formData)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    try {
      await onSubmit({ ...formData })
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      setTouched({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to submit feedback. Please try again.' })
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-ink-100 overflow-hidden">
      {/* Form header */}
      <div className="bg-ink-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-lime/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">Submit Feedback</h2>
            <p className="text-ink-300 text-xs mt-0.5">Your input helps us improve</p>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {success && (
        <div className="mx-6 mt-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-slide-down">
          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-emerald-700 font-medium">Feedback submitted successfully!</p>
        </div>
      )}

      {/* Global submit error */}
      {errors.submit && (
        <div className="mx-6 mt-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-slide-down">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Form fields */}
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-display font-medium text-ink-700">
            Full Name <span className="text-accent-orange">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Jane Doe"
            className={`input-field ${touched.name && errors.name ? 'error' : ''}`}
            disabled={loading}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!(touched.name && errors.name)}
          />
          {touched.name && errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 animate-slide-down">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-display font-medium text-ink-700">
            Email Address <span className="text-accent-orange">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`input-field ${touched.email && errors.email ? 'error' : ''}`}
            disabled={loading}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!(touched.email && errors.email)}
          />
          {touched.email && errors.email && (
            <p id="email-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 animate-slide-down">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-sm font-display font-medium text-ink-700">
            Message <span className="text-accent-orange">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Share your thoughts, suggestions, or concerns…"
            rows={4}
            className={`input-field resize-none ${touched.message && errors.message ? 'error' : ''}`}
            disabled={loading}
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={!!(touched.message && errors.message)}
          />
          <div className="flex items-start justify-between">
            {touched.message && errors.message ? (
              <p id="message-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 animate-slide-down">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </p>
            ) : <span />}
            <span className="text-xs font-mono text-ink-300 ml-auto">{formData.message.length} chars</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Send Feedback
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm
