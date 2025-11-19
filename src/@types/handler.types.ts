type HandlerReturnType =
  | {
      success: true
    }
  | {
      success: false
      error?: unknown
      notFound?: boolean
      required?: string
    }

export type { HandlerReturnType }
