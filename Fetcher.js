class Fetcher {
  /**
   * Returns a ballot containing the metadata of videos the passed urls point to
   * The cache_url shoould point to a google spreadsheet where each video's
   * metadata will be cached for future retrieval
   */
  static fetchAll(urls, cache_url) {
    let video_data, source_and_id, cache_key, parsed_video_data
    const ballot = [], cache = new Cache(cache_url)

    for (const url of urls) {
      try { source_and_id = Utils.get_source_and_id(url) }

      catch (e) {
        Checks.report_err(url, e)
        continue
      }

      cache_key = `${source_and_id[0]}-${source_and_id[1]}`
      video_data = cache.get_data(cache_key)

      if (video_data)
        if (Preferences.v_log_retrieval_method)
          Logger.log(`Retrieved video data from cache for: ${url}`)
      else {
        if (Preferences.v_log_retrieval_method)
          Logger.log(`Requesting video data from: ${url}`)

        try {
          video_data = this.request(source_and_id, url)
          cache.add(cache_key, video_data)
        }
        catch (e) {
          Checks.report_err(url, e)
          continue
        }
      }

      try { parsed_video_data = this.parse(video_data) }

      catch (e) {
        Checks.report_err(url, e)
        continue
      }

      // url also needed for the checking step
      parsed_video_data.url = url

      ballot.push(parsed_video_data)
    }

    return ballot
  }

  /**
   * Returns video data with some of its fields parsed
   * As of now the only field that needs parsing is upload_date
   */
  static parse(video_data) {
    return {
      title: video_data.title,
      uploader: video_data.uploader,
      upload_date: video_data.upload_date,
      duration: video_data.duration
    }
  }

  /**
   * Uses a fetch method specific to the url source
   * to retrieve the video data using said url
   */
  static request(source_and_id, url) { 
    if (source_and_id[0] === "youtube")
      return this.fetch_yt(source_and_id[1])

    // return {}
  }

  /**
   * Essentially the youtube fetch service's request method
   */
  static fetch_yt(id) {
    let response = YouTube.Videos.list(
      "status,snippet,contentDetails", {"id":id} 
    )

    const response_item = response["items"][0]
    const snippet = response_item["snippet"]
    const iso8601_duration = response_item["contentDetails"]["duration"]

    return {
      title: snippet["title"],
      uploader: snippet["channelTitle"],
      upload_date: snippet["publishedAt"],
      duration: Utils.convert_iso8601_duration_to_seconds(iso8601_duration),
    }
  }
}