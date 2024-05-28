class Fetcher {
  static fetchAll(urls, cache_url) {
    let video_data, source_and_id, cache_key, parsed_video_data
    const ballot = [], cache = new Cache(cache_url)

    for (const url of urls) {
      try {
        source_and_id = Utils.get_source_and_id(url)
      } catch (e) {
        ballot.push({"Invalid": e})
        Logger.log(e)
        continue
      }

      cache_key = `${source_and_id[0]}-${source_and_id[1]}`
      video_data = cache.get_data(cache_key)

      if (video_data) {
        Logger.log(`Retrieving data from cache for: ${url}`)
        ballot.push(video_data)
        continue
      }

      try {
        Logger.log(`Requesting video data from: ${url}`)
        video_data = this.request(source_and_id, url)
        parsed_video_data = this.parse(video_data)
      } catch (e) {
        ballot.push({"Invalid": e})
        Logger.log(e)
        continue
      }

      cache.add(cache_key, video_data)
      ballot.push(parsed_video_data)
    }

    return ballot
  }

  static parse(video_data) {
    return video_data
  }

  static request(source_and_id, url) { 
    if (source_and_id[0] === "youtube")
      return this.fetch_yt(source_and_id[1])

    // return {}
    throw Error(`Unimplemented fetcher for: ${source_and_id[0]}`)
  }

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