import { describe, expect, it } from 'vitest'
import { recipes } from './data/recipes'
import { recommendRecipes } from './recommendation'

describe('recommendRecipes', () => {
  it('excludes recipes that conflict with allergies', () => {
    const results = recommendRecipes(
      {
        ageRange: '24-30',
        allergies: ['egg', 'fish'],
        condition: 'normal',
        cookTime: 25,
        texture: 'soft-chopped',
      },
      recipes,
    )

    const ids = results.map((item) => item.recipe.id)
    expect(ids).not.toContain('r5')
    expect(ids).not.toContain('r8')
  })

  it('applies age and cook-time hard filters', () => {
    const results = recommendRecipes(
      {
        ageRange: '12-17',
        allergies: [],
        condition: 'normal',
        cookTime: 10,
        texture: 'puree',
      },
      recipes,
    )

    expect(results.every((item) => item.recipe.ageRanges.includes('12-17'))).toBe(true)
    expect(results.every((item) => item.recipe.cookTime <= 10)).toBe(true)
  })

  it('ranks matching condition and texture higher', () => {
    const results = recommendRecipes(
      {
        ageRange: '24-30',
        allergies: [],
        condition: 'protein-boost',
        cookTime: 25,
        texture: 'bite-sized',
      },
      recipes,
    )

    expect(results[0]?.recipe.id).toBe('r3')
  })

  it('returns empty list when no recipe can satisfy hard filters', () => {
    const results = recommendRecipes(
      {
        ageRange: '12-17',
        allergies: ['wheat'],
        condition: 'low-appetite',
        cookTime: 9,
        texture: 'bite-sized',
      },
      recipes,
    )

    expect(results).toHaveLength(0)
  })
})
