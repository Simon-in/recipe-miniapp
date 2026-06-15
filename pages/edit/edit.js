const { getRecipeById, saveRecipe, CATEGORIES, generateId } = require('../../utils/storage')
const { chooseCoverImage, deleteLocalImage, previewImage } = require('../../utils/image')

const DIFFICULTIES = ['简单', '中等', '困难']

const EMPTY_FORM = {
  name: '',
  category: '家常菜',
  cookTime: '',
  servings: '',
  difficulty: '简单',
  ingredients: [{ name: '', amount: '' }],
  steps: [''],
  note: ''
}

Page({
  data: {
    isEdit: false,
    id: '',
    form: { ...EMPTY_FORM },
    coverImage: '',
    oldCoverImage: '',
    categories: CATEGORIES,
    difficulties: DIFFICULTIES,
    categoryIndex: 0,
    difficultyIndex: 0
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      const recipe = getRecipeById(id)
      if (!recipe) {
        wx.showToast({ title: '食谱不存在', icon: 'none' })
        setTimeout(() => wx.navigateBack(), 1500)
        return
      }
      const categoryIndex = CATEGORIES.indexOf(recipe.category)
      const difficultyIndex = DIFFICULTIES.indexOf(recipe.difficulty)
      this.setData({
        isEdit: true,
        id,
        form: {
          name: recipe.name,
          category: recipe.category,
          cookTime: String(recipe.cookTime),
          servings: String(recipe.servings),
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients.length ? recipe.ingredients : [{ name: '', amount: '' }],
          steps: recipe.steps.length ? recipe.steps : [''],
          note: recipe.note || ''
        },
        coverImage: recipe.coverImage || '',
        oldCoverImage: recipe.coverImage || '',
        categoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
        difficultyIndex: difficultyIndex >= 0 ? difficultyIndex : 0
      })
      wx.setNavigationBarTitle({ title: '编辑食谱' })
    } else {
      wx.setNavigationBarTitle({ title: '添加食谱' })
    }
  },

  onFieldInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onCategoryChange(e) {
    const index = Number(e.detail.value)
    this.setData({
      categoryIndex: index,
      'form.category': CATEGORIES[index]
    })
  },

  onDifficultyChange(e) {
    const index = Number(e.detail.value)
    this.setData({
      difficultyIndex: index,
      'form.difficulty': DIFFICULTIES[index]
    })
  },

  onIngredientInput(e) {
    const { index, field } = e.currentTarget.dataset
    this.setData({ [`form.ingredients[${index}].${field}`]: e.detail.value })
  },

  onAddIngredient() {
    const ingredients = [...this.data.form.ingredients, { name: '', amount: '' }]
    this.setData({ 'form.ingredients': ingredients })
  },

  onRemoveIngredient(e) {
    const { index } = e.currentTarget.dataset
    const ingredients = this.data.form.ingredients.filter((_, i) => i !== index)
    this.setData({
      'form.ingredients': ingredients.length ? ingredients : [{ name: '', amount: '' }]
    })
  },

  onStepInput(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`form.steps[${index}]`]: e.detail.value })
  },

  onAddStep() {
    const steps = [...this.data.form.steps, '']
    this.setData({ 'form.steps': steps })
  },

  onRemoveStep(e) {
    const { index } = e.currentTarget.dataset
    const steps = this.data.form.steps.filter((_, i) => i !== index)
    this.setData({ 'form.steps': steps.length ? steps : [''] })
  },

  async onChooseImage() {
    try {
      const path = await chooseCoverImage()
      if (!path) return

      const { coverImage, oldCoverImage } = this.data
      if (coverImage && coverImage !== oldCoverImage) {
        await deleteLocalImage(coverImage)
      }
      this.setData({ coverImage: path })
    } catch {
      wx.showToast({ title: '图片选择失败', icon: 'none' })
    }
  },

  async onRemoveImage() {
    const { coverImage, oldCoverImage } = this.data
    if (coverImage && coverImage !== oldCoverImage) {
      await deleteLocalImage(coverImage)
    }
    this.setData({ coverImage: '' })
  },

  onPreviewImage() {
    previewImage(this.data.coverImage)
  },

  validate() {
    const { name, cookTime, servings, ingredients, steps } = this.data.form

    if (!name.trim()) {
      wx.showToast({ title: '请输入菜名', icon: 'none' })
      return false
    }
    if (!cookTime || Number(cookTime) <= 0) {
      wx.showToast({ title: '请输入有效的烹饪时间', icon: 'none' })
      return false
    }
    if (!servings || Number(servings) <= 0) {
      wx.showToast({ title: '请输入有效的人份数', icon: 'none' })
      return false
    }

    const validIngredients = ingredients.filter(i => i.name.trim())
    if (validIngredients.length === 0) {
      wx.showToast({ title: '请至少添加一种食材', icon: 'none' })
      return false
    }

    const validSteps = steps.filter(s => s.trim())
    if (validSteps.length === 0) {
      wx.showToast({ title: '请至少添加一个步骤', icon: 'none' })
      return false
    }

    return true
  },

  async onSubmit() {
    if (!this.validate()) return

    const { form, isEdit, id, coverImage, oldCoverImage } = this.data
    const recipe = {
      id: isEdit ? id : generateId(),
      name: form.name.trim(),
      category: form.category,
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      difficulty: form.difficulty,
      ingredients: form.ingredients.filter(i => i.name.trim()),
      steps: form.steps.filter(s => s.trim()),
      note: form.note.trim(),
      coverImage: coverImage || ''
    }

    if (oldCoverImage && oldCoverImage !== coverImage) {
      await deleteLocalImage(oldCoverImage)
    }

    saveRecipe(recipe)
    wx.showToast({ title: isEdit ? '已保存' : '已添加', icon: 'success' })
    setTimeout(() => {
      if (isEdit) {
        wx.navigateBack()
      } else {
        wx.redirectTo({ url: `/pages/detail/detail?id=${recipe.id}` })
      }
    }, 1000)
  }
})
