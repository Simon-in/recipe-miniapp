const { deleteLocalImage } = require('./image')

const STORAGE_KEY = 'recipes'
const CATEGORIES = ['家常菜', '早餐', '汤羹', '甜品', '饮品', '其他']

const SAMPLE_RECIPES = [
  {
    id: 'sample-1',
    name: '番茄炒蛋',
    category: '家常菜',
    cookTime: 15,
    servings: 2,
    difficulty: '简单',
    ingredients: [
      { name: '鸡蛋', amount: '3个' },
      { name: '番茄', amount: '2个' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '少许' },
      { name: '糖', amount: '1小勺' }
    ],
    steps: [
      '鸡蛋打散，加少许盐搅匀；番茄切块。',
      '热锅凉油，倒入蛋液炒至凝固盛出。',
      '锅中留底油，下番茄翻炒出汁，加盐和糖调味。',
      '倒入炒好的鸡蛋，快速翻炒均匀，撒葱花出锅。'
    ],
    note: '番茄先炒出汁再下蛋，口感更融合。',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'sample-2',
    name: '皮蛋瘦肉粥',
    category: '早餐',
    cookTime: 40,
    servings: 3,
    difficulty: '中等',
    ingredients: [
      { name: '大米', amount: '100g' },
      { name: '瘦肉', amount: '80g' },
      { name: '皮蛋', amount: '2个' },
      { name: '姜丝', amount: '适量' },
      { name: '葱花', amount: '适量' }
    ],
    steps: [
      '大米洗净浸泡30分钟，瘦肉切丝用料酒腌制。',
      '锅中加水煮开，下大米小火熬煮30分钟。',
      '加入肉丝和切好的皮蛋丁，继续煮5分钟。',
      '加盐调味，撒姜丝和葱花即可。'
    ],
    note: '米提前浸泡可以让粥更绵软。',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000
  }
]

function generateId() {
  return `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function initStorage() {
  const existing = wx.getStorageSync(STORAGE_KEY)
  if (!existing || existing.length === 0) {
    wx.setStorageSync(STORAGE_KEY, SAMPLE_RECIPES)
    return SAMPLE_RECIPES
  }
  return existing
}

function getAllRecipes() {
  return initStorage()
}

function getRecipeById(id) {
  const recipes = getAllRecipes()
  return recipes.find(r => r.id === id) || null
}

function saveRecipe(recipe) {
  const recipes = getAllRecipes()
  const now = Date.now()
  const index = recipes.findIndex(r => r.id === recipe.id)

  if (index >= 0) {
    recipes[index] = { ...recipes[index], ...recipe, updatedAt: now }
  } else {
    recipes.unshift({
      ...recipe,
      id: recipe.id || generateId(),
      createdAt: now,
      updatedAt: now
    })
  }

  wx.setStorageSync(STORAGE_KEY, recipes)
  return recipes
}

function deleteRecipe(id) {
  const recipes = getAllRecipes()
  const recipe = recipes.find(r => r.id === id)
  if (recipe && recipe.coverImage) {
    deleteLocalImage(recipe.coverImage)
  }
  const filtered = recipes.filter(r => r.id !== id)
  wx.setStorageSync(STORAGE_KEY, filtered)
  return filtered
}

function searchRecipes(keyword, category) {
  let recipes = getAllRecipes()
  const kw = (keyword || '').trim().toLowerCase()

  if (category && category !== '全部') {
    recipes = recipes.filter(r => r.category === category)
  }

  if (kw) {
    recipes = recipes.filter(r => {
      const inName = r.name.toLowerCase().includes(kw)
      const inIngredients = (r.ingredients || []).some(
        i => i.name.toLowerCase().includes(kw)
      )
      return inName || inIngredients
    })
  }

  return recipes.sort((a, b) => b.updatedAt - a.updatedAt)
}

module.exports = {
  CATEGORIES,
  getAllRecipes,
  getRecipeById,
  saveRecipe,
  deleteRecipe,
  searchRecipes,
  generateId
}
