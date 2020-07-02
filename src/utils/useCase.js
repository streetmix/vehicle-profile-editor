import { DEFAULT_USE_CASE } from '../constants'
export function useCases (useCase) {
  if (useCase !== DEFAULT_USE_CASE) {
    return DEFAULT_USE_CASE
  }
}
