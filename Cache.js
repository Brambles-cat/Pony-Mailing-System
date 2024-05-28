const map = Object.freeze({
  IDS: 0,
  TITLE: 1,
  UPLOADER: 2,
  UPLOAD_DATE: 3,
  DURATION: 4
})

class Cache {
  constructor(cache_url) {
    this.spreadsheet = SpreadsheetApp.openByUrl(cache_url)
    const data_videos = this.spreadsheet.getDataRange().getValues()

    if (data_videos.length === 1) {
      const init = ["ID", "Title", "Uploader", "Upload Date", "Duration"]
      this.spreadsheet.appendRow(init)
      data_videos = [init]
    }

    // transpose the array to make searching easier
    this.data_columns = data_videos[0].map((col, i) => data_videos.map(row => row[i]));
  }

  get_data(key) {
    const index = this.data_columns[map.IDS].indexOf(key)

    if (index === -1) return null

    return {
      title: this.data_columns[1][index],
      uploader: this.data_columns[2][index],
      upload_date: this.data_columns[3][index],
      duration: this.data_columns[4][index]
    }
  }

  add(cache_key, video_data) {
    const values = Object.values(video_data)
    values.unshift(cache_key)

    this.data_columns.forEach((col, i) => this.data_columns[i].push(values[i]))
    this.spreadsheet.appendRow(values)
  }
}