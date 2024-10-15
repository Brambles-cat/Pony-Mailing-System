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

  static get_video_address(url) {
    let video_id
    const url_components = URL_Parser.parse_url(url)
    const path = url_components.path
    let source = url_components.netloc

    if (source.indexOf(".") !== source.lastIndexOf("."))
      source = source.substring(source.indexOf(".") + 1)

    switch (source) {
      case "youtu.be":
      case "youtube.com":
        const query_params = URL_Parser.parse_qs(url_components.query)
        source = "youtube"

        if (path === "/watch")
          video_id = query_params["v"][0]
        else {
          const livestream_match = path.match("^/live/([a-zA-Z0-9_-]+)")
          const shortened_match = path.match("^/([a-zA-Z0-9_-]+)")

          if (livestream_match) // eg. https://www.youtube.com/live/Q8k4UTf8jiI
            video_id = livestream_match[1]
          else if (shortened_match) // eg. https://youtu.be/9RT4lfvVFhA
            video_id = shortened_match[1]
        }
        break
      
      case "dai.ly":
      case "dailymotion.com":
        source = "dailymotion"

        if (path.split("/")[1] === "video")
          video_id = path.split("/")[2]
        else
          video_id = path.split("/")[1]
        break
      
      case "bilibili.com":
        source = "bilibili"
        video_id = path.split("/")[2]
        break
      
      case "pony.tube":
        source = "ponytube"
        video_id = path.split("/")[2]
        break
      
      case "thishorsie.rocks":
        source = "thishorsierocks"
        video_id = path.split("/")[2]
        break
      
      case "vimeo.com":
        source = "vimeo"
        video_id = path.split("/")[1]
        break

      default:
        throw new UserError(`Invalid source: ${source}`)
    }

    if (!video_id)
      throw new UserError("No video ID found in url")

    return {
      "source": source,
      "id": video_id
    }
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

/**
 * This error class should be used whenever a problem with a user's
 * input occurs that we have accounted for, so that we can send in the
 * email response which url in their votes is problematic
 * Eg. Invalid video source, url without an id, url to an unavailable video
 * 
 * Should not be used for anything that the voter cannot resolve
 */
class UserError extends Error {
  constructor(message) {
    super(message)
    this.name = UserError.name
  }
}