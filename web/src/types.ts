export type AgeRange = '12-17' | '18-23' | '24-30' | '31-36'

export type TextureLevel = 'puree' | 'soft-chopped' | 'bite-sized'

export type ConditionTag =
  | 'normal'
  | 'constipation'
  | 'cold'
  | 'low-appetite'
  | 'protein-boost'

export type Allergen =
  | 'egg'
  | 'milk'
  | 'soy'
  | 'peanut'
  | 'wheat'
  | 'fish'
  | 'shellfish'

export interface Recipe {
  id: string
  title: string
  origin?: 'KR' | 'GLOBAL'
  source?: string
  imageUrl?: string
  stepImages?: string[]
  ageRanges: AgeRange[]
  ingredients: string[]
  allergens: Allergen[]
  cookTime: number
  texture: TextureLevel
  tags: ConditionTag[]
  nutrition?: {
    protein?: number
    carbs?: number
    fat?: number
  }
  summary: string
  instructions: string[]
}

export interface RecommendationInput {
  ageRange: AgeRange
  allergies: Allergen[]
  condition: ConditionTag
  cookTime: number
  texture: TextureLevel
}

export interface RankedRecipe {
  recipe: Recipe
  score: number
}
