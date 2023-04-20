import { HOST } from '../config'

export const setPath = (query, page) => {
  const data = {}
  if (query.org_id) {
    data.host = HOST + `/org_${query.org_id}`
  } else {
    data.host = HOST
  }
  if (Object.keys(query).includes('path')) {
    if (query.path.startsWith('/') || query.path.startsWith('%2F')) {
      data.path = decodeURIComponent(query.path)
    } else {
      data.path = decodeURIComponent(`/${query.path}`)
    }
  }
  page.setData(data)
}
