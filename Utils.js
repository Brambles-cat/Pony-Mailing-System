const youtube_domains = ["m.youtube.com", "www.youtube.com", "youtube.com", "youtu.be"]

class Utils {
  static isAscii(char) {
    const charCode = char.charCodeAt(0);
    return charCode >= 0 && charCode <= 127;
  }

  static isAlpha(char) {
    return char.search(/[A-Za-z]/) !== -1
  }

  static partition(str, separater) {
    const i = str.indexOf(separater)
    if (i === -1) return [str, "", ""]
    const key = str.substring(0, i)
    return [key, separater, str.substring(separater.length + key.length)]
  }

  static parseISO8601Duration(duration) {
      var matches = duration.match(/T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      
      var hours = parseInt(matches[1]) || 0;
      var minutes = parseInt(matches[2]) || 0;
      var seconds = parseInt(matches[3]) || 0;

      return seconds + minutes * 60 + hours * 3600;
  }

  static convert_iso8601_duration_to_seconds(iso8601str) {
    if (iso8601str.startsWith("PT"))
      iso8601str = iso8601str.substring(2)
    
    let split, total_seconds = 0, hours = 0, minutes = 0, seconds = 0

    if (iso8601str.includes("H")) {
      split = iso8601str.split("H")
      iso8601str = split[1]
      hours = parseInt(split[0])
    }

    if (iso8601str.includes("M")) {
      split = iso8601str.split("M")
      iso8601str = split[1]
      minutes = parseInt(split[0])
    }

    if (iso8601str.includes("S")) {
      iso8601str = iso8601str.replace("S", "")
      seconds = parseInt(iso8601str)
    }

    total_seconds = hours * 3600 + minutes * 60 + seconds

    return total_seconds
  }

  static get_source_and_id(url) {
    let video_id
    const url_components = URL_Parser.parse_url(url)
    const source = Utils.netloc_source(url_components.netloc)

    const query_params = URL_Parser.parse_qs(url_components.query)

    switch (source) {
      case "youtube":
        if (url_components.path === "/watch")
          video_id = query_params["v"][0]
        else {
          const livestream_match = url_components.path.match("^/live/([a-zA-Z0-9_-]+)")
          const shortened_match = url_components.path.match("^/([a-zA-Z0-9_-]+)")

          if (livestream_match) // eg. https://www.youtube.com/live/Q8k4UTf8jiI
            video_id = livestream_match[1]
          else if (shortened_match) // eg. https://youtu.be/9RT4lfvVFhA
            video_id = shortened_match[1]
        }
        break

      default:
        throw Error(`Invalid source: ${source}`)
    }

    if (!video_id)
      throw Error(`Could not extract video ID from "${url}"`)

    return [source, video_id]
  }

  static netloc_source(netloc) {
    if (youtube_domains.includes(netloc))
      return "youtube"

    const com_index = netloc.indexOf(".com")
    const www_index = netloc.indexOf("www.")

    if (com_index !== -1)
      netloc = netloc.substring(0, com_index)
    
    if (www_index !== -1)
      netloc = netloc.substring(4)

    return netloc
  }
}