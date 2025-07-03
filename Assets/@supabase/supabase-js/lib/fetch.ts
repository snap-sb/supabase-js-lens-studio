import { fetchPolyFill as fetch } from '@supabase/global-polyfill-custom/index'

type Fetch = typeof fetch

export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  // } else if (typeof fetch === 'undefined') {
  //   _fetch = nodeFetch as unknown as Fetch
  } else {
    _fetch = fetch
  }
  return (...args: Parameters<Fetch>) => _fetch(...args)
}

export const resolveHeadersConstructor = () => {
  // if (typeof Headers === 'undefined') {
  //   return NodeFetchHeaders
  // }

  return Headers
}

export const fetchWithAuth = (
  supabaseKey: string,
  getAccessToken: () => Promise<string | null>,
  customFetch?: Fetch
): Fetch => {
  const fetch = resolveFetch(customFetch)
  // const HeadersConstructor = resolveHeadersConstructor()

  return async (input, init) => {
    const accessToken = (await getAccessToken()) ?? supabaseKey
    let headers = JSON.parse(JSON.stringify(init?.headers)) // init?.headers
    //print(typeof(init.headers.to))

    if (!headers['apikey']) {
      headers['apikey'] = supabaseKey
    }

    if (!headers['Authorization']) {
      headers['Authorization'] =  `Bearer ${accessToken}`
    }
    return fetch(input, { ...init, headers })
  }
}
