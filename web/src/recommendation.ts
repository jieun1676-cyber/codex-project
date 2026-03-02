import type { RankedRecipe, Recipe, RecommendationInput } from './types'

function hasAllergyConflict(recipe: Recipe, allergies: RecommendationInput['allergies']): boolean {
  return allergies.some((allergy) => recipe.allergens.includes(allergy))
}

function textureScore(recipeTexture: RecommendationInput['texture'], inputTexture: RecommendationInput['texture']): number {
  return recipeTexture === inputTexture ? 25 : 5
}

function cookTimeScore(recipeCookTime: number, maxCookTime: number): number {
  const gap = Math.abs(maxCookTime - recipeCookTime)
  return Math.max(0, 20 - gap)
}

function conditionScore(recipe: Recipe, condition: RecommendationInput['condition']): number {
  if (condition === 'normal') {
    return 10
  }
  return recipe.tags.includes(condition) ? 25 : 0
}

export function recommendRecipes(input: RecommendationInput, source: Recipe[]): RankedRecipe[] {
  return source
    .filter((recipe) => recipe.ageRanges.includes(input.ageRange))
    .filter((recipe) => !hasAllergyConflict(recipe, input.allergies))
    .filter((recipe) => recipe.cookTime <= input.cookTime)
    .map((recipe) => {
      const score =
        50 +
        textureScore(recipe.texture, input.texture) +
        cookTimeScore(recipe.cookTime, input.cookTime) +
        conditionScore(recipe, input.condition)

      return { recipe, score }
    })
    .sort((a, b) => b.score - a.score)
}
