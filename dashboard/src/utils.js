export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return

  const keys = Object.keys(data[0])
  const csvContent = [
    keys.join(','), // Header row
    ...data.map(row => 
      keys.map(k => {
        let val = row[k] === null || row[k] === undefined ? '' : row[k]
        val = val.toString().replace(/"/g, '""') // Escape double quotes
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = `"${val}"`
        }
        return val
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
