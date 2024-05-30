class Checks {
  static run_checks(ballot) {
    // Duplicate check is outside of checks just so that
    // the ballot would be pruned of duplicates for the
    // remaining checks
    let temp = this.user_errs
    ballot = this.check_duplicate(ballot)

    const checks = [
      this.check_blacklist,
      this.check_duration,
      this.check_upload_date,
      this.check_uploader_diversity,
      this.check_uploader_occurence,
      // this.check_fuzzy
    ]

    checks.forEach(check => check(ballot))
    
    // compare ballot with no duplicates with user_errs for the 5 votes minimum check
    return this.user_errs
  }

  static throw_remaining_errs() {
    if (!this.other_errs.length)
      return
    
    Logger.log("\n\n\n")
    this.other_errs.forEach(err => Logger.log(`${err.name}\n${err.stack})`))
    throw new Error("oops")
  }

  /**
   * Initializes the first error instance for a given url
   * Use this if at most one error is expected to be 
   * caught per url before the checking phase
   */
  static report_err(url, e) {
    Logger.log(e.name)
    if (e.name === UserError.name)
      this.user_errs = [e.message]
    else
      this.other_errs.push(e)
  }

  static check_fail(url, message) {
    if (url in this.user_errs)
      this.user_errs[url].push(message)
    else
      this.user_errs[url] = [message]
  }

  static check_duplicate(ballot) {
    const occurences = [[ballot[0]]]
    let found_similar

    for (let i = 1; i < ballot.length; ++i) {
      found_similar = false
      
      for (var sim_array of occurences) {
        if (this.same_video(ballot[i], sim_array[0])) {
          sim_array.push(ballot[i])
          found_similar = true
          break
        }
      }

      if (!found_similar)
        occurences.push([ballot[i]])
    }

    occurences.forEach(sim_array => {
      if (sim_array.length > 1) {
        var url = sim_array.shift().url

        this.check_fail(url, `Potential duplicate${sim_array.length > 2 ? "s" : ""} found: ${
          sim_array.reduce((result, next) => `${result}\n\t${next.url}`, "")
        }`)
      }
    })

    return occurences.map(sim_array => sim_array[0])
  }

  // TODO: Make this better
  static same_video(video1, video2) {
    return (
      video1.title    === video2.title    &&
      video1.uploader === video2.uploader &&
      Math.abs(video1.duration - video2.duration) < 2
    )
  }

  static check_blacklist(ballot) {}

  static check_durations(ballot) {}

  static check_upload_dates(ballot) {}

  static check_uploader_diversity(ballot) {}

  static check_uploader_occurences(ballot) {}
}

Checks.user_errs = {}
Checks.other_errs = []