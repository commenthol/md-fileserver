/**
 * open all external links in other window/tab
 */
export const aTargetBlank = () => {
  document.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href')
    if (/^https?:\/\//.test(href)) {
      el.setAttribute('target', '_blank')
    }
  })
}
