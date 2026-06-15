function formatDate(timestamp) {
  const date = new Date(timestamp)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDifficultyColor(difficulty) {
  const map = {
    '简单': 'tag-green',
    '中等': 'tag-orange',
    '困难': 'tag-orange'
  }
  return map[difficulty] || 'tag-orange'
}

module.exports = {
  formatDate,
  getDifficultyColor
}
