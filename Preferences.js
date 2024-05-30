class Preferences {
  set log_retrieval_method(bool) {
    if (typeof bool !== 'boolean')
      throw new TypeError("Expected boolean")

    Preferences.v_log_retrieval_method = bool
    return this
  }

  set check_duplicate(bool) {
    if (typeof bool !== 'boolean')
      throw new TypeError("Expected boolean")

    Preferences.v_check_duplicate = bool
    return this
  }

  set send_emails(bool) {
    if (typeof bool !== 'boolean')
      throw new TypeError("Expected boolean")

    Preferences.v_send_emails = bool
    return this
  }
}

// Unfortunately private variables aren't supported in apps script
// and the workaround is pretty annoying for me to do rn so maybe I'll
// make proper getters later
Preferences.v_log_retrieval_method = true
Preferences.v_check_duplicates = true
Preferences.v_send_emails = true

Preferences.instance = new Preferences()

/**
 * Work in progress
 */
function preferences() {
  return Preferences.instance
}