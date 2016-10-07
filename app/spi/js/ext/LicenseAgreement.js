var LicenseAgreement = {

  // Full path name of license acceptance file generated after user accepted the agreement
  ACCEPTANCE_FILE_NAME: null,
  // Hold content of license properties file to reduce I/O operations
  propertiesText: {},

  // Div id for each license viewpart
  localeContainer: "licenseLocaleContainer",
  contentTextArea: "licenseContentTextArea",

  //keydownEvent: document.onkeydown,


  /**
   * @return:boolean
   *         true  - license agreement accepted already
   *         false - otherwise
   */
  isAccepted: function() {
    var accepted = false;
    if (top.fileExists(this.getAcceptanceFileName())) {
      accepted = true;
    }
    return accepted;
  },

  /**
   * Get full path name for license file according to running environment
   * Full path follows the rule:
   *    Linux      - "/root/.BoMCLicenseAgree.dat"
   *    Windows - "%SYSTEMROOT%/.BoMCLicenseAgree.dat"
   */
  getAcceptanceFileName: function() {
    if (!fileExists(top.gl_support_folder)) {
      createDirectory(top.gl_support_folder);
    }

    if (this.ACCEPTANCE_FILE_NAME == null) {
      var fileName = top.gl_support_folder + "LicenseAgree" + app_version + ".dat";
      this.setAcceptanceFileName(fileName);
    }
    return this.ACCEPTANCE_FILE_NAME;
  },

  setAcceptanceFileName: function(file) {
    this.ACCEPTANCE_FILE_NAME = file;
  },

  /**
   * Record the date of acceptance to ACCEPTANCE_FILE_NAME
   */
  updateAcceptanceFile: function() {
    top.writeTextFile(this.ACCEPTANCE_FILE_NAME, "Accept:" + new Date());
  },

  /**
   * Show the entire license agreement with mask enabled
   */
  presentAgreement: function() {
    this.disableKeyEvent();
    this.createLocaleList();
    // Init with LOCALE in current running environment
    this.updateByLocale(top.LOCALE);
    this.showPanel();
  },

  disableKeyEvent: function() {

  },

  restoreKeyEvent: function() {

  },


  /**
   * Show license agreement panel
   */
  showPanel: function() {
    $('#licenseModal').modal('show');
  },

  /**
   * Hide license agreement panel and unmask
   */
  hidePanel: function() {
    $('#licenseModal').modal('hide');
  },

  /**
   * Event handler for locale changing
   */
  handleLocaleChanged: function() {
    var locales = document.getElementById(this.localeContainer);
    var localeSelected = locales.options[locales.selectedIndex].value;
    this.updateByLocale(localeSelected);
  },

  /**
   * Accept license agreement
   * Hide license agreement panel and step forward
   */
  accept: function() {
    this.updateAcceptanceFile();
    this.hidePanel();
  },


  /**
   * Do NOT accept the license agreement presented
   * Quit application immediately
   */
  reject: function() {
    top.Exit();
  },

  /**
   * Update all contents of license agreement with locale specified
   */
  updateByLocale: function(locale) {
    this.updateContent(locale);
  },

  /**
   * Create a combox with options of all valid locales
   */
  createLocaleList: function() {
    var localeContainer = document.getElementById(this.localeContainer);
    var localeList = top.validLicenseLocales;
    for (var localeIndex in localeList) {
      for (var key in localeList[localeIndex]) {
        if (localeList[localeIndex].hasOwnProperty(key)) {
          var perLocale = new Option();
          perLocale.value = key;
          perLocale.text = localeList[localeIndex][key];
          perLocale.innerHTML = perLocale.text;
          if (top.LOCALE == perLocale.value) {
            perLocale.selected = true;
          }
          localeContainer.appendChild(perLocale);

        }
      }
    }
  },

  /*
   * Update license content according to locale
   * @param
   *         locale:string - top.LOCALE as default
   */
  updateContent: function(locale) {
    if (locale == null) {
      locale = top.LOCALE;
    }
    var contentTextArea = document.getElementById(this.contentTextArea);
    contentTextArea.value = this.getLicenseContent(locale);
  },


  /**
   * Get text content of agreement with locale specified
   * Assume text file saved in terms of unicode
   */
  getLicenseContent: function(locale) {
    if (locale == null) {
      locale = top.LOCALE;
    }
    var contentFile = locale;
    var content = "";
    try {
      content = top.readTextFile(top.findFileInPaths(null, ["licenses"], contentFile));
    } catch (e) {
      content = "License File NOT Found";
    }
    return content;
  },

  /**
   * Present license agreement panel if NOT accepted before
   * Otherwise, step forward
   */
  checkLicense: function() {
    if (this.isAccepted() == false) {
      if (!top.getEnv("UNATTENDED_MODE"))
        this.presentAgreement();
    }
  }

};