# CodeX Development Documentation Bundle
## 스마트 유아식 레시피북

---

# 01_product_brief.md

## 제품 한 줄 정의
12–36개월 유아 부모가 조건(월령, 알레르기, 상태, 조리시간 등)을 입력하면
적합한 레시피를 자동 추천해주는 웹 기반 서비스.

## 타겟 사용자
- 12–36개월 유아 부모
- 주 양육자
- 조부모 및 보육자

## 해결하려는 문제
- 월령별 식감 기준이 불명확함
- 알레르기/컨디션을 반영한 추천이 어려움
- 매일 메뉴 결정 피로도 높음

## 핵심 가치
- 조건 기반 자동 추천
- 안전 중심 설계
- 영양 균형 고려
- 반복 가능한 루틴 제공

## 성공 지표
- 추천 클릭률 ≥ 30%
- 7일 재방문율 ≥ 25%
- 즐겨찾기 저장률 ≥ 15%

---

# 02_prd.md

## 목표
조건 기반 유아식 추천 서비스 MVP 구축

## 주요 기능
1. 조건 입력
2. 추천 결과 리스트
3. 레시피 상세
4. 즐겨찾기
5. 검색

## 사용자 시나리오
- 14개월, 계란 알레르기 → 계란 제외 레시피 추천
- 22개월, 15분 조리 → 빠른 메뉴 추천
- 30개월, 단백질 강화 필요 → 고단백 레시피 추천

## 제외 범위 (v1)
- 커뮤니티 기능
- 결제/배송
- 외부 계정 연동

---

# 03_feature_spec.md

## 추천 기능

### 입력
- ageRange (string)
- allergies (array)
- condition (string)
- cookTime (number)
- texture (string)

### 출력
- recipeList (array)
- score (number)
- exclusionReason (optional)

### 동작
1. 하드 필터 적용
2. 점수 계산
3. 점수순 정렬
4. 상위 N개 반환

---

# 04_data_schema.md

## Recipe

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | string | Y | 고유 식별자 |
| title | string | Y | 레시피 이름 |
| ageRange | array | Y | 적용 월령 |
| ingredients | array | Y | 재료 목록 |
| cookTime | number | Y | 조리 시간 |
| texture | string | Y | 식감 |
| tags | array | N | 상태/영양 태그 |
| nutrition | object | N | 영양 정보 |

---

# 05_user_flow.md

Home → Filter → Recommendation List → Detail → Favorite → Back

---

# 06_ui_behavior.md

- ageRange 선택 필수
- 카드형 결과 표시
- 결과 없을 경우 안내 메시지 표시

---

# 07_edge_cases.md

- 결과 없음
- 알레르기 다중 선택
- 입력 충돌

---

# 08_acceptance_criteria.md

Given ageRange 선택
When 추천 버튼 클릭
Then 최소 1개 이상의 레시피 반환

---

# 09_nonfunctional_requirements.md

- 추천 응답 시간 ≤ 300ms
- Chrome/Safari 지원
- 기본 보안 보호 적용

---

# 10_release_plan.md

Milestone 1: 추천 기능
Milestone 2: 상세/즐겨찾기
Milestone 3: QA 및 배포
