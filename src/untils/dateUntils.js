export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  + ' ' + ('0'+ date.getHours()).substr(-2) + ':' + ('0' + date.getMinutes()).substr(-2) + ':' + ('0'+date.getSeconds()).substr(-2)
  }
