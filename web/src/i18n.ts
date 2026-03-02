import type { Recipe } from './types'

export type Language = 'en' | 'ko'

export const uiText: Record<Language, Record<string, string>> = {
  en: {
    heroKicker: 'Smart toddler meals',
    heroTitle: 'Condition-based Recipe Recommender',
    heroBody: 'Input age, allergy, texture, condition, and cook time to get tailored meal ideas for months 12-36.',
    filter: 'Filter',
    noFilter: 'No filter mode (show all recipes)',
    all: 'All',
    ageRange: 'Age range (months)',
    condition: 'Condition',
    texture: 'Texture',
    maxCookTime: 'Max cook time',
    allergies: 'Allergies',
    recommendationList: 'Recommendation List',
    page: 'Page',
    prev: 'Prev',
    next: 'Next',
    showing: 'Showing',
    searchPlaceholder: 'Search in results',
    noResult: 'No result found. Try relaxing allergy or cook time conditions.',
    detail: 'Detail',
    favorite: 'Favorite',
    noFavorite: 'No favorites yet.',
    selectDetail: 'Select a recipe from the list to inspect details.',
    ages: 'Ages',
    tags: 'Tags',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    minute: 'min',
    detailBtn: 'Detail',
    closeDetailBtn: 'Close',
    favoriteBtn: 'Favorite',
    unfavoriteBtn: 'Unfavorite',
  },
  ko: {
    heroKicker: '스마트 유아식',
    heroTitle: '조건 기반 레시피 추천기',
    heroBody: '월령, 알레르기, 식감, 컨디션, 조리시간을 입력하면 12-36개월 맞춤 식단을 추천합니다.',
    filter: '필터',
    noFilter: 'No filter 모드 (전체 레시피 보기)',
    all: '전체',
    ageRange: '월령 구간',
    condition: '컨디션',
    texture: '식감',
    maxCookTime: '최대 조리시간',
    allergies: '알레르기',
    recommendationList: '추천 리스트',
    page: '페이지',
    prev: '이전',
    next: '다음',
    showing: '표시',
    searchPlaceholder: '결과 내 검색',
    noResult: '결과가 없습니다. 알레르기나 조리시간 조건을 완화해 보세요.',
    detail: '상세',
    favorite: '즐겨찾기',
    noFavorite: '아직 즐겨찾기가 없습니다.',
    selectDetail: '리스트에서 레시피를 선택하면 상세가 표시됩니다.',
    ages: '대상 월령',
    tags: '태그',
    ingredients: '재료',
    instructions: '조리 순서',
    minute: '분',
    detailBtn: '상세',
    closeDetailBtn: '닫기',
    favoriteBtn: '즐겨찾기',
    unfavoriteBtn: '해제',
  },
}

const koreanToEnglishTitle: Record<string, string> = {
  '새우 두부 계란찜': 'Steamed Shrimp Tofu Egg Custard',
  '부추 콩가루 찜': 'Steamed Chive Soy Flour Side',
  '방울토마토 소박이': 'Stuffed Cherry Tomato Kimchi Style',
  '순두부 사과 소스 오이무침': 'Cucumber Salad with Silken Tofu Apple Sauce',
  '사과 새우 북엇국': 'Dried Pollack Soup with Apple and Shrimp',
}

const koreanToEnglishSummary: Record<string, string> = {
  '새우 두부 계란찜': 'Steamed custard style dish made with shrimp, tofu, and egg for a soft protein meal.',
  '부추 콩가루 찜': 'Steamed chive side dish coated with soy flour and served with a light seasoning sauce.',
  '방울토마토 소박이': 'Cherry tomatoes filled with mild kimchi seasoning for a fresh side dish.',
  '순두부 사과 소스 오이무침': 'Cucumber salad mixed with a silken tofu and apple sauce for a gentle flavor.',
  '사과 새우 북엇국': 'Light dried pollack soup with apple and shrimp for clean savory taste.',
}

const englishToKoreanTitle: Record<string, string> = {
  'Pumpkin Millet Porridge': '호박 기장 죽',
  'Tofu Spinach Soft Bowl': '두부 시금치 소프트 볼',
  'Chicken Sweet Potato Bites': '닭고기 고구마 한입볼',
  'Pear Oat Comfort Mash': '배 오트 컴포트 매시',
  'Cod Veggie Rice Pot': '대구 야채 라이스 포트',
  'Beef Broccoli Mini Stir': '소고기 브로콜리 미니 볶음',
  'Carrot Lentil Cream Soup': '당근 렌틸 크림 수프',
  'Egg Veggie Soft Fried Rice': '달걀 야채 소프트 볶음밥',
}

const englishToKoreanSummary: Record<string, string> = {
  'Pumpkin Millet Porridge': '초기 이유식 스푼 훈련에 맞춘 부드럽고 식이섬유가 풍부한 죽입니다.',
  'Tofu Spinach Soft Bowl': '철분이 풍부한 채소와 단백질을 빠르게 담아낸 부드러운 한 그릇입니다.',
  'Chicken Sweet Potato Bites': '씹기 연습을 돕는 한입 크기의 닭고기 고구마 레시피입니다.',
  'Pear Oat Comfort Mash': '입맛이 없을 때 부담 없이 먹기 좋은 따뜻하고 순한 매시입니다.',
  'Cod Veggie Rice Pot': '생선과 채소를 균형 있게 담은 원팟 스타일 레시피입니다.',
  'Beef Broccoli Mini Stir': '활동량이 많은 유아를 위한 부드러운 미니 볶음 레시피입니다.',
  'Carrot Lentil Cream Soup': '식이섬유 중심의 부드러운 크림 수프입니다.',
  'Egg Veggie Soft Fried Rice': '익숙한 재료로 만든 색감 좋은 부드러운 볶음밥입니다.',
}

const englishToKoreanIngredient: Record<string, string> = {
  pumpkin: '호박',
  millet: '기장',
  water: '물',
  'olive oil': '올리브오일',
  tofu: '두부',
  spinach: '시금치',
  rice: '쌀밥',
  'sesame oil': '참기름',
  chicken: '닭고기',
  'sweet potato': '고구마',
  onion: '양파',
  broth: '육수',
  pear: '배',
  oats: '오트',
  cinnamon: '계피',
  cod: '대구',
  carrot: '당근',
  zucchini: '주키니',
  beef: '소고기',
  broccoli: '브로콜리',
  garlic: '마늘',
  lentils: '렌틸콩',
  potato: '감자',
  egg: '달걀',
  'green peas': '완두콩',
}

function hasHangul(text: string): boolean {
  return /[가-힣]/.test(text)
}

export function localizeRecipeTitle(recipe: Recipe, language: Language): string {
  const title = recipe.title
  if (language === 'en') {
    if (hasHangul(title)) {
      return koreanToEnglishTitle[title] ?? title
    }
    return title
  }

  if (hasHangul(title)) {
    return title
  }
  return englishToKoreanTitle[title] ?? title
}

export function localizeRecipeSummary(recipe: Recipe, language: Language): string {
  const summary = recipe.summary
  if (language === 'en') {
    if (hasHangul(summary) || hasHangul(recipe.title)) {
      return koreanToEnglishSummary[recipe.title] ?? summary
    }
    return summary
  }

  if (hasHangul(summary)) {
    return summary
  }
  return englishToKoreanSummary[recipe.title] ?? summary
}

export function localizeIngredient(ingredient: string, language: Language): string {
  if (language === 'en') {
    return ingredient
  }

  if (hasHangul(ingredient)) {
    return ingredient
  }

  return englishToKoreanIngredient[ingredient.toLowerCase()] ?? ingredient
}

export function localizeAllergen(allergen: string, language: Language): string {
  if (language === 'en') {
    return allergen
  }

  const map: Record<string, string> = {
    egg: '달걀',
    milk: '우유',
    soy: '대두',
    peanut: '땅콩',
    wheat: '밀',
    fish: '생선',
    shellfish: '갑각류',
  }

  return map[allergen] ?? allergen
}

export function localizeTag(tag: string, language: Language): string {
  if (language === 'en') {
    return tag
  }

  const map: Record<string, string> = {
    normal: '일반',
    constipation: '변비',
    cold: '감기',
    'low-appetite': '입맛저하',
    'protein-boost': '단백질강화',
    puree: '퓌레',
    'soft-chopped': '잘게다진',
    'bite-sized': '한입크기',
  }

  return map[tag] ?? tag
}
