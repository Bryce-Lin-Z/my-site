export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type ReviewRating = 'Easy' | 'Medium' | 'Hard'
export type QuestionStatus = 'not_started' | 'solved' | 'reviewing'

export interface LCQuestion {
  id: number
  title: string
  slug: string
  difficulty: Difficulty
  topics: string[]
  category: string
}

export interface ReviewEntry {
  date: string
  rating: ReviewRating
  nextInterval: number
}

export interface UserProgress {
  id: number
  status: QuestionStatus
  notes: string
  solvedAt: string | null
  nextReviewDate: string | null
  interval: number
  reviewHistory: ReviewEntry[]
}

export interface LCSettings {
  geminiApiKey: string
}
