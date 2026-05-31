export const AUTH_FETCH_TIMEOUT_MS = 12_000

export class FetchTimeoutError extends Error {
  constructor(message = 'Tempo esgotado ao conectar ao Supabase.') {
    super(message)
    this.name = 'FetchTimeoutError'
  }
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = AUTH_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const signal = init?.signal
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new FetchTimeoutError()
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}
