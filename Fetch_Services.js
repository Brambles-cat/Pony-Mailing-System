class Fetch_Services {
  // for when there isn't a suitable api that can be used easily or require authorization
  static passing(id) {
    const prev_month_date = new Date()
    const current_year = prev_month_date.getFullYear()

    prev_month_date.setUTCMonth(prev_month_date.getUTCMonth() - 1 % 12)
    prev_month_date.setUTCFullYear(prev_month_date.getUTCMonth() === 11 ? current_year - 1 : current_year)

    return this.normalize_fields(`pass - ${id}`, `pass - ${id}`, prev_month_date.toISOString(), 9999999)
  }

  static normalize_fields(title, uploader, upload_date, duration) {
    return {
      "title": title,
      "uploader": uploader,
      "upload_date": upload_date,
      "duration": duration
    }
  }
}

Fetch_Services.apis = {
  "youtube": id => {
    const response = YouTube.Videos.list(
      "status,snippet,contentDetails", {"id":id} 
    )
    const response_item = response["items"][0]
    const snippet = response_item["snippet"]
    const iso8601_duration = response_item["contentDetails"]["duration"]

    return Fetch_Services.normalize_fields(
      snippet["title"], snippet["channelTitle"], snippet["publishedAt"],
      Utils.convert_iso8601_duration_to_seconds(iso8601_duration)
    )
  },

  "dailymotion": id => {
    const response = JSON.parse(
      UrlFetchApp.fetch(`https://api.dailymotion.com/video/${id}?fields=duration,title,owner.username,uploaded_time`)
        .getContentText()
    )

    return Fetch_Services.normalize_fields(
      response.title, response["owner.username"], new Date(response.uploaded_time * 1000).toISOString(),response.duration
    )
  },

  "bilibili": id => Fetch_Services.passing(id),

  "ponytube": id => {
    const response = JSON.parse(UrlFetchApp.fetch(`https://pony.tube/api/v1/videos/${id}`).getContentText())
    return Fetch_Services.normalize_fields(response.name, response.account.name, response.publishedAt, response.duration)
  },

  "vimeo": id => Fetch_Services.passing(id),

  "thishorsierocks": id => {
    const response = JSON.parse(UrlFetchApp.fetch(`https://pt.thishorsie.rocks/api/v1/videos/${id}`).getContentText())
    return Fetch_Services.normalize_fields(response.name, response.account.name, response.publishedAt, response.duration)
  }
}