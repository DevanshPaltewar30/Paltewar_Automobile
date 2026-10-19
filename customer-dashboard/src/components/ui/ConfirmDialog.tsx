'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  variant?: 'danger' | 'warning'
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-box confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <div className={`confirm-icon confirm-icon-${variant}`}>
            <AlertTriangle size={28} />
          </div>
          <div className="confirm-title">{title}</div>
          <p className="confirm-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={`btn btn-${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className="loading-spinner" style={{ width: 14, height: 14 }} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
