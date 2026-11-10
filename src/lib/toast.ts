import { toast as sonnerToast, type ExternalToast } from "sonner";

export type ToastOptions = ExternalToast;

/**
 * Global Toast System for VIJOY POWER SOLUTION
 * Provides standardized messages & design for CRUD, uploads, and form submissions.
 */
export const toast = {
  // Preset operations strictly required by user
  saved: (message = "Saved successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  created: (message = "Created successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  updated: (message = "Updated successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  deleted: (message = "Deleted successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  uploaded: (message = "Uploaded successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  submitted: (message = "Submitted successfully!", description?: string, options?: ToastOptions) =>
    sonnerToast.success(message, { description, duration: 3000, ...options }),

  // General toast notification methods
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, { duration: 3000, ...options }),

  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, { duration: 4000, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, { duration: 3500, ...options }),

  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, { duration: 3000, ...options }),

  loading: (message: string, options?: ToastOptions) =>
    sonnerToast.loading(message, options),

  dismiss: (id?: string | number) =>
    sonnerToast.dismiss(id),

  promise: sonnerToast.promise,
};

export default toast;
