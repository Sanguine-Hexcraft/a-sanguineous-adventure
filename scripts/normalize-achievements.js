#!/usr/bin/env node
// Normalizes raw EQ achievement client files into structured JSON.
// Run: node scripts/normalize-achievements.js

import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const RAW_DIR = join(__dirname, '../data/AchievementAssociationsClient-raw')
const OUT_DIR = join(__dirname, '../public/data/achievements')

function parseRawFile(filename) {
  const filePath = join(RAW_DIR, filename)
  const content = readFileSync(filePath, 'utf8')
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split('^').map(f => f.trim()))
}

// --- Parse AchievementCategories ---
// parentId ^ sort ^ id ^ shortName ^ fullName ^ uiKey ^
const topLevelCategories = {}  // id -> { id, name, fullName, sort }
const subCategories = {}       // id -> { id, name, fullName, parentId, sort }

for (const row of parseRawFile('AchievementCategories.txt')) {
  if (row.length < 5) continue
  const [parentId, sort, id, shortName, fullName] = row
  const catId = parseInt(id)
  if (!catId) continue

  if (!parentId) {
    topLevelCategories[catId] = {
      id: catId,
      name: shortName,
      fullName,
      sort: parseInt(sort) || 0,
    }
  } else {
    const parentInt = parseInt(parentId)
    if (!parentInt) continue
    subCategories[catId] = {
      id: catId,
      name: shortName,
      fullName,
      parentId: parentInt,
      sort: parseInt(sort) || 0,
    }
  }
}

// --- Parse AchievementCategoryAssociations ---
// subcategoryId ^ sort ^ achievementId ^
const achievementToSubcategory = {}  // achievementId -> subcategoryId

for (const row of parseRawFile('AchievementCategoryAssociationsClient.txt')) {
  if (row.length < 3) continue
  const [subcatId, , achievementId] = row
  const achId = parseInt(achievementId)
  const scatId = parseInt(subcatId)
  if (!achId || !scatId) continue
  achievementToSubcategory[achId] = scatId
}

// --- Parse AchievementsClient ---
// id ^ title ^ description ^ iconId ^ points ^ isHidden ^ unknown ^
const achievements = {}

for (const row of parseRawFile('AchievementsClient.txt')) {
  if (row.length < 5) continue
  const [id, title, description, , points, isHidden] = row
  const achId = parseInt(id)
  if (!achId || !title) continue

  const subcatId = achievementToSubcategory[achId]
  const subcat = subcatId ? subCategories[subcatId] : null
  const topcat = subcat ? topLevelCategories[subcat.parentId] : null

  achievements[achId] = {
    id: achId,
    title,
    description: description || '',
    points: parseInt(points) || 0,
    isHidden: isHidden === '1',
    subcategoryId: subcatId || null,
    subcategoryName: subcat?.name || null,
    categoryId: topcat?.id || null,
    categoryName: topcat?.name || null,
    requirements: [],
  }
}

// --- Parse AchievementComponentsClient ---
// achievementId ^ sort ^ type ^ value ^ label ^
for (const row of parseRawFile('AchievementComponentsClient.txt')) {
  if (row.length < 5) continue
  const [achId, sortOrder, componentType, targetValue, label] = row
  const id = parseInt(achId)
  if (!id || !achievements[id]) continue

  achievements[id].requirements.push({
    order: parseInt(sortOrder) || 0,
    type: parseInt(componentType) || 0,
    value: parseInt(targetValue) || targetValue,
    label: label || '',
  })
}

for (const ach of Object.values(achievements)) {
  ach.requirements.sort((a, b) => a.order - b.order)
}

// --- Write output ---
mkdirSync(OUT_DIR, { recursive: true })

// categories.json
const categoriesOutput = {
  topLevel: Object.values(topLevelCategories).sort((a, b) => a.sort - b.sort),
  subCategories: Object.values(subCategories).sort(
    (a, b) => a.parentId - b.parentId || a.sort - b.sort
  ),
}
writeFileSync(
  join(OUT_DIR, 'categories.json'),
  JSON.stringify(categoriesOutput, null, 2)
)

// Group by top-level category
const byCategory = {}
let uncategorized = 0

for (const ach of Object.values(achievements)) {
  const catId = ach.categoryId ?? 'unknown'
  if (!byCategory[catId]) byCategory[catId] = []
  byCategory[catId].push(ach)
  if (!ach.categoryId) uncategorized++
}

// Per-category files (full detail)
for (const [catId, achs] of Object.entries(byCategory)) {
  const sorted = achs.sort((a, b) => {
    if (a.subcategoryId !== b.subcategoryId) return (a.subcategoryId || 0) - (b.subcategoryId || 0)
    return a.title.localeCompare(b.title)
  })
  writeFileSync(
    join(OUT_DIR, `category-${catId}.json`),
    JSON.stringify(sorted, null, 2)
  )
}

// Lightweight index (no requirements) for full-dataset browsing
const index = Object.values(achievements)
  .map(a => ({
    id: a.id,
    title: a.title,
    points: a.points,
    isHidden: a.isHidden,
    categoryId: a.categoryId,
    categoryName: a.categoryName,
    subcategoryId: a.subcategoryId,
    subcategoryName: a.subcategoryName,
  }))
  .sort((a, b) => (a.categoryId || 0) - (b.categoryId || 0) || a.title.localeCompare(b.title))

writeFileSync(
  join(OUT_DIR, 'index.json'),
  JSON.stringify(index, null, 2)
)

// Summary
const totalAchs = Object.keys(achievements).length
const totalCats = Object.keys(byCategory).length
console.log(`✓ ${totalAchs} achievements across ${totalCats} category groups`)
console.log(`  ${uncategorized} uncategorized`)
console.log(`  ${Object.keys(topLevelCategories).length} top-level categories`)
console.log(`  ${Object.keys(subCategories).length} subcategories`)
console.log(`Output: ${OUT_DIR}`)
