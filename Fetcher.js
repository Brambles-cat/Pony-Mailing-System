class Fetcher {
  /**
   * Returns a ballot containing the metadata of videos the passed urls point to
   * The cache_url shoould point to a google spreadsheet where each video's
   * metadata will be cached for future retrieval
   */
  static fetchAll(urls, cache_url) {
    let ballot_data = [] //, vid_address, cache_key, parsed_video_data
    // const ballot = [], cache = new Cache(cache_url)

    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(urls)
    };

    ballot_data = JSON.parse(UrlFetchApp.fetch("https://brambles-c.com/fetch", options).getContentText())

    for (const index in ballot_data) {
      ballot_data[index].upload_date = new Date(ballot_data[index].upload_date)
      ballot_data[index].annotations = []
      ballot_data[index].url = urls[index]
    }

    /*for (const url of urls) {
      
      try { vid_address = Utils.get_video_address(url) }

      catch (e) {
        Checks.report_err(url, e)
        Checks.skipped_videos++
        continue
      }

      cache_key = `${vid_address.source}-${vid_address.id}`
      video_data = cache.get_data(cache_key)

      if (video_data) {
        if (Preferences.v_log_retrieval_method)
          Logger.log(`Retrieved video data from cache for: ${url}`)
      }
      else {
        if (Preferences.v_log_retrieval_method)
          Logger.log(`Requesting video data from: ${url}`)

        try {
          video_data = Fetch_Services.apis[vid_address.source](vid_address.id)
          cache.add(cache_key, video_data)
        }
        catch (e) {
          Checks.report_err(url, e)
          Checks.skipped_videos++
          continue
        }
      }

      try { parsed_video_data = this.parse(video_data) }

      catch (e) {
        Checks.report_err(url, e)
        Checks.skipped_videos++
        continue
      }

      // url also needed for the checking step
      parsed_video_data.url = url

      ballot.push(parsed_video_data)
    }*/

    return ballot_data
  }

  /**
   * Returns video data with some of its fields parsed
   * As of now the only field that needs parsing is upload_date
   */
  static parse(video_data) {
    return {
      title: video_data.title,
      uploader: video_data.uploader,
      upload_date: new Date(video_data.upload_date),
      duration: video_data.duration,
      annotations: []
    }
  }
}