export interface RatingTag {
  label: string
  value: string
  type: 'positive' | 'negative'
}

export interface RatingReviewFormData {
  tags: string[]
  review: string
}

export interface RatingReviewModalProps {
  modelValue: boolean
  title?: string
  maxLength?: number
  minSelection?: number
  positiveTags?: RatingTag[]
  negativeTags?: RatingTag[]
}

export interface RatingReviewResult {
  tags: string[]
  review: string
}
