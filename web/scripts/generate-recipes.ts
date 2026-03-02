import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Recipe } from '../src/types'

interface MealDbResponse {
  meals: Array<Record<string, string | null>> | null
}

interface KoreaResponse {
  COOKRCP01?: {
    total_count?: string
    row?: Array<Record<string, string>>
  }
}

const ageRange = ['24-30', '31-36'] as const
const koreanPageSize = 1000
const defaultKoreanMaxRows = 5000

function getKoreanApiKey(): string | null {
  const key = process.env.DATA_GO_KR_API_KEY?.trim() ?? process.env.MFDS_API_KEY?.trim()
  if (!key || key.toLowerCase() === 'sample') {
    return null
  }
  return key
}

function getKoreanMaxRows(): number {
  const raw = Number(process.env.KR_RECIPE_MAX_ROWS)
  if (!Number.isFinite(raw) || raw <= 0) {
    return defaultKoreanMaxRows
  }
  return Math.floor(raw)
}

const allergenMap: Array<{ allergen: Recipe['allergens'][number]; keys: string[] }> = [
  { allergen: 'egg', keys: ['egg'] },
  { allergen: 'milk', keys: ['milk', 'cream', 'butter', 'cheese', 'yogurt'] },
  { allergen: 'soy', keys: ['soy', 'tofu'] },
  { allergen: 'peanut', keys: ['peanut'] },
  { allergen: 'wheat', keys: ['flour', 'bread', 'noodle', 'pasta', 'wheat'] },
  { allergen: 'fish', keys: ['fish', 'salmon', 'cod', 'tuna', 'sardine', 'mackerel', 'anchovy'] },
  { allergen: 'shellfish', keys: ['shrimp', 'prawn', 'clam', 'mussel', 'crab', 'oyster', 'scallop'] },
]

function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

function pickAllergens(ingredients: string[]): Recipe['allergens'] {
  const joined = normalizeText(ingredients.join(' '))
  const result: Recipe['allergens'] = []

  for (const entry of allergenMap) {
    const hit = entry.keys.some((key) => joined.includes(key))
    if (hit) {
      result.push(entry.allergen)
    }
  }

  return result
}

function textureByCategory(category: string): Recipe['texture'] {
  const value = normalizeText(category)
  if (value.includes('soup') || value.includes('breakfast') || value.includes('dessert')) {
    return 'soft-chopped'
  }
  if (value.includes('side') || value.includes('starter')) {
    return 'soft-chopped'
  }
  return 'bite-sized'
}

function parseIngredientsFromMealDb(meal: Record<string, string | null>): string[] {
  const result: string[] = []
  for (let i = 1; i <= 20; i += 1) {
    const key = `strIngredient${i}`
    const value = meal[key]
    if (typeof value === 'string') {
      const cleaned = value.trim()
      if (cleaned.length > 0) {
        result.push(cleaned)
      }
    }
  }
  return result
}

function parseInstructionText(raw: string | null | undefined): string[] {
  const text = raw?.trim()
  if (!text) {
    return []
  }

  const lines = text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length > 1) {
    return lines.slice(0, 10)
  }

  return text
    .split(/\.\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.endsWith('.') ? line : `${line}.`))
    .slice(0, 10)
}

function parseKoreanManualSteps(item: Record<string, string>): string[] {
  const steps: string[] = []

  for (let i = 1; i <= 20; i += 1) {
    const key = `MANUAL${String(i).padStart(2, '0')}`
    const value = item[key]?.trim()
    if (value && value.length > 0) {
      steps.push(value.replace(/\.[a-z]$/i, '.'))
    }
  }

  return steps
}

function parseKoreanManualStepImages(item: Record<string, string>): string[] {
  const images: string[] = []

  for (let i = 1; i <= 20; i += 1) {
    const key = `MANUAL_IMG${String(i).padStart(2, '0')}`
    const value = item[key]?.trim()
    if (value && value.startsWith('http')) {
      images.push(value)
    }
  }

  return images
}

function mapMealDbToRecipe(meal: Record<string, string | null>, idx: number): Recipe | null {
  const title = meal.strMeal?.trim()
  const instructions = meal.strInstructions?.trim()
  const category = meal.strCategory?.trim() ?? 'General'
  const area = meal.strArea?.trim() ?? 'Global'
  const ingredients = parseIngredientsFromMealDb(meal)
  const imageUrl = meal.strMealThumb?.trim() ?? undefined

  if (!title || ingredients.length === 0) {
    return null
  }

  const tags: Recipe['tags'] = ['normal']
  if (
    ingredients.some((item) =>
      ['chicken', 'beef', 'turkey', 'egg', 'salmon', 'fish', 'lentil', 'tofu'].some((protein) =>
        normalizeText(item).includes(protein),
      ),
    )
  ) {
    tags.push('protein-boost')
  }

  const summary = instructions?.slice(0, 160) ?? `Global ${category} recipe from ${area}.`
  const instructionSteps = parseInstructionText(instructions)

  return {
    id: `g${idx}`,
    title,
    origin: 'GLOBAL',
    source: 'TheMealDB',
    imageUrl,
    ageRanges: [...ageRange],
    ingredients,
    allergens: pickAllergens(ingredients),
    cookTime: 20,
    texture: textureByCategory(category),
    tags,
    summary,
    instructions: instructionSteps.length > 0 ? instructionSteps : ['No step-by-step instructions available.'],
  }
}

function mapKoreaToRecipe(item: Record<string, string>, idx: number): Recipe | null {
  const title = item.RCP_NM?.trim()
  const parts = item.RCP_PARTS_DTLS?.replaceAll('\n', ', ').trim()
  const tagsRaw = item.HASH_TAG?.trim()
  const instructionSteps = parseKoreanManualSteps(item)
  const stepImages = parseKoreanManualStepImages(item)
  const imageUrl = item.ATT_FILE_NO_MAIN?.trim() || item.ATT_FILE_NO_MK?.trim() || undefined

  if (!title) {
    return null
  }

  const ingredients = (parts ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 1)
    .slice(0, 12)

  const tags: Recipe['tags'] = ['normal']
  if (normalizeText(tagsRaw ?? '').includes('두부') || normalizeText(parts ?? '').includes('계란')) {
    tags.push('protein-boost')
  }

  return {
    id: `k${idx}`,
    title,
    origin: 'KR',
    source: 'MFDS COOKRCP01 sample',
    imageUrl,
    stepImages,
    ageRanges: ['12-17', '18-23', '24-30'],
    ingredients,
    allergens: pickAllergens(ingredients),
    cookTime: 15,
    texture: 'soft-chopped',
    tags,
    summary: item.RCP_NA_TIP?.slice(0, 160) ?? 'Korean public recipe data.',
    instructions: instructionSteps.length > 0 ? instructionSteps : ['조리 순서 정보가 제공되지 않았습니다.'],
  }
}

async function fetchMealDbBatch(letter: string): Promise<Array<Record<string, string | null>>> {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
  if (!res.ok) {
    return []
  }
  const json = (await res.json()) as MealDbResponse
  return json.meals ?? []
}

async function fetchKoreanRecipesWithServiceKey(serviceKey: string, start: number, end: number): Promise<KoreaResponse | null> {
  const res = await fetch(`https://openapi.foodsafetykorea.go.kr/api/${serviceKey}/COOKRCP01/json/${start}/${end}`)
  if (!res.ok) {
    return null
  }

  return (await res.json()) as KoreaResponse
}

async function fetchKoreanRecipesSample(): Promise<Array<Record<string, string>>> {
  const res = await fetch('https://openapi.foodsafetykorea.go.kr/api/sample/COOKRCP01/json/1/5')
  if (!res.ok) {
    return []
  }

  const json = (await res.json()) as KoreaResponse
  return json.COOKRCP01?.row ?? []
}

async function fetchKoreanRecipes(): Promise<Array<Record<string, string>>> {
  const serviceKey = getKoreanApiKey()
  if (!serviceKey) {
    console.log('DATA_GO_KR_API_KEY not set. Falling back to sample KR dataset (5 rows).')
    return fetchKoreanRecipesSample()
  }

  const maxRows = getKoreanMaxRows()
  const firstPage = await fetchKoreanRecipesWithServiceKey(serviceKey, 1, koreanPageSize)
  if (!firstPage) {
    console.log('Failed to fetch KR recipes with key. Falling back to sample dataset.')
    return fetchKoreanRecipesSample()
  }

  const totalCount = Number(firstPage.COOKRCP01?.total_count ?? '0')
  const firstRows = firstPage.COOKRCP01?.row ?? []
  const targetRows = Math.min(maxRows, totalCount > 0 ? totalCount : maxRows)
  const pageCount = Math.max(1, Math.ceil(targetRows / koreanPageSize))

  const remainingPageCalls: Array<Promise<KoreaResponse | null>> = []
  for (let page = 2; page <= pageCount; page += 1) {
    const start = (page - 1) * koreanPageSize + 1
    const end = Math.min(page * koreanPageSize, targetRows)
    remainingPageCalls.push(fetchKoreanRecipesWithServiceKey(serviceKey, start, end))
  }

  const remainingPages = await Promise.all(remainingPageCalls)
  const mergedRows = [
    ...firstRows,
    ...remainingPages.flatMap((page) => page?.COOKRCP01?.row ?? []),
  ].slice(0, targetRows)

  const deduped = Array.from(new Map(mergedRows.map((item) => [item.RCP_NM?.trim() ?? '', item])).values()).filter(
    (item) => (item.RCP_NM?.trim() ?? '').length > 0,
  )

  console.log(`Fetched ${deduped.length} KR recipes via data.go.kr key (requested up to ${targetRows}).`)
  return deduped
}

async function main(): Promise<void> {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const mealResults = await Promise.all(letters.map((letter) => fetchMealDbBatch(letter)))
  const mealRows = mealResults.flat()
  const krRows = await fetchKoreanRecipes()

  const globalMapped = mealRows
    .map((meal, index) => mapMealDbToRecipe(meal, index + 1))
    .filter((item): item is Recipe => item !== null)

  const koreaMapped = krRows
    .map((item, index) => mapKoreaToRecipe(item, index + 1))
    .filter((item): item is Recipe => item !== null)

  const seen = new Set<string>()
  const merged = [...koreaMapped, ...globalMapped].filter((item) => {
    const key = normalizeText(item.title)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })

  const serialized = JSON.stringify(merged)
  const output = `import type { Recipe } from '../types'\n\nconst externalRecipesRaw = ${JSON.stringify(serialized)}\n\nexport const externalRecipes: Recipe[] = JSON.parse(externalRecipesRaw) as Recipe[]\n`
  const path = resolve(process.cwd(), 'src/data/externalRecipes.ts')
  await writeFile(path, output, 'utf-8')

  console.log(`Generated ${merged.length} recipes (${koreaMapped.length} KR, ${globalMapped.length} GLOBAL before dedupe)`)
}

await main()
