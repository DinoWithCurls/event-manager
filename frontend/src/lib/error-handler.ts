import type { ApiResponse } from "./types"

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT")
    this.name = "ConflictError"
  }
}

export function handleApiError(error: unknown): ApiResponse<null> {
  console.error("[v0] API Error:", error)

  if (error instanceof AppError) {
    return {
      error: error.message,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
    }
  }

  return {
    error: "An unexpected error occurred",
  }
}

export async function withErrorHandling<T>(operation: () => Promise<T>, context: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`[v0] Error in ${context}:`, error)
    throw error
  }
}

// Retry utility for failed operations
export async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[v0] Attempt ${attempt}/${maxRetries} failed:`, lastError.message)

      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}
