class Checks {
  static run_checks(votes) {
    const invalid = votes.filter(vote => "No Data" in vote)
    return invalid
    /*
    * Duplicates
    * Blacklist
    * Duration
    * Upload Date
    * Fuzzy
    * Uploader Diversity
    * Uploader Occurrence
    */
  }

  static check_duplicate(ballot) {}

  static check_blacklist(video_data) {}

  static check_duration(video_data) {}

  static check_upload_date(video_data) {}

  static check_uploader_diversity(video_data) {}

  static check_uploader_occurence(video_data, ballot) {}
}