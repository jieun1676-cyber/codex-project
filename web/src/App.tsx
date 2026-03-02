import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { recipes } from './data/recipes'
import { localizeAllergen, localizeIngredient, localizeRecipeSummary, localizeRecipeTitle, localizeTag, uiText } from './i18n'
import type { AgeRange, Allergen, ConditionTag, TextureLevel } from './types'
import type { Language } from './i18n'

const ageOptions: AgeRange[] = ['12-17', '18-23', '24-30', '31-36']
const allergyOptions: Allergen[] = ['egg', 'milk', 'soy', 'peanut', 'wheat', 'fish', 'shellfish']
const textureOptions: TextureLevel[] = ['puree', 'soft-chopped', 'bite-sized']
const conditionOptions: ConditionTag[] = ['normal', 'constipation', 'cold', 'low-appetite', 'protein-boost']
const favoriteStorageKey = 'codex.favoriteRecipeIds'

function loadFavoriteIds(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(favoriteStorageKey)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

function App() {
  const pageSize = 10
  const [language, setLanguage] = useState<Language>('ko')
  const [activeList, setActiveList] = useState<'recommendation' | 'favorite'>('recommendation')
  const [ageRange, setAgeRange] = useState<AgeRange | 'all'>('18-23')
  const [allergies, setAllergies] = useState<Allergen[]>([])
  const [condition, setCondition] = useState<ConditionTag | 'all'>('normal')
  const [cookTime, setCookTime] = useState(15)
  const [cookTimeAll, setCookTimeAll] = useState(false)
  const [texture, setTexture] = useState<TextureLevel | 'all'>('soft-chopped')
  const [noFilterMode, setNoFilterMode] = useState(false)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds())

  const filteredByControls = useMemo(
    () => {
      if (noFilterMode) {
        return recipes
      }

      return recipes
        .filter((recipe) => (ageRange === 'all' ? true : recipe.ageRanges.includes(ageRange)))
        .filter((recipe) => (allergies.length === 0 ? true : !allergies.some((item) => recipe.allergens.includes(item))))
        .filter((recipe) => (condition === 'all' ? true : recipe.tags.includes(condition)))
        .filter((recipe) => (texture === 'all' ? true : recipe.texture === texture))
        .filter((recipe) => (cookTimeAll ? true : recipe.cookTime <= cookTime))
    },
    [ageRange, allergies, condition, cookTime, cookTimeAll, noFilterMode, texture],
  )

  const filteredRecommendations = useMemo(
    () =>
      filteredByControls.filter((recipe) => {
        const localizedTitle = localizeRecipeTitle(recipe, language).toLowerCase()
        const localizedSummary = localizeRecipeSummary(recipe, language).toLowerCase()
        const q = query.toLowerCase()
        return localizedTitle.includes(q) || localizedSummary.includes(q)
      }),
    [filteredByControls, language, query],
  )

  const favoriteRecipes = useMemo(() => recipes.filter((recipe) => favoriteIds.includes(recipe.id)), [favoriteIds])
  const totalPages = Math.max(1, Math.ceil(filteredRecommendations.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pagedRecommendations = useMemo(
    () => filteredRecommendations.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize),
    [filteredRecommendations, safeCurrentPage],
  )
  const t = uiText[language]

  function toggleAllergy(allergy: Allergen): void {
    setCurrentPage(1)
    setAllergies((current) =>
      current.includes(allergy) ? current.filter((item) => item !== allergy) : [...current, allergy],
    )
  }

  function toggleFavorite(recipeId: string): void {
    setFavoriteIds((current) =>
      current.includes(recipeId) ? current.filter((id) => id !== recipeId) : [...current, recipeId],
    )
  }

  useEffect(() => {
    window.localStorage.setItem(favoriteStorageKey, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  return (
    <div className="page-shell">
      <div className="top-actions">
        <button
          type="button"
          className={`lang-btn ${language === 'ko' ? 'lang-active' : ''}`}
          onClick={() => {
            setLanguage('ko')
            setCurrentPage(1)
          }}
        >
          한국어
        </button>
        <button
          type="button"
          className={`lang-btn ${language === 'en' ? 'lang-active' : ''}`}
          onClick={() => {
            setLanguage('en')
            setCurrentPage(1)
          }}
        >
          English
        </button>
      </div>
      <header className="hero">
        <p className="hero-kicker">{t.heroKicker}</p>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
      </header>

      <section className="panel">
        <h2>{t.filter}</h2>
        <div className="toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={noFilterMode}
              onChange={(event) => {
                setNoFilterMode(event.target.checked)
                setCurrentPage(1)
              }}
            />
            {t.noFilter}
          </label>
        </div>
        <div className="filter-grid">
          <label>
            {t.ageRange}
            <select
              value={ageRange}
              onChange={(event) => {
                setAgeRange(event.target.value as AgeRange | 'all')
                setCurrentPage(1)
              }}
            >
              <option value="all">{t.all}</option>
              {ageOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.condition}
            <select
              value={condition}
              onChange={(event) => {
                setCondition(event.target.value as ConditionTag | 'all')
                setCurrentPage(1)
              }}
            >
              <option value="all">{t.all}</option>
              {conditionOptions.map((value) => (
                <option key={value} value={value}>
                  {localizeTag(value, language)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.texture}
            <select
              value={texture}
              onChange={(event) => {
                setTexture(event.target.value as TextureLevel | 'all')
                setCurrentPage(1)
              }}
            >
              <option value="all">{t.all}</option>
              {textureOptions.map((value) => (
                <option key={value} value={value}>
                  {localizeTag(value, language)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.maxCookTime}: {cookTime} {t.minute}
            <input
              type="range"
              min={10}
              max={30}
              step={1}
              value={cookTime}
              disabled={cookTimeAll}
              onChange={(event) => {
                setCookTime(Number(event.target.value))
                setCurrentPage(1)
              }}
            />
            <label className="inline-toggle">
              <input
                type="checkbox"
                checked={cookTimeAll}
                onChange={(event) => {
                  setCookTimeAll(event.target.checked)
                  setCurrentPage(1)
                }}
              />
              {t.all}
            </label>
          </label>
        </div>

        <fieldset>
          <legend>{t.allergies}</legend>
          <div className="pill-row">
            <button
              key="allergy-all"
              type="button"
              className={`pill ${allergies.length === 0 ? 'pill-active' : ''}`}
              onClick={() => {
                setAllergies([])
                setCurrentPage(1)
              }}
            >
              {t.all}
            </button>
            {allergyOptions.map((allergy) => {
              const active = allergies.includes(allergy)
              return (
                <button
                  key={allergy}
                  type="button"
                  className={`pill ${active ? 'pill-active' : ''}`}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {localizeAllergen(allergy, language)}
                </button>
              )
            })}
          </div>
        </fieldset>
      </section>

      <section className="panel">
        <div className="section-head">
          <div className="list-switch">
            <button
              type="button"
              className={`switch-btn ${activeList === 'recommendation' ? 'switch-active' : ''}`}
              onClick={() => setActiveList('recommendation')}
            >
              {t.recommendationList}
            </button>
            <button
              type="button"
              className={`switch-btn ${activeList === 'favorite' ? 'switch-active' : ''}`}
              onClick={() => setActiveList('favorite')}
            >
              {t.favorite}
            </button>
          </div>
          <p className="count-chip">
            {activeList === 'recommendation'
              ? `${t.showing} ${filteredRecommendations.length} / ${recipes.length}`
              : `${t.showing} ${favoriteRecipes.length}`}
          </p>
          {activeList === 'recommendation' ? (
            <input
              className="search-input"
              type="search"
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setCurrentPage(1)
              }}
            />
          ) : null}
        </div>

        {activeList === 'recommendation' ? (
          filteredRecommendations.length === 0 ? (
            <div className="empty-state">{t.noResult}</div>
          ) : (
            <div className="cards">
              {pagedRecommendations.map((recipe) => {
                const isFavorite = favoriteIds.includes(recipe.id)
                const localizedTitle = localizeRecipeTitle(recipe, language)
                const localizedSummary = localizeRecipeSummary(recipe, language)
                return (
                  <article key={recipe.id} className="card">
                    <div>
                      {recipe.imageUrl ? <img className="recipe-thumb" src={recipe.imageUrl} alt={localizedTitle} loading="lazy" /> : null}
                      <h3>{localizedTitle}</h3>
                      <p>{localizedSummary}</p>
                      <p className="meta">
                        {localizeTag(recipe.texture, language)} / {recipe.cookTime} {t.minute}
                      </p>
                    </div>
                    <div className="card-actions">
                      <button
                        type="button"
                        onClick={() => setSelectedRecipeId((current) => (current === recipe.id ? null : recipe.id))}
                      >
                        {selectedRecipeId === recipe.id ? t.closeDetailBtn : t.detailBtn}
                      </button>
                      <button type="button" onClick={() => toggleFavorite(recipe.id)}>
                        {isFavorite ? t.unfavoriteBtn : t.favoriteBtn}
                      </button>
                    </div>

                    {selectedRecipeId === recipe.id ? (
                      <div className="inline-detail">
                        {recipe.imageUrl ? <img className="recipe-hero" src={recipe.imageUrl} alt={localizedTitle} loading="lazy" /> : null}
                        <p className="meta">
                          {t.ages}: {recipe.ageRanges.join(', ')}
                        </p>
                        <p className="meta">
                          {t.tags}: {recipe.tags.map((tag) => localizeTag(tag, language)).join(', ')}
                        </p>
                        <p className="meta">
                          {t.ingredients}: {recipe.ingredients.map((item) => localizeIngredient(item, language)).join(', ')}
                        </p>
                        <h4 className="subhead">{t.instructions}</h4>
                        <ol className="step-list">
                          {recipe.instructions.map((step, index) => (
                            <li key={`${recipe.id}-step-${index + 1}`}>
                              <p className="step-text">{step}</p>
                              {recipe.stepImages?.[index] ? (
                                <img
                                  className="step-thumb"
                                  src={recipe.stepImages[index]}
                                  alt={`${localizedTitle} step ${index + 1}`}
                                  loading="lazy"
                                />
                              ) : null}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )
        ) : (
          favoriteRecipes.length === 0 ? (
            <p className="empty-state">{t.noFavorite}</p>
          ) : (
            <ul className="favorite-list">
              {favoriteRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecipeId(recipe.id)
                      setActiveList('recommendation')
                    }}
                  >
                    {localizeRecipeTitle(recipe, language)}
                  </button>
                </li>
              ))}
            </ul>
          )
        )}

        {activeList === 'recommendation' && filteredRecommendations.length > pageSize ? (
          <div className="pagination-row">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1}>
              ← {t.prev}
            </button>
            <p className="pagination-text">
              {t.page} {safeCurrentPage} / {totalPages}
            </p>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              {t.next} →
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default App
