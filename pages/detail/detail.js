const { getRecipeById, deleteRecipe } = require('../../utils/storage')
const { formatDate } = require('../../utils/util')
const { previewImage } = require('../../utils/image')

Page({
  data: {
    recipe: null,
    id: ''
  },

  onLoad(options) {
    const { id } = options
    if (!id) {
      wx.showToast({ title: '食谱不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.setData({ id })
    this.loadRecipe(id)
  },

  onShow() {
    if (this.data.id) {
      this.loadRecipe(this.data.id)
    }
  },

  loadRecipe(id) {
    const recipe = getRecipeById(id)
    if (!recipe) {
      wx.showToast({ title: '食谱不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.setData({
      recipe: {
        ...recipe,
        updatedAtText: formatDate(recipe.updatedAt)
      }
    })
    wx.setNavigationBarTitle({ title: recipe.name })
  },

  onPreviewImage() {
    previewImage(this.data.recipe.coverImage)
  },

  onEditTap() {
    wx.navigateTo({ url: `/pages/edit/edit?id=${this.data.id}` })
  },

  onDeleteTap() {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${this.data.recipe.name}」吗？`,
      confirmColor: '#E85D04',
      success: (res) => {
        if (res.confirm) {
          deleteRecipe(this.data.id)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1000)
        }
      }
    })
  }
})
