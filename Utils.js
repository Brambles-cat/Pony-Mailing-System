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

  /*
    def _parse_isoformat_date(dtstr):
    # It is assumed that this is an ASCII-only string of lengths 7, 8 or 10,
    # see the comment on Modules/_datetimemodule.c:_find_isoformat_datetime_separator
    assert len(dtstr) in (7, 8, 10)
    year = int(dtstr[0:4])
    has_sep = dtstr[4] == '-'

    pos = 4 + has_sep
    if dtstr[pos:pos + 1] == "W":
        # YYYY-?Www-?D?
        pos += 1
        weekno = int(dtstr[pos:pos + 2])
        pos += 2

        dayno = 1
        if len(dtstr) > pos:
            if (dtstr[pos:pos + 1] == '-') != has_sep:
                raise ValueError("Inconsistent use of dash separator")

            pos += has_sep

            dayno = int(dtstr[pos:pos + 1])

        return list(_isoweek_to_gregorian(year, weekno, dayno))
    else:
        month = int(dtstr[pos:pos + 2])
        pos += 2
        if (dtstr[pos:pos + 1] == "-") != has_sep:
            raise ValueError("Inconsistent use of dash separator")

        pos += has_sep
        day = int(dtstr[pos:pos + 2])

        return [year, month, day]
   */
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