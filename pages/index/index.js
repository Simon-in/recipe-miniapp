const { searchRecipes, CATEGORIES } = require('../../utils/storage')

Page({
  data: {
    recipes: [],
    keyword: '',
    category: '全部',
    categories: ['全部', ...CATEGORIES],
    total: 0
  },

  onShow() {
    this.loadRecipes()
  },

  loadRecipes() {
    const recipes = searchRecipes(this.data.keyword, this.data.category)
    this.setData({ recipes, total: recipes.length })
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
    this.loadRecipes()
  },

  onClearSearch() {
    this.setData({ keyword: '' })
    this.loadRecipes()
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset
    this.setData({ category })
    this.loadRecipes()
  },

  onRecipeTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },

  onAddTap() {
    wx.navigateTo({ url: '/pages/edit/edit' })
  }
})
