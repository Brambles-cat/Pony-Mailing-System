const _WHATWG_C0_CONTROL_OR_SPACE = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f '

const _URL_BYTES_TO_REMOVE = ['\t', '\r', '\n']

const scheme_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-."

const uses_params = ['', 'ftp', 'hdl', 'prospero', 'http', 'imap',
               'https', 'shttp', 'rtsp', 'rtsps', 'rtspu', 'sip',
               'sips', 'mms', 'sftp', 'tel']

class URL_Parser {
  static parse_url(url) {
    const regex = new RegExp("^[" + _WHATWG_C0_CONTROL_OR_SPACE + "]+|[" + _WHATWG_C0_CONTROL_OR_SPACE + "]+$", "g");
    url = url.replace(regex, '');
    
    for (const b of _URL_BYTES_TO_REMOVE) {
      url = url.replace(b, "")
    }

    let
      netloc, query, fragment, scheme, split, params,
      i = url.indexOf(":"),
      valid_scheme = true

    if (i > 0 && Utils.isAscii(url[0]) && Utils.isAlpha(url[0])) {
      for (const c of url.substring(0, i)) {
        if (!scheme_chars.includes(c)) {
          valid_scheme = false
          break
        }
      }

      if (valid_scheme) {
        scheme = url.substring(0, i).toLowerCase()
        url = url.substring(i+1)
      } 
    }

    split = this._splitnetloc(url, url.substring(0, 2) === "//" ? 2 : 0)

    netloc = split[0]
    url = split[1]

    if (url.includes("#")) {
      split = url.split('#', 1)
      url = split[0]
      fragment = split[1]
    }
    if (url.includes("?")) {
      split = url.split('?', 2)
      url = split[0]
      query = split[1]
    }

    if (uses_params.includes(scheme) && url.includes(';')) {
      split = _splitparams(url)
      url = split[0]
      params = split[1]
    }
    else params = ''

    return {
      scheme: scheme,
      netloc: netloc,
      path: url,
      params: params,
      query: query,
      fragment: fragment
    }
  }

  static _splitnetloc(url, start=0) {
    // position of end of domain part of url, default is end
    let delim = url.length
    
    // look for delimiters; the order is NOT important
    for (const c of '/?#') {
      let wdelim = url.indexOf(c, start)
      if (wdelim >= 0) {
        delim = Math.min(delim, wdelim)
      }
    }
    return [url.substring(start, delim), url.substring(delim)]
  }

  static _splitparams(url) {
    let i
    if (url.includes('/')) {
      i = url.indexOf(';', url.lastIndexOf('/'))
      
      if (i < 0) return [url, '']
    }
    else
      i = url.indexOf(';')

    return [url.substring(0, i), url.substring(i+1)]
  }

  static parse_qs(query_string) {
    const parsed_result = {}
    const pairs = this.parse_qsl(query_string)

    for (const [i, pair] of Object.entries(pairs)) {
      if (pair[0] in parsed_result)
        parsed_result[pair[0]].push(pair[1])
      else
        parsed_result[pair[0]] = [pair[1]]
    }

    return parsed_result
  }

  static _unquote(str) {/* TODO: Transplant this from urllib for python */}

  static parse_qsl(query_string) {
    if (!query_string) return []

    const r = []

    for (const name_value of query_string.split("&")) {
      let name, value

      if (name_value) {
        const split = Utils.partition(name_value, "=")
        name = split[0]
        value = split[2]

        if (value) {
          // name = this._unquote(name)
          // value = this._unquote(value)
          r.push([name, value])
        }
      }
    }

    return r
  }
}