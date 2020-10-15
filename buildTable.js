/*<![CDATA[*/ var bones = false;
jQuery(document).ready(function () {
  var floatColValDict = {};
  var floatColValPMDict = {};
  var floatColInds = [];
  var floatSearchCols = [
    "redshift",
    "ebv",
    "photolink",
    "spectralink",
    "radiolink",
    "xraylink",
    "maxappmag",
    "maxabsmag",
    "color",
    "velocity",
    "escapevelocity",
    "galactocentricvelocity",
    "lumdist",
    "hostoffsetang",
    "hostoffsetdist",
    "altitude",
    "azimuth",
    "airmass",
    "skybrightness",
    "masses",
    "propermotionra",
    "propermotiondec",
    "boundprobability",
  ];
  var stringColValDict = {};
  var stringColValPMDict = {};
  var stringColInds = [];
  var stringSearchCols = [
    "name",
    "alias",
    "discoverer",
    "host",
    "instruments",
    "claimedtype",
    "spectraltype",
    "stellarclass",
  ];
  var raDecColValDict = {};
  var raDecColValPMDict = {};
  var raDecColInds = [];
  var raDecSearchCols = ["ra", "dec", "hostra", "hostdec"];
  var dateColValDict = {};
  var dateColValPMDict = {};
  var dateColInds = [];
  var dateSearchCols = ["discoverdate", "maxdate"];
  var allSearchCols = floatSearchCols.concat(
    stringSearchCols,
    raDecSearchCols,
    dateSearchCols
  );
  var quantityNames = ["ra", "dec", "lumdist"];
  function ebvValue(row, type, full, meta) {
    if (!row.ebv) {
      if (type === "sort") return NaN;
      return "";
    }
    return parseFloat(row.ebv[0]["value"]);
  }
  function ebvLinked(row, type, full, meta) {
    if (!row.ebv) return "";
    return row.ebv[0]["value"];
  }
  function photoLinked(row, type, full, meta) {
    if (!row.photolink) return "";
    if (row.photolink.indexOf(",") !== -1) {
      var photosplit = row.photolink.split(",");
      var retstr =
        "<div class='tooltip'><a class='lci' href='" +
        urlstem +
        nameToFilename(row.name) +
        "/' target='_blank'></a> " +
        photosplit[0] +
        "<span class='tooltiptext'> Detected epochs: " +
        photosplit[1];
      if (photosplit.length > 2) retstr += " – " + photosplit[2];
      retstr += "</span></div>";
      return retstr;
    }
    return (
      "<a class='lci' href='" +
      urlstem +
      nameToFilename(row.name) +
      "/' target='_blank'></a> " +
      row.photolink
    );
  }
  function photoSort(row, type, val) {
    if (!row.photolink) return NaN;
    return parseInt(row.photolink.split(",")[0]);
  }
  function photoValue(row, type, full, meta) {
    if (!row.photolink) return "";
    return parseInt(row.photolink.split(",")[0]);
  }
  function spectraLinked(row, type, full, meta) {
    if (!row.spectralink) return "";
    if (row.spectralink.indexOf(",") !== -1) {
      var spectrasplit = row.spectralink.split(",");
      var retstr =
        "<div class='tooltip'><a class='sci' href='" +
        urlstem +
        nameToFilename(row.name) +
        "/' target='_blank'></a> " +
        spectrasplit[0] +
        "<span class='tooltiptext'> Epochs: " +
        spectrasplit[1];
      if (spectrasplit.length > 2) retstr += " – " + spectrasplit[2];
      retstr += "</span></div>";
      return retstr;
    }
    return (
      "<a class='sci' href='" +
      urlstem +
      nameToFilename(row.name) +
      "/' target='_blank'></a> " +
      row.spectralink
    );
  }
  function spectraSort(row, type, val) {
    if (!row.spectralink) return NaN;
    return parseInt(row.spectralink.split(",")[0]);
  }
  function spectraValue(row, type, full, meta) {
    if (!row.spectralink) return "";
    return parseInt(row.spectralink.split(",")[0]);
  }
  function radioLinked(row, type, full, meta) {
    if (!row.radiolink) return "";
    return (
      "<a class='rci' href='" +
      urlstem +
      nameToFilename(row.name) +
      "/' target='_blank'></a> " +
      row.radiolink
    );
  }
  function xrayLinked(row, type, full, meta) {
    if (!row.xraylink) return "";
    return (
      "<a class='xci' href='" +
      urlstem +
      nameToFilename(row.name) +
      "/' target='_blank'></a> " +
      row.xraylink
    );
  }
  function hostoffsetangValue(row, type, full, meta) {
    if (!row.hostoffsetang) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.hostoffsetang[0]["value"]);
    return data;
  }
  function hostoffsetdistValue(row, type, full, meta) {
    if (!row.hostoffsetdist) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.hostoffsetdist[0]["value"]);
    return data;
  }
  function getSunMoonStr(alt, azi) {
    var moonsunstr = "";
    if (moonAlt != 0.0 && moonAzi != 0.0) {
      moondist = angDist(
        (Math.PI / 180.0) * azi,
        (Math.PI / 180.0) * alt,
        moonAzi,
        moonAlt
      );
      if (moondist < (5.0 * Math.PI) / 180.0)
        moonsunstr +=
          '&nbsp;<span title="Object is &lt;5&deg; from the Moon">' +
          moonPhaseIcon +
          "</span>";
    }
    if (sunAlt != 0.0 && sunAzi != 0.0) {
      sundist = angDist(
        (Math.PI / 180.0) * azi,
        (Math.PI / 180.0) * alt,
        sunAzi,
        sunAlt
      );
      if (sundist < (5.0 * Math.PI) / 180.0)
        moonsunstr +=
          '&nbsp;<span title="Object is &lt;5&deg; from the Sun">☀️</span>';
    }
    return moonsunstr;
  }
  function renderObsValue(data, type, row) {
    if (data === "") {
      if (type === "sort") return NaN;
      return "";
    }
    if (type === "display") {
      var moonsunstr = getSunMoonStr(row.altitude, row.azimuth);
      return String(data.toFixed(3)) + moonsunstr;
    }
    return data;
  }
  function setObsRaDec(row) {
    if ("obs_ra" in row && "obs_dec" in row) return;
    if (row.ra && row.dec) {
      row.obs_ra = raToDegrees(row.ra[0]["value"]);
      row.obs_dec = decToDegrees(row.dec[0]["value"]);
    } else if (row.hostra && row.hostdec) {
      row.obs_ra = raToDegrees(row.hostra[0]["value"]);
      row.obs_dec = decToDegrees(row.hostdec[0]["value"]);
    } else {
      row.obs_ra = "";
      row.obs_dec = "";
    }
  }
  function altitudeValue(row, type, set, meta) {
    if ("altitude" in row) return row.altitude;
    setObsRaDec(row);
    if (row.obs_ra === "" || row.obs_dec === "") {
      row.altitude = "";
      return row.altitude;
    }
    row.altitude = getAlt(row.obs_ra, row.obs_dec);
    return row.altitude;
  }
  function azimuthValue(row, type, set, meta) {
    if ("azimuth" in row) return row.azimuth;
    setObsRaDec(row);
    if (row.obs_ra === "" || row.obs_dec === "") {
      row.azimuth = "";
      return row.azimuth;
    }
    row.azimuth = getAzi(row.obs_ra, row.obs_dec);
    return row.azimuth;
  }
  function airmassValue(row, type, set, meta) {
    if ("airmass" in row) return row.airmass;
    setObsRaDec(row);
    if (row.obs_ra === "" || row.obs_dec === "") {
      row.airmass = "";
      return row.airmass;
    }
    var alt = altitudeValue(row, type, set, meta);
    var airmass =
      1.0 /
      Math.sin(
        (Math.PI / 180.0) * (alt + 244.0 / (165.0 + 47.0 * Math.pow(alt, 1.1)))
      );
    if (isNaN(airmass)) {
      row.airmass = "";
      return row.airmass;
    }
    row.airmass = airmass;
    return row.airmass;
  }
  function skyBrightnessValue(row, type, set, meta) {
    if ("skybrightness" in row) return row.skybrightness;
    setObsRaDec(row);
    if (row.obs_ra === "" || row.obs_dec === "") {
      row.skybrightness = "";
      return row.skybrightness;
    }
    var alt = altitudeValue(row, type, set, meta);
    var azi = azimuthValue(row, type, set, meta);
    if (alt <= 0.0) return type === "sort" ? NaN : "";
    var zen = (Math.PI / 180.0) * (90.0 - alt);
    var bzen = 79.0;
    var aX = Math.pow(1.0 - 0.96 * Math.pow(Math.sin(zen), 2), -0.5);
    var k = 0.172;
    var b = bzen * Math.pow(10.0, -0.4 * k * (aX - 1.0)) * aX;
    var bmoon = 0.0;
    if (moonAlt > 0.0) {
      var zenm = Math.PI / 2.0 - moonAlt;
      var aXm = Math.pow(
        1.0 - 0.96 * Math.pow(Math.sin(Math.min(zenm, Math.PI / 2.0)), 2),
        -0.5
      );
      var rhom = angDist(
        (Math.PI / 180.0) * azi,
        (Math.PI / 180.0) * alt,
        moonAzi,
        moonAlt
      );
      var istarm = Math.pow(
        10.0,
        -0.4 *
          (3.84 +
            0.026 * moonPhaseAlpha +
            4.0e-9 * Math.pow(moonPhaseAlpha, 4.0))
      );
      var frhom =
        Math.pow(10.0, 5.36) * (1.06 + Math.pow(Math.cos(rhom), 2)) +
        Math.pow(10.0, 6.15 - ((180.0 / Math.PI) * rhom) / 40.0);
      bmoon =
        frhom *
        istarm *
        Math.pow(10.0, -0.4 * k * aXm) *
        (1.0 - Math.pow(10.0, -0.4 * k * aX));
    }
    var bsun = 0.0;
    if (sunAlt > 0.0) {
      var zens = Math.PI / 2.0 - sunAlt;
      var aXs = Math.pow(
        1.0 - 0.96 * Math.pow(Math.sin(Math.min(zens, Math.PI / 2.0)), 2),
        -0.5
      );
      var rhos = angDist(
        (Math.PI / 180.0) * azi,
        (Math.PI / 180.0) * alt,
        sunAzi,
        sunAlt
      );
      var istars = Math.pow(10.0, -0.4 * (3.84 + 12.6 - 26.7));
      var frhos =
        Math.pow(10.0, 5.36) * (1.06 + Math.pow(Math.cos(rhos), 2)) +
        Math.pow(10.0, 6.15 - ((180.0 / Math.PI) * rhos) / 40.0);
      bsun =
        frhos *
        istars *
        Math.pow(10.0, -0.4 * k * aXs) *
        (1.0 - Math.pow(10.0, -0.4 * k * aX));
    }
    var sb = 22.49989 - 1.08573 * Math.log(0.02934 * (b + bmoon + bsun));
    row.skybrightness = sb;
    return row.skybrightness;
  }
  function redshiftValue(row, type, full, meta) {
    if (!row.redshift) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.redshift[0]["value"]);
    return data;
  }
  function velocityValue(row, type, full, meta) {
    if (!row.velocity) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.velocity[0]["value"]);
    return data;
  }
  function escapevelocityValue(row, type, full, meta) {
    if (!row.escapevelocity) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.escapevelocity[0]["value"]);
    return data;
  }
  function galactocentricvelocityValue(row, type, full, meta) {
    if (!row.galactocentricvelocity) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.galactocentricvelocity[0]["value"]);
    return data;
  }
  function boundprobabilityValue(row, type, full, meta) {
    if (!row.boundprobability) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.boundprobability[0]["value"]);
    return data;
  }
  function lumdistValue(row, type, full, meta) {
    if (!row.lumdist) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = parseFloat(row.lumdist[0]["value"]);
    return data;
  }
  function redshiftLinked(row, type, full, meta) {
    if (!row.redshift) return "";
    var data = row.redshift[0]["value"];
    var maxdiff = 0.0;
    var rlen = row.redshift.length;
    for (i = 1; i < rlen; i++) {
      maxdiff = Math.max(
        Math.abs(parseFloat(data) - row.redshift[i]["value"]),
        maxdiff
      );
    }
    if (maxdiff / parseFloat(data) > 0.05) {
      data = "<em>" + data + "</em>";
    }
    if (row.redshift[0]["kind"]) {
      var kind = row.redshift[0]["kind"];
      return (
        "<div class='tooltip'>" +
        data +
        "<span class='tooltiptext'> " +
        kind +
        "</span></div>"
      );
    }
    return data;
  }
  function velocityLinked(row, type, full, meta) {
    if (!row.velocity) return "";
    var data = Number(parseFloat(row.velocity[0]["value"]).toPrecision(4));
    if (row.velocity[0]["kind"]) {
      var kind = row.velocity[0]["kind"];
      return (
        "<div class='tooltip'>" +
        data +
        "<span class='tooltiptext'> " +
        kind +
        "</span></div>"
      );
    }
    return data;
  }
  function escapevelocityLinked(row, type, full, meta) {
    if (!row.escapevelocity) return "";
    var data = Number(
      parseFloat(row.escapevelocity[0]["value"]).toPrecision(4)
    );
    return data;
  }
  function galactocentricvelocityLinked(row, type, full, meta) {
    if (!row.galactocentricvelocity) return "";
    var data = Number(
      parseFloat(row.galactocentricvelocity[0]["value"]).toPrecision(4)
    );
    return data;
  }
  function boundprobabilityLinked(row, type, full, meta) {
    if (!row.boundprobability) {
      if (type === "sort") return NaN;
      return "";
    }
    var value = parseFloat(row.boundprobability[0]["value"]);
    var data = (100.0 * value).toFixed(1) + "%</span>";
    var color = "";
    if (value >= 0.75) {
      color = '<span style="color:darkred; font-weight: bold">';
    } else if (value <= 0.25) {
      color = '<span style="color:darkgreen; font-weight: bold">';
    } else {
      color = '<span style="color:goldenrod; font-weight: bold">';
    }
    var ul = "upperlimit" in row.boundprobability[0] ? "<" : "";
    return color + ul + data;
  }
  function lumdistLinked(row, type, full, meta) {
    if (!row.lumdist) return "";
    var data = row.lumdist[0]["value"];
    if (row.lumdist[0]["kind"]) {
      var kind = row.lumdist[0]["kind"];
      return (
        "<div class='tooltip'>" +
        data +
        "<span class='tooltiptext'> " +
        kind +
        "</span></div>"
      );
    }
    return data;
  }
  function raValue(row, type, full, meta) {
    if (!row.ra) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = row.ra[0]["value"];
    return raToDegrees(data);
  }
  function decValue(row, type, full, meta) {
    if (!row.dec) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = row.dec[0]["value"];
    return decToDegrees(data);
  }
  function raLinked(row, type, full, meta) {
    if (!row.ra) return "";
    var data = row.ra[0]["value"];
    var degrees = raToDegrees(data).toFixed(5);
    return (
      "<div class='tooltip'>" +
      data +
      "<span class='tooltiptext'> " +
      degrees +
      "&deg;</span></div>"
    );
  }
  function decLinked(row, type, full, meta) {
    if (!row.dec) return "";
    var data = row.dec[0]["value"];
    var degrees = decToDegrees(data).toFixed(5);
    return (
      "<div class='tooltip'>" +
      data +
      "<span class='tooltiptext'> " +
      degrees +
      "&deg;</span></div>"
    );
  }
  function hostraValue(row, type, full, meta) {
    if (!row.hostra) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = row.hostra[0]["value"];
    return raToDegrees(data);
  }
  function hostdecValue(row, type, full, meta) {
    if (!row.hostdec) {
      if (type === "sort") return NaN;
      return "";
    }
    var data = row.hostdec[0]["value"];
    return decToDegrees(data);
  }
  function hostraLinked(row, type, full, meta) {
    if (!row.hostra) return "";
    var data = row.hostra[0]["value"];
    var degrees = raToDegrees(data).toFixed(5);
    return (
      "<div class='tooltip'>" +
      data +
      "<span class='tooltiptext'> " +
      degrees +
      "&deg;</span></div>"
    );
  }
  function hostdecLinked(row, type, full, meta) {
    if (!row.hostdec) return "";
    var data = row.hostdec[0]["value"];
    var degrees = decToDegrees(data).toFixed(5);
    return (
      "<div class='tooltip'>" +
      data +
      "<span class='tooltiptext'> " +
      degrees +
      "&deg;</span></div>"
    );
  }
  Date.prototype.getJulian = function () {
    return Math.round(
      this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.5,
      0.1
    );
  };
  function maxDateValue(row, type, full, meta) {
    if (!row.maxdate) {
      if (type === "sort") return NaN;
      return "";
    }
    var mydate = new Date(row.maxdate[0]["value"]);
    return mydate.getTime();
  }
  function discoverDateValue(row, type, full, meta) {
    if (!row.discoverdate) {
      if (type === "sort") return NaN;
      return "";
    }
    var mydate = new Date(row.discoverdate[0]["value"]);
    return mydate.getTime();
  }
  function colorValue(row, type, full, meta) {
    if (!row.color || !row.color.length) {
      if (type === "sort") return NaN;
      return "";
    }
    return parseFloat(row.color[0]["value"]);
  }
  function maxDateLinked(row, type, full, meta) {
    if (!row.maxdate) return "";
    var mjd = String(dateToMJD(row.maxdate[0]["value"]));
    return (
      "<div class='tooltip'>" +
      row.maxdate[0]["value"] +
      "<span class='tooltiptext'> MJD: " +
      mjd +
      "</span></div>"
    );
  }
  function discoverDateLinked(row, type, full, meta) {
    if (!row.discoverdate) return "";
    var mjd = String(dateToMJD(row.discoverdate[0]["value"]));
    return (
      "<div class='tooltip'>" +
      row.discoverdate[0]["value"] +
      "<span class='tooltiptext'> MJD: " +
      mjd +
      "</span></div>"
    );
  }
  function dataLinked(row, type, full, meta) {
    var fileeventname = nameToFilename(row.name);
    var datalink =
      "<a class='dci' title='Download Data' href='" +
      urlstem +
      fileeventname +
      ".json' download></a>";
    if (!row.download || row.download != "e") {
      return (
        datalink +
        "<a class='eci' title='Edit Data' onclick='eSN(\"" +
        row.name +
        '","' +
        fileeventname +
        '","' +
        ghpr +
        "\")'></a>"
      );
    } else {
      return (
        datalink +
        "<a class='eci' title='Edit Data' href='https://github.com/Astrocats-Cataclysmic-Variable-Catalog/Cataclysmic-Varible-Astrocats" +
        ghpr +
        "-internal/edit/master/" +
        fileeventname +
        ".json' target='_blank'></a>"
      );
    }
  }
  function colorLinked(row, type, full, meta) {
    if (!row.color || !row.color.length) return "";
    var color = row.color[0]["value"];
    return (
      "<div class='tooltip'>" +
      row.color[0]["value"] +
      "<span class='tooltiptext'>" +
      row.color[0]["kind"].replace(/\s/g, "&nbsp;") +
      "</span></div>"
    );
  }
  function refLinked(row, type, full, meta) {
    if (!row.references) return "";
    var references = row.references.split(",");
    var refstr = "";
    var rlen = references.length;
    var rlen4 = Math.min(rlen, 4);
    for (var i = 0; i < rlen4; i++) {
      if (i != 0) refstr += "<br>";
      refstr +=
        "<a href='http://adsabs.harvard.edu/abs/" +
        references[i] +
        "' target='_blank'>" +
        references[i] +
        "</a>";
    }
    if (rlen >= 5) {
      var fileeventname = nameToFilename(row.name);
      refstr +=
        "<br><a href='" + urlstem + fileeventname + "/'>(See full list)</a>";
    }
    return refstr;
  }
  var $_GET = getQueryParams(document.location.search);
  String.prototype.asId = function () {
    var th = jQuery("#example thead th");
    for (var i = 0, l = th.length; i < l; i++) {
      if (jQuery(th[i]).attr("class") == this.toString()) return i;
    }
  };
  jQuery("#example tfoot th").each(function (index) {
    var title = jQuery(this).text();
    var classname = jQuery(this).attr("class").split(" ")[0];
    if (
      ["check", "alias", "download", "references", "responsive"].indexOf(
        classname
      ) >= 0
    ) {
      jQuery(this).html("");
    }
    if (
      ["check", "alias", "download", "references", "responsive"].indexOf(
        classname
      ) >= 0
    )
      return;
    var fslen = floatSearchCols.length;
    for (i = 0; i < fslen; i++) {
      if (jQuery(this).hasClass(floatSearchCols[i])) {
        floatColValDict[index] = floatSearchCols[i];
        floatColValPMDict[index] = floatSearchCols[i] + "-pm";
        floatColInds.push(index);
        break;
      }
    }
    var sslen = stringSearchCols.length;
    for (i = 0; i < sslen; i++) {
      if (jQuery(this).hasClass(stringSearchCols[i])) {
        stringColValDict[index] = stringSearchCols[i];
        stringColValPMDict[index] = stringSearchCols[i] + "-pm";
        stringColInds.push(index);
        break;
      }
    }
    var dslen = dateSearchCols.length;
    for (i = 0; i < dslen; i++) {
      if (jQuery(this).hasClass(dateSearchCols[i])) {
        dateColValDict[index] = dateSearchCols[i];
        dateColValPMDict[index] = dateSearchCols[i] + "-pm";
        dateColInds.push(index);
        break;
      }
    }
    var rdlen = raDecSearchCols.length;
    for (i = 0; i < rdlen; i++) {
      if (jQuery(this).hasClass(raDecSearchCols[i])) {
        raDecColValDict[index] = raDecSearchCols[i];
        raDecColValPMDict[index] = raDecSearchCols[i] + "-pm";
        raDecColInds.push(index);
        break;
      }
    }
    if (classname == "name") {
      gclassname = "event";
    } else gclassname = classname;
    var getval = gclassname in $_GET ? $_GET[gclassname] : "";
    var classnamepm = classname + "-pm";
    var getpmval = classnamepm in $_GET ? $_GET[classnamepm] : "";
    var inputstr =
      '<input class="colsearch" type="search" incremental="incremental" id="' +
      classname +
      '" placeholder="' +
      title +
      '" value="' +
      getval +
      '" />';
    if (["ra", "dec", "hostra", "hostdec"].indexOf(classname) >= 0) {
      inputstr +=
        '<br><input class="colsearch" type="search" incremental="incremental" id="' +
        classnamepm +
        '" placeholder="± degs" value="' +
        getpmval +
        '" />';
    } else if (["maxdate", "discoverdate"].indexOf(classname) >= 0) {
      inputstr +=
        '<br><input class="colsearch" type="search" incremental="incremental" id="' +
        classnamepm +
        '" placeholder="± days" value="' +
        getpmval +
        '" />';
    } else if (["maxabsmag", "maxappmag", "color"].indexOf(classname) >= 0) {
      inputstr +=
        '<br><input class="colsearch" type="search" incremental="incremental" id="' +
        classnamepm +
        '" placeholder="± mags" value="' +
        getpmval +
        '" />';
    } else if (
      [
        "redshift",
        "velocity",
        "escapevelocity",
        "galactocentricvelocity",
      ].indexOf(classname) >= 0
    ) {
      inputstr +=
        '<br><input class="colsearch" type="search" incremental="incremental" id="' +
        classnamepm +
        '" placeholder="±" value="' +
        getpmval +
        '" />';
    } else if (
      ["name", "host", "claimedtype", "spectraltype", "stellarclass"].indexOf(
        classname
      ) >= 0
    ) {
      inputstr +=
        '<br><input class="colsearch" type="search" incremental="incremental" id="' +
        classnamepm +
        '" placeholder="w/ prefix" value="' +
        getpmval +
        '" />';
    }
    jQuery(this).html(inputstr);
  });
  var ajaxURL =
    "https://depts.washington.edu/catvar/astrocats/cataclysmic/output/catalog.min.json";
  jQuery.fn.redraw = function () {
    jQuery(this).each(function () {
      this.style.display = "none";
      this.offsetHeight;
      this.style.display = "block";
    });
  };
  var column_arr = [
    { defaultContent: "", responsivePriority: 6 },
    {
      data: null,
      name: "name",
      type: "string",
      responsivePriority: 1,
      render: nameSwitcherName,
    },
    {
      data: { _: eventAliases, display: eventAliasesOnly },
      name: "aliases",
      type: "string",
    },
    {
      data: "discoverer[,].value",
      name: "discoverer",
      type: "string",
      defaultContent: "",
      responsivePriority: 2,
    },
    {
      data: {
        display: discoverDateLinked,
        filter: "discoverdate.0.value",
        sort: discoverDateValue,
        _: "discoverdate[,].value",
      },
      name: "discoverdate",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 2,
    },
    {
      data: {
        display: maxDateLinked,
        filter: "maxdate.0.value",
        sort: maxDateValue,
        _: "maxdate[,].value",
      },
      type: "non-empty-float",
      defaultContent: "",
    },
    {
      data: "maxappmag.0.value",
      name: "maxappmag",
      type: "non-empty-float",
      defaultContent: "",
      render: noBlanksNumRender,
    },
    {
      data: "maxabsmag.0.value",
      name: "maxabsmag",
      type: "non-empty-float",
      defaultContent: "",
      render: noBlanksNumRender,
    },
  ];
  if (jQuery(".color")[0]) {
    column_arr.push({
      data: {
        display: colorLinked,
        filter: "color.0.value",
        sort: colorValue,
        _: "color[,].value",
      },
      name: "color",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 2,
    });
  }
  if (jQuery(".masses")[0]) {
    column_arr.push({
      data: "masses",
      name: "masses",
      type: "non-empty-float",
      defaultContent: "",
      render: noBlanksNumRender,
    });
  }
  if (jQuery(".spectraltype")[0]) {
    column_arr.push({
      data: "spectraltype[, ].value",
      name: "spectraltype",
      type: "string",
      defaultContent: "",
    });
  }
  if (jQuery(".stellarclass")[0]) {
    column_arr.push({
      data: "stellarclass[, ].value",
      name: "stellarclass",
      type: "string",
      responsivePriority: 3,
    });
  }
  if (jQuery(".host")[0]) {
    column_arr.push({
      data: null,
      name: "host",
      type: "string",
      width: "14%",
      render: hostSwitcher,
    });
  }
  column_arr = column_arr.concat([
    {
      data: {
        display: raLinked,
        filter: "ra.0.value",
        sort: raValue,
        _: "ra[,].value",
      },
      name: "ra",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 10,
    },
    {
      data: {
        display: decLinked,
        filter: "dec.0.value",
        sort: decValue,
        _: "dec[,].value",
      },
      name: "dec",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 10,
    },
  ]);
  if (jQuery(".propermotionra")[0]) {
    column_arr.push({
      data: "propermotionra.0.value",
      name: "propermotionra",
      type: "non-empty-float",
      defaultContent: "",
      render: noBlanksNumRender,
      responsivePriority: 10,
    });
  }
  if (jQuery(".propermotiondec")[0]) {
    column_arr.push({
      data: "propermotiondec.0.value",
      name: "propermotiondec",
      type: "non-empty-float",
      defaultContent: "",
      render: noBlanksNumRender,
      responsivePriority: 10,
    });
  }
  if (jQuery(".host")[0]) {
    column_arr = column_arr.concat([
      {
        data: {
          display: hostraLinked,
          filter: "hostra.0.value",
          sort: hostraValue,
          _: "hostra[,].value",
        },
        name: "hostra",
        type: "non-empty-float",
        defaultContent: "",
        responsivePriority: 10,
      },
      {
        data: {
          display: hostdecLinked,
          filter: "hostdec.0.value",
          sort: hostdecValue,
          _: "hostdec[,].value",
        },
        name: "hostdec",
        type: "non-empty-float",
        defaultContent: "",
        responsivePriority: 10,
      },
      {
        data: {
          filter: hostoffsetangValue,
          sort: hostoffsetangValue,
          _: "hostoffsetang.0.value",
        },
        name: "hostoffsetang",
        type: "non-empty-float",
        defaultContent: "",
        responsivePriority: 10,
      },
      {
        data: {
          filter: hostoffsetdistValue,
          sort: hostoffsetdistValue,
          _: "hostoffsetdist.0.value",
        },
        name: "hostoffsetdist",
        type: "non-empty-float",
        defaultContent: "",
        responsivePriority: 10,
      },
    ]);
  }
  column_arr = column_arr.concat([
    {
      data: altitudeValue,
      name: "altitude",
      type: "non-empty-float",
      render: renderObsValue,
      defaultContent: "",
    },
    {
      data: azimuthValue,
      name: "azimuth",
      type: "non-empty-float",
      render: renderObsValue,
      defaultContent: "",
    },
    {
      data: airmassValue,
      name: "airmass",
      type: "non-empty-float",
      render: renderObsValue,
      defaultContent: "",
    },
    {
      data: skyBrightnessValue,
      name: "skybrightness",
      type: "non-empty-float",
      render: renderObsValue,
      defaultContent: "",
    },
    {
      data: "instruments",
      name: "instruments",
      type: "string",
      defaultContent: "",
    },
    {
      data: {
        display: redshiftLinked,
        filter: redshiftValue,
        sort: redshiftValue,
        _: "redshift[,].value",
      },
      name: "redshift",
      type: "non-empty-float",
      defaultContent: "",
    },
    {
      data: {
        display: velocityLinked,
        filter: velocityValue,
        sort: velocityValue,
        _: "velocity[,].value",
      },
      name: "velocity",
      type: "non-empty-float",
      defaultContent: "",
    },
  ]);
  if (jQuery(".escapevelocity")[0]) {
    column_arr.push({
      data: {
        display: escapevelocityLinked,
        filter: escapevelocityValue,
        sort: escapevelocityValue,
        _: "escapevelocity[,].value",
      },
      name: "escapevelocity",
      type: "non-empty-float",
      defaultContent: "",
    });
  }
  if (jQuery(".galactocentricvelocity")[0]) {
    column_arr.push({
      data: {
        display: galactocentricvelocityLinked,
        filter: galactocentricvelocityValue,
        sort: galactocentricvelocityValue,
        _: "galactocentricvelocity[,].value",
      },
      name: "galactocentricvelocity",
      type: "non-empty-float",
      defaultContent: "",
    });
  }
  if (jQuery(".boundprobability")[0]) {
    column_arr.push({
      data: {
        display: boundprobabilityLinked,
        filter: boundprobabilityValue,
        sort: boundprobabilityValue,
        _: "boundprobability[,].value",
      },
      name: "boundprobability",
      type: "non-empty-float",
      defaultContent: "",
    });
  }
  column_arr.push({
    data: {
      display: lumdistLinked,
      filter: lumdistValue,
      sort: lumdistValue,
      _: "lumdist[,].value",
    },
    name: "lumdist",
    type: "non-empty-float",
    defaultContent: "",
  });
  if (jQuery(".claimedtype")[0]) {
    column_arr.push({
      data: null,
      name: "claimedtype",
      type: "string",
      responsivePriority: 3,
      render: typeSwitcher,
    });
  }
  column_arr = column_arr.concat([
    {
      data: { display: ebvLinked, _: ebvValue },
      name: "ebv",
      type: "non-empty-float",
      defaultContent: "",
    },
    {
      data: { display: photoLinked, _: photoValue, sort: photoSort },
      name: "photolink",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 2,
      width: "6%",
    },
    {
      data: { display: spectraLinked, _: spectraValue, sort: spectraSort },
      name: "spectralink",
      type: "non-empty-float",
      defaultContent: "",
      responsivePriority: 2,
      width: "5%",
    },
    {
      data: { display: radioLinked, _: "radiolink" },
      name: "radiolink",
      type: "num",
      defaultContent: "",
      responsivePriority: 2,
      width: "4%",
    },
    {
      data: { display: xrayLinked, _: "xraylink" },
      name: "xraylink",
      type: "num",
      defaultContent: "",
      responsivePriority: 2,
    },
    {
      data: { display: refLinked, _: "references" },
      name: "references",
      type: "html",
      searchable: false,
    },
    {
      data: dataLinked,
      name: "data",
      responsivePriority: 4,
      searchable: false,
    },
    { defaultContent: "" },
  ]);
  var table = jQuery("#example").DataTable({
    ajax: { url: ajaxURL, dataSrc: "" },
    autoWidth: false,
    language: {
      loadingRecords:
        "<img style='vertical-align:-43%; padding-right:3px' src='" +
        urlbase +
        "wp-content/plugins/transient-table/loading.gif' title='Please wait!'><span id='loadingMessage'>Loading... (should take a few seconds)</span>",
    },
    columns: column_arr,
    dom: '<"addmodal">Bflprt<"coordfoot">ip',
    orderMulti: false,
    pagingType: "simple_numbers",
    pageLength: plen[1],
    searchDelay: 400,
    responsive: { details: { type: "column", target: -1 } },
    select: true,
    lengthMenu: [plen, plen],
    deferRender: true,
    autoWidth: false,
    buttons: [
      {
        action: function (e, dt, button, config) {
          table.rows({ filter: "applied" }).select();
        },
        text: "Select all",
      },
      "selectNone",
      /*{
        extend: "colvis",
        columns: ":not(:first-child):not(:last-child):not(:nth-last-child(2))",
        collectionLayout: "three-column",
        columnText: function (dt, idx, title) {
          var txt = dt.column(idx).header();
          return title;
        },
      },*/
      {
        extend: "csv",
        text: "Export selected: CSV",
        exportOptions: {
          modifier: { selected: true },
          columns:
            ":visible:not(:first-child):not(:last-child):not(:nth-last-child(2))",
          orthogonal: "export",
        },
      },
      {
        text: "Export selected: JSON",
        action: function (e, dt, button, config) {
          var data = dt.buttons.exportData({ modifier: { selected: true } });
          var new_data = [];
          for (var i = 0; i < data["body"].length; i++) {
            var item = {};
            for (var c = 0; c < data["header"].length; c++) {
              item[data["header"][c]] = data["body"][i][c];
            }
            new_data.push(item);
          }
          jQuery.fn.dataTable.fileSave(
            new Blob([JSON.stringify(new_data)]),
            "Export.json"
          );
        },
      },
      {
        action: function (e, dt, button, config) {
          var colsearches = document.getElementsByClassName("colsearch");
          var querystring = "";
          var sortclasses = jQuery(
            table.column(table.order()[0][0]).header()
          ).attr("class");
          console.log(sortclasses);
          var sortstring =
            "sort=" +
            sortclasses.split(" ")[0] +
            "&direction=" +
            sortclasses.split("sorting_").slice(-1);
          for (var i = 0; i < colsearches.length; i++) {
            var cs = colsearches[i];
            if (cs.value !== "") {
              qpref = querystring === "" ? "?" : "&";
              var csid = cs.id === "name" ? "event" : cs.id;
              querystring +=
                qpref +
                csid +
                "=" +
                encodeURIComponent(cs.value.replace(/"/g, "&quot;"));
            }
          }
          var visiblestring = "";
          for (var i = 0; i < colsearches.length; i++) {
            var cs = colsearches[i];
            vpref = visiblestring === "" ? "" : ",";
            if (!cs.id.endsWith("-pm")) {
              visiblestring += vpref + cs.id;
            }
          }
          visiblestring = "visible=" + encodeURIComponent(visiblestring);
          querystring =
            querystring === ""
              ? "?" + visiblestring
              : querystring + "&" + visiblestring;
          if (sortstring !== "") querystring += "&" + sortstring;
          querystring = "https://depts.washington.edu/catvar/" + querystring;
          window.prompt("Permanent link to this table query:", querystring);
        },
        text: "Permalink",
      },
      /*{
        text: '<span id="addicon">+</span> Add ' + sing,
        action: function (e, dt, node, conf) {
          document.getElementById("addmodalwindow").style.display = "block";
        },
      },*/
    ],
    columnDefs: [
      { targets: 0, orderable: false, className: "select-checkbox" },
      { targets: invi, visible: false },
      { targets: nwnm, className: "nowrap not-mobile" },
      { className: "control", orderable: false, width: "2%", targets: -1 },
      { targets: ["download"], orderable: false },
      { targets: revo, orderSequence: ["desc", "asc"] },
      { targets: nowr, className: "nowrap" },
      { targets: ["boundprobability"], className: "dt-right" },
    ],
    select: { style: "os", selector: "td:first-child" },
    order: [[srtb.asId(), srtd]],
  });
  var lochtml =
    "<pre>\nCode  Long.   cos      sin    Name\n000   0.0000 0.62411 +0.77873 Greenwich\n001   0.1542 0.62992 +0.77411 Crowborough\n002   0.62   0.622   +0.781   Rayleigh\n003   3.90   0.725   +0.687   Montpellier\n004   1.4625 0.72520 +0.68627 Toulouse\n005   2.231000.659891+0.748875Meudon\n006   2.124170.751042+0.658129Fabra Observatory, Barcelona\n007   2.336750.659470+0.749223Paris\n008   3.0355 0.80172 +0.59578 Algiers-Bouzareah\n009   7.4417 0.6838  +0.7272  Berne-Uecht\n010   6.9267 0.72368 +0.68811 Caussols\n011   8.7975 0.67920 +0.73161 Wetzikon\n012   4.358210.633333+0.771306Uccle\n013   4.483970.614813+0.786029Leiden\n014   5.395090.728859+0.682384Marseilles\n015   5.129290.615770+0.785285Utrecht\n016   5.9893 0.68006 +0.73076 Besancon\n017   6.849240.641946+0.764282Hoher List\n018   6.7612 0.62779 +0.77578 Dusseldorf-Bilk\n019   6.9575 0.68331 +0.72779 Neuchatel\n020   7.3004 0.72391 +0.68767 Nice\n021   8.3855 0.65701 +0.75138 Karlsruhe\n022   7.7748 0.70790 +0.70409 Pino Torinese\n023   8.2625 0.64299 +0.76335 Wiesbaden\n024   8.7216 0.65211 +0.75570 Heidelberg-Konigstuhl\n025   9.196500.660205+0.748637Stuttgart\n026   7.465110.684884+0.726402Berne-Zimmerwald\n027   9.1912 0.70254 +0.70929 Milan\n028   9.9363 0.64686 +0.76009 Wurzburg\n029  10.2406 0.59640 +0.80000 Hamburg-Bergedorf\n030  11.254460.723534+0.688012Arcetri Observatory, Florence\n031  11.189850.639061+0.766705Sonneberg\n032  11.582950.631624+0.772706Jena\n033  11.711240.630900+0.773333Karl Schwarzschild Observatory, Tautenburg\n034  12.452460.745176+0.664656Monte Mario Observatory, Rome\n035  12.575920.565008+0.822321Copenhagen\n036  12.650400.747247+0.662420Castel Gandolfo\n037  13.7333 0.73660 +0.67416 Collurania Observatory, Teramo\n038  13.7704 0.70033 +0.71144 Trieste\n039  13.1874 0.56485 +0.82243 Lund\n040  13.7298 0.63019 +0.77387 Lohrmann Institute, Dresden\n041  11.380830.679862+0.731012Innsbruck\n042  13.064280.611721+0.788439Potsdam\n043  11.5286 0.69770 +0.71422 Asiago Astrophysical Observatory, Padua\n044  14.2559 0.75738 +0.65082 Capodimonte Observatory, Naples\n045  16.3390 0.66739 +0.74227 Vienna (since 1879)\n046  14.2881 0.65922 +0.74965 Klet Observatory, Ceske Budejovice\n047  16.8782 0.61146 +0.78864 Poznan\n048  15.840800.641709+0.764432Hradec Kralove\n049  17.6067 0.5088  +0.8580  Uppsala-Kvistaberg\n050  18.0582 0.51118 +0.85660 Stockholm (before 1931)\n051  18.4766 0.83055 -0.55508 Cape\n052  18.3083 0.51224 +0.85597 Stockholm-Saltsjobaden\n053  18.9642 0.67688 +0.73373 Konkoly Observatory, Budapest (since 1934)\n054  11.6654 0.56595 +0.82169 Brorfelde\n055  19.9596 0.64321 +0.76316 Cracow\n056  20.2450 0.65501 +0.75346 Skalnate Pleso\n057  20.5133 0.71074 +0.70116 Belgrade\n058  20.4950 0.57897 +0.81262 Kaliningrad\n059  20.2201 0.65500 +0.75364 Lomnicky Stit\n060  21.4200 0.61572 +0.78535 Warsaw-Ostrowik\n061  22.298500.662142+0.746904Uzhgorod\n062  22.2293 0.49440 +0.86632 Turku\n063  22.4450 0.49496 +0.86601 Turku-Tuorla\n064  22.7500 0.49489 +0.86605 Turku-Kevola\n065  12.6318 0.67222 +0.73800 Traunstein\n066  23.718170.789321+0.611946Athens\n067  24.0297 0.64632 +0.76058 Lvov University Observatory\n068  24.0142 0.64627 +0.76062 Lvov Polytechnic Institute\n069  24.4042 0.54925 +0.83287 Baldone\n070  25.2865 0.57940 +0.81233 Vilnius (before 1939)\n071  24.737820.74803 +0.66185 NAO Rozhen, Smolyan\n072   7.17   0.629   +0.774   Scheuren Observatory\n073  26.0967 0.71549 +0.69630 Bucharest\n074  26.4058 0.87518 -0.48263 Boyden Observatory, Bloemfontein\n075  26.7216 0.52557 +0.84791 Tartu\n076  27.8768 0.90127 -0.43225 Johannesburg-Hartbeespoort\n077  28.0292 0.89819 -0.43876 Yale-Columbia Station, Johannesburg\n078  28.0750 0.89824 -0.43868 Johannesburg\n079  28.2288 0.90120 -0.43251 Radcliffe Observatory, Pretoria\n080  28.9667 0.75566 +0.65278 Istanbul\n081  27.8768 0.90127 -0.43225 Leiden Station, Johannesburg\n082  15.7561 0.66929 +0.74063 St. Polten\n083  30.5056 0.63918 +0.76651 Golosseevo-Kiev\n084  30.3274 0.50471 +0.86041 Pulkovo\n085  30.5023 0.63800 +0.76749 Kiev\n086  30.7582 0.68987 +0.72152 Odessa\n087  31.3411 0.86799 +0.49495 Helwan\n088  31.8250 0.86741 +0.49608 Kottomia\n089  31.9747 0.68359 +0.72743 Nikolaev\n090   8.25   0.645   +0.762   Mainz\n091   4.209190.703630+0.708287Observatoire de Nurol, Aurec sur Loire\n092  18.5546 0.60177 +0.79601 Torun-Piwnice\n093  20.3647 0.3537  +0.9322  Skibotn\n094  33.9974 0.71565 +0.69620 Crimea-Simeis\n095  34.0160 0.71172 +0.70024 Crimea-Nauchnij\n096   9.4283 0.69967 +0.71215 Merate\n097  34.7625 0.86165 +0.50608 Wise Observatory, Mitzpeh Ramon\n098  11.5688 0.69790 +0.71410 Asiago Observatory, Cima Ekar\n099  25.53   0.483   +0.873   Lahti\n100  24.13   0.462   +0.884   Ahtari\n101  36.2322 0.64403 +0.76246 Kharkov\n102  36.759530.564841+0.822468Zvenigorod\n103  14.47   0.694   +0.715   Ljubljana\n104  10.8042 0.71985 +0.69202 San Marcello Pistoiese\n105  37.5706 0.56403 +0.82302 Moscow\n106  14.0711 0.69662 +0.71519 Crni Vrh\n107  11.0030 0.70998 +0.70186 Cavezzo\n108  11.0278 0.72367 +0.68784 Montelupo\n109   3.0705 0.80241 +0.59481 Algiers-Kouba\n110  39.4150 0.54316 +0.83683 Rostov\n111  10.9721 0.72439 +0.68710 Piazzano Observatory, Florence\n112  10.9039 0.70232 +0.70950 Pleiade Observatory, Verona\n113  13.0166 0.63502 +0.77001 Volkssternwarte Drebach, Schoenbrunn\n114  41.4277 0.72489 +0.68702 Engelhardt Observatory, Zelenchukskaya Station\n115  41.4416 0.72492 +0.68699 Zelenchukskaya\n116  11.5958 0.66893 +0.74094 Giesing\n117  11.5385 0.66897 +0.74092 Sendling\n118  17.2740 0.66558 +0.74394 Astronomical and Geophysical Observatory, Modra\n119  42.8200 0.74731 +0.66262 Abastuman\n120  13.7261 0.70489 +0.70699 Visnjan\n121  36.9369 0.64883 +0.75842 Kharkov University, Chuguevskaya Station\n122   3.5035 0.72017 +0.69176 Pises Observatory\n123  44.2917 0.76352 +0.64398 Byurakan\n124   2.2550 0.72534 +0.68612 Castres\n125  44.789500.747594+0.662026Tbilisi\n126   9.7903 0.71893 +0.69283 Monte Viseggi\n127   6.9797 0.63385 +0.77088 Bornheim\n128  46.006610.623279+0.779393Saratov\n129  45.92   0.777   +0.628   Ordubad\n130  10.239630.700143+0.711791Lumezzane\n131   4.725  0.7123  +0.6996  Observatoire de l'Ardeche\n132   5.2461 0.71919 +0.69260 Bedoin\n133   5.0906 0.72819 +0.68309 Les Tardieux\n134  11.4842 0.63160 +0.77277 Groszschwabhausen\n135  49.1210 0.56353 +0.82334 Kasan\n136  48.8156 0.56282 +0.82383 Engelhardt Observatory, Kasan\n137  34.8147 0.84821 +0.52790 Givatayim Observatory\n138   7.5717 0.67550 +0.73494 Village-Neuf\n139   7.1108 0.72526 +0.68618 Antibes\n140   3.6294 0.69945 +0.71241 Augerolles\n141   7.3672 0.65646 +0.75189 Hottviller\n142   7.1874 0.62156 +0.78075 Sinsen\n143   9.024060.692986+0.718590Gnosca\n144   1.6660 0.65549 +0.75268 Bray et Lu\n145   4.5597 0.62734 +0.77614 's-Gravenwezel\n146  10.6673 0.71715 +0.69487 Frignano\n147   8.573910.700430+0.711392Osservatorio Astronomico di Suno\n148   2.0375 0.72481 +0.68667 Guitalens\n149   4.2236 0.65403 +0.75396 Beine-Nauroy\n150   2.1572 0.65806 +0.75045 Maisons Laffitte\n151   8.7440 0.67719 +0.73346 Eschenberg Observatory, Winterthur\n152  25.5633 0.57036 +0.81868 Moletai Astronomical Observatory\n153   9.1747 0.66080 +0.74814 Stuttgart-Hoffeld\n154  12.1043 0.68923 +0.72250 Cortina\n155  10.1971 0.55864 +0.82664 Ole Romer Observatory, Aarhus\n156  15.0858 0.79431 +0.60549 Catania Astrophysical Observatory\n157  12.8117 0.74166 +0.66864 Frasso Sabino\n158   7.6033 0.69871 +0.71333 Promiod\n159  10.5153 0.72065 +0.69115 Monte Agliale\n160  10.841440.722651+0.688913Castelmartini\n161   8.1605 0.70725 +0.70467 Cerrina Tololo Observatory\n162  15.7805 0.75988 +0.64808 Potenza\n163   6.1492 0.65017 +0.75731 Roeser Observatory, Luxembourg\n164   6.8861 0.66631 +0.74325 St. Michel sur Meurthe\n165   1.7553 0.74984 +0.65946 Piera Observatory, Barcelona\n166  16.0117 0.63730 +0.76812 Upice\n167   8.5727 0.67662 +0.73398 Bulach Observatory\n168  59.5472 0.54541 +0.83541 Kourovskaya\n169   8.4016 0.70737 +0.70453 Airali Observatory\n170   1.9206 0.75217 +0.65711 Observatorio de Begues\n171  14.4697 0.81089 +0.58327 Flarestar Observatory, San Gwann\n172   7.0364 0.68593 +0.72539 Onnens\n173  55.5061 0.93464 -0.35447 St. Clotilde, Reunion\n174  25.5131 0.46536 +0.88219 Nyrola Observatory, Jyvaskyla\n175   7.6083 0.6932  +0.7188  F.-X. Bagnoud Observatory, St-Luc\n176   2.8225 0.77098 +0.63475 Observatorio Astronomico de Consell\n177   3.9414 0.72477 +0.68669 Le Cres\n178   6.1344 0.69423 +0.71745 Collonges\n179   9.0175 0.69694 +0.71507 Monte Generoso\n180   3.9519 0.72571 +0.68570 Mauguio\n181  55.4100 0.93288 -0.35941 Observatoire des Makes, Saint-Louis\n182  55.2586 0.93394 -0.35634 St. Paul, Reunion\n183  41.4200 0.72496 +0.68695 Starlab Observatory, Karachay-Cherkessia\n184   6.0361 0.72081 +0.69097 Valmeca Observatory, Puimichel\n185   7.4219 0.67876 +0.73200 Observatoire Astronomique Jurassien-Vicques\n186  66.8821 0.77679 +0.62781 Kitab\n187  17.0733 0.61314 +0.78735 Astronomical Observatory, Borowiec\n188  66.895550.782059+0.621762Majdanak\n189   6.1514 0.69340 +0.71823 Geneva (before 1967)\n190  68.6819 0.78382 +0.61909 Gissar\n191  68.7811 0.78306 +0.62006 Dushanbe\n192  69.2936 0.75213 +0.65692 Tashkent\n193  69.2178 0.78648 +0.61610 Sanglok\n194  18.0094 0.91807 -0.39579 Tivoli\n195  11.4492 0.66804 +0.74174 Untermenzing Observatory, Munich\n196   7.3331 0.65296 +0.75490 Homburg-Erbach\n197  12.1836 0.71739 +0.69434 Bastia\n198   8.756740.662195+0.746924Wildberg\n199   2.4380 0.66659 +0.74294 Buthiers\n200   4.3036 0.63385 +0.77088 Beersel Hills Observatory\n201   7.6033 0.69871 +0.71332 Jonathan B. Postel Observatory\n202   5.8997 0.73137 +0.67971 Tamaris Observatoire, La Seyne sur Mer\n203   8.9964 0.70160 +0.71022 GiaGa Observatory\n204   8.7708 0.69765 +0.71430 Schiaparelli Observatory\n205  11.2731 0.71478 +0.69703 Obs. Casalecchio di Reno, Bologna\n206  10.5667 0.4922  +0.8677  Haagaar Observatory, Eina\n207   9.3065 0.70156 +0.71025 Osservatorio Antonio Grosso\n208   9.5875 0.70893 +0.70294 Rivalta\n209  11.5688 0.69790 +0.71410 Asiago Observatory, Cima Ekar-ADAS\n210  76.9573 0.73042 +0.68104 Alma-Ata\n211  11.1764 0.72338 +0.68815 Scandicci\n212 355.357470.803253+0.593708Observatorio La Dehesilla\n213   2.385390.749843+0.659421Observatorio Montcabre\n214  11.6569 0.66709 +0.74258 Garching Observatory\n215  10.7328 0.67021 +0.73981 Buchloe\n216   5.6914 0.65732 +0.75114 Observatoire des Cote de Meuse\n217  77.871140.730114+0.681643Assah\n218  78.4541 0.95444 +0.29768 Hyderabad\n219  78.7283 0.95618 +0.29216 Japal-Rangapur\n220  78.8263 0.97627 +0.21634 Vainu Bappu Observatory, Kavalur\n221  16.3631 0.91960 -0.39228 IAS Observatory, Hakos\n222   2.4939 0.66113 +0.74777 Yerres-Canotiers\n223  80.2464 0.97427 +0.22465 Madras\n224   7.501710.673178+0.737048Ottmarsheim\n225 288.8250 0.7298  +0.6814  Northwood Ridge Observatory\n226  11.8858 0.70293 +0.70888 Guido Ruggieri Observatory, Padua\n227 281.2853 0.73683 +0.67392 OrbitJet Observatory, Colden\n228  13.8750 0.70038 +0.71147 Bruno Zugna Observatory, Trieste\n229  14.9743 0.75936 +0.64857 G. C. Gloriosi Astronomical Observatory, Salerno\n230  12.0133 0.6744  +0.7363  Mt. Wendelstein Observatory\n231   5.3983 0.64403 +0.76253 Vesqueville\n232   1.3317 0.7500  +0.6593  Masquefa Observatory\n233  10.5403 0.72226 +0.68931 Sauro Donati Astronomical Observatory, San Vito\n234   1.128330.614951+0.785931Coddenham Observatory\n235  13.113520.696669+0.714993CAST Observatory, Talmassons\n236  84.9465 0.55370 +0.82995 Tomsk\n237   2.7333 0.6822  +0.7288  Baugy\n238  10.9094 0.50204 +0.86197 Grorudalen Optical Observatory\n239   8.4114 0.64506 +0.76159 Trebur\n240   8.833170.662308+0.746832Herrenberg Sternwarte\n241  13.4700 0.66465 +0.74474 Schaerding\n242   1.6956 0.72681 +0.68460 Varennes\n243   9.4130 0.59572 +0.80050 Umbrella Observatory, Fredenbeck\n244   0.000000.000000 0.000000Geocentric Occultation Observation\n245                           Spitzer Space Telescope\n246  14.2881 0.65922 +0.74965 Klet Observatory-KLENOT\n247                           Roving Observer\n248   0.000000.000000 0.000000Hipparcos\n249                           SOHO\n250                           Hubble Space Telescope\n251 293.246920.949577+0.312734Arecibo\n252 243.205120.817719+0.573979Goldstone DSS 13, Fort Irwin\n253 243.110470.815913+0.576510Goldstone DSS 14, Fort Irwin\n254 288.511280.736973+0.673692Haystack, Westford\n255  33.186890.705965+0.705886Evpatoria\n256 280.160170.784451+0.618320Green Bank\n257 243.124610.816796+0.575252Goldstone DSS 25, Fort Irwin\n259  19.225860.349828+0.933688EISCAT Tromso UHF\n260 149.0661 0.85560 -0.51626 Siding Spring Observatory-DSS\n261 243.140220.836325+0.546877Palomar Mountain-DSS\n262 289.266260.873440-0.486052European Southern Observatory, La Silla-DSS\n266 204.523440.941701+0.337237New Horizons KBO Search-Subaru\n267 204.530440.941705+0.337234New Horizons KBO Search-CFHT\n268 289.308030.875516-0.482342New Horizons KBO Search-Magellan/Clay\n269 289.309140.875510-0.482349New Horizons KBO Search-Magellan/Baade\n277 356.8175 0.56158 +0.82467 Royal Observatory, Blackford Hill, Edinburgh\n278 116.4494 0.76818 +0.63809 Peking, Transit of Venus site\n279  10.728220.631526+0.772827Seeberg Observatory, Gotha (1787-1857)\n280   8.9118 0.60114 +0.79646 Lilienthal\n281  11.3522 0.71448 +0.69733 Bologna\n282   4.3603 0.72245 +0.68912 Nimes\n283   8.8163 0.60204 +0.79579 Bremen\n284  15.8311 0.60536 +0.79329 Driesen\n285   2.3708 0.66135 +0.74759 Flammarion Observatory, Juvisy\n286 102.7883 0.90694 +0.42057 Yunnan Observatory\n290 250.107990.842743+0.537438Mt. Graham-VATT\n291 248.4009 0.84947 +0.52647 LPL/Spacewatch II\n292 285.1058 0.76630 +0.64033 Burlington, New Jersey\n293 285.5899 0.76936 +0.63668 Burlington remote site\n294 285.8467 0.76031 +0.64739 Astrophysical Obs., College of Staten Island\n295 283.0000 0.7789  +0.6251  Catholic University Observatory, Washington\n296 286.2515 0.7365  +0.6742  Dudley Observatory, Albany (after 1893)\n297 286.819  0.7203  +0.6913  Middlebury\n298 287.3408 0.74943 +0.65988 Van Vleck Observatory\n299 107.6160 0.99316 -0.11808 Bosscha Observatory, Lembang\n300 133.544440.823370+0.565720Bisei Spaceguard Center-BATTeRS\n301 288.8467 0.70279 +0.70926 Mont Megantic\n302 288.88   0.990   +0.150   University of the Andes station\n303 289.1296 0.98890 +0.15185 OAN de Llano del Hato, Merida\n304 289.2980 0.87559 -0.48217 Las Campanas Observatory\n305 109.5514 0.82066 +0.56963 Purple Mountain, Hainan Island station\n306 290.6769 0.98477 +0.17381 Observatorio Taya Beixo, Barquisimeto\n307 287.7166 0.72410 +0.68743 Shattuck Observatory, Hanover\n309 289.595690.909943-0.414336Cerro Paranal\n312 112.334  0.9574  +0.2877  Tsingtao field station, Xisha Islands\n318 115.691  0.85206 -0.52170 Quinns Rock\n319 116.1350 0.84883 -0.52702 Perth Observatory, Perth-Lowell Telescope\n320 116.4381 0.85859 -0.51102 Chiro Observatory\n321 115.7571 0.85078 -0.52378 Craigie\n322 116.1340 0.84882 -0.52703 Perth Observatory, Bickley-MCT\n323 116.1350 0.84882 -0.52703 Perth Observatory, Bickley\n324 116.3277 0.76598 +0.64072 Peking Observatory, Shaho Station\n327 117.5750 0.76278 +0.64470 Peking Observatory, Xinglong Station\n330 118.8209 0.84828 +0.52788 Purple Mountain Observatory, Nanking\n333 249.5236 0.84936 +0.52642 Desert Eagle Observatory\n334 120.3196 0.80925 +0.58552 Tsingtao\n337 121.1843 0.85708 +0.51348 Sheshan, formerly Zo-Se\n340 135.4853 0.82199 +0.56762 Toyonaka\n341 137.9486 0.80669 +0.58923 Akashina\n342 134.3189 0.83425 +0.54955 Shishikui\n343 127.1258 0.78688 +0.61507 Younchun\n344 128.9767 0.80841 +0.58695 Bohyunsan Optical Astronomy Observatory\n345 128.4575 0.80046 +0.59773 Sobaeksan Optical Astronomy Observatory\n346 127.3854 0.80474 +0.59166 KNUE Astronomical Observatory\n347 139.9086 0.80417 +0.59244 Utsunomiya-Imaizumi\n348 135.2669 0.81698 +0.57475 Ayabe\n349 139.566220.810402+0.583916Ageo\n350 139.2635 0.80504 +0.59132 Kurohone\n351 135.8678 0.81939 +0.57135 Sakamoto\n352 136.1778 0.82061 +0.56963 Konan\n353 135.0648 0.82265 +0.56669 Nishi Kobe\n354 140.0206 0.80109 +0.59674 Kawachi\n355 139.2133 0.81618 +0.57590 Hadano\n356 141.0867 0.78319 +0.61970 Kogota\n357 140.0064 0.80807 +0.58712 Shimotsuma\n358 140.1586 0.78856 +0.61296 Nanyo\n359 135.1719 0.82782 +0.55912 Wakayama\n360 132.9442 0.83314 +0.55138 Kuma Kogen\n361 134.8933 0.82649 +0.56106 Sumoto\n362 140.6550 0.73673 +0.67398 Ray Observatory\n363 130.7703 0.83416 +0.54967 Yamada\n364 130.5747 0.85213 +0.52164 YCPM Kagoshima Station\n365 135.9579 0.82597 +0.56196 Uto Observatory\n366 138.3003 0.81147 +0.58267 Miyasaka Observatory\n367 133.1670 0.81504 +0.57747 Yatsuka\n368 138.8117 0.81213 +0.58191 Ochiai\n369 139.1500 0.8101  +0.5844  Chichibu\n370 133.5273 0.83424 +0.54956 Kochi\n371 133.5965 0.82433 +0.56431 Tokyo-Okayama\n372 133.8276 0.83450 +0.54920 Geisei\n373 135.3397 0.82866 +0.55797 Oishi\n374 134.7196 0.81915 +0.57174 Minami-Oda Observatory\n375 134.8708 0.8206  +0.5697  Uzurano\n376 139.0392 0.81321 +0.58022 Uenohara\n377 135.7933 0.82014 +0.57031 Kwasan Observatory, Kyoto\n378 136.0142 0.82437 +0.56426 Murou\n379 137.6279 0.82300 +0.56613 Hamamatsu-Yuto\n380 137.0349 0.82190 +0.56772 Ishiki\n381 137.6283 0.81220 +0.58173 Tokyo-Kiso\n382 137.5553 0.80915 +0.58639 Tokyo-Norikura\n383 137.8959 0.80218 +0.59526 Chirorin\n384 138.1792 0.8219  +0.5678  Shimada\n385 138.4680 0.82039 +0.56997 Nihondaira Observatory\n386 138.3217 0.81121 +0.58309 Yatsugatake-Kobuchizawa\n387 139.1944 0.81000 +0.58469 Tokyo-Dodaira\n388 139.5421 0.81330 +0.57991 Tokyo-Mitaka\n389 139.7447 0.81347 +0.57965 Tokyo (before 1938)\n390 139.8725 0.80425 +0.59234 Utsunomiya\n391 140.778430.786177+0.615960Sendai Observatory, Ayashi Station\n392 141.3667 0.73355 +0.67741 JCPM Sapporo Station\n393 140.1292 0.8090  +0.5858  JCPM Sakura Station\n394 142.3208 0.70692 +0.70493 JCPM Hamatonbetsu Station\n395 142.3583 0.7224  +0.6891  Tokyo-Asahikawa\n396 142.4208 0.7236  +0.6879  Asahikawa\n397 141.4761 0.73210 +0.67892 Sapporo Science Center\n398 139.1080 0.80870 +0.58630 Nagatoro\n399 144.5900 0.73158 +0.67950 Kushiro\n400 143.7827 0.72344 +0.68811 Kitami\n401 139.4208 0.8088  +0.5861  Oosato\n402 136.3078 0.81800 +0.57335 Dynic Astronomical Observatory\n403 137.0556 0.81593 +0.57625 Kani\n404 140.9292 0.7909  +0.6099  Yamamoto\n405 139.3292 0.8069  +0.5887  Kamihoriguchi\n406 141.8233 0.72946 +0.68174 Bibai\n407 140.3099 0.78426 +0.61837 Kahoku\n408 138.1747 0.81121 +0.58328 Nyukasa\n409 139.5211 0.81234 +0.58124 Kiyose and Mizuho\n410 134.8910 0.81883 +0.57222 Sengamine\n411 139.4170 0.80739 +0.58805 Oizumi\n412 140.5991 0.80011 +0.59803 Iwaki\n413 149.066080.855595-0.516262Siding Spring Observatory\n414 149.0077 0.81694 -0.57499 Mount Stromlo\n415 149.0636 0.81615 -0.57606 Kambah\n416 149.1336 0.81701 -0.57485 Barton\n417 137.1371 0.79611 +0.60317 Yanagida Astronomical Observatory\n418 150.940340.857259-0.513294Tamworth\n419 150.8329 0.83370 -0.55038 Windsor\n420 151.2050 0.83126 -0.55404 Sydney\n421 133.7650 0.83244 +0.55262 Mt. Kajigamori, Otoyo\n422 151.0461 0.85503 -0.51709 Loomberah\n423 151.124730.831807-0.553222North Ryde\n424 149.0658 0.81758 -0.57405 Macquarie\n425 152.9316 0.88796 -0.45843 Taylor Range Observatory, Brisbane\n426 136.8217 0.85618 -0.51498 Woomera\n427 138.7283 0.82667 -0.56084 Stockport\n428 153.3970 0.88271 -0.46837 Reedy Creek\n429 149.0400 0.81761 -0.57402 Hawker\n430 149.2123 0.85550 -0.51623 Rainbow Observatory, near Coonabarabran\n431 149.7578 0.83548 -0.54793 Mt. Tarana Observatory, Bathurst\n432 153.082220.863790-0.502166Boambee\n433 152.1078 0.84197 -0.53771 Bagnall Beach Observatory\n434  10.9206 0.70765 +0.70419 S. Benedetto Po\n435  11.8936 0.70330 +0.70852 G. Colombo Astronomical Observatory, Padua\n436  11.3356 0.71658 +0.69528 Osservatorio di Livergnano\n437 284.6971 0.76700 +0.63953 Haverford\n438 287.3621 0.74059 +0.66978 Smith College Observatory, Northampton\n439 253.2539 0.81156 +0.58288 ROTSE-III, Los Alamos\n440 278.6842 0.73025 +0.68097 Elginfield Observatory\n441 357.1697 0.55559 +0.82867 Swilken Brae, St. Andrews\n442 357.4822 0.7477  +0.6619  Gualba Observatory\n443 301.4656 0.82370 -0.56513 Obs. Astronomico Plomer, Buenos Aires\n444 243.2794 0.83507 +0.54868 Star Cruiser Observatory\n445 359.4200 0.7802  +0.6235  Observatorio d'Ontinyent\n446 262.1666 0.87049 +0.49058 Kingsnake Observatory, Seguin\n447 255.2056 0.77154 +0.63448 Centennial Observatory\n448 253.2801 0.84543 +0.53268 Desert Moon Observatory, Las Cruces\n449 279.6503 0.82617 +0.56156 Griffin Hunter Observatory, Bethune\n450 279.3339 0.81857 +0.57254 Carla Jane Observatory, Charlotte\n451 262.7569 0.79447 +0.60536 West Skies Observatory, Mulvane\n452 279.1063 0.8980  +0.4385  Big Cypress Observatory, Fort Lauderdale\n453 242.1331 0.82030 +0.57021 Edwards Raven Observatory\n454 283.376780.774542+0.630425Maryland Space Grant Consortium Observatory\n455 237.9636 0.78912 +0.61218 CBA Concord\n456 358.8278 0.61348 +0.78709 Daventry Observatory\n457  18.3403 0.66221 +0.74685 Partizanske\n458 355.9806 0.75992 +0.64805 Guadarrama Observatory\n459 288.1172 0.72607 +0.68538 Smith River Observatory, Danbury\n460 265.9981 0.83010 +0.55579 Area 52 Observatory, Nashville\n461  19.8943 0.67153 +0.73869 University of Szeged, Piszkesteto Stn. (Konkoly)\n462 283.0842 0.77905 +0.62488 Mount Belleview Observatory\n463 254.7375 0.76726 +0.63959 Sommers-Bausch Observatory, Boulder\n464 288.5013 0.75109 +0.65799 Toby Point Observatory, Narragansett\n465 174.7801 0.80166 -0.59578 Takapuna\n466 174.8487 0.8002  -0.5977  Mount Molehill Observatory, Auckland\n467 174.7766 0.80058 -0.59724 Auckland Observatory\n468  13.3296 0.74652 +0.66349 Astronomical Observatory, Campo Catino\n469   7.3820 0.67873 +0.73205 Courroux\n470  13.327560.749268+0.660088Ceccano\n471   8.2389 0.56364 +0.82325 Houstrup\n472   6.3203 0.71225 +0.69998 Merlette\n473  13.316610.694793+0.716822Remanzacco\n474 170.464960.720773-0.691079Mount John Observatory, Lake Tekapo\n475   7.6965 0.70747 +0.70443 Turin (before 1913)\n476   7.140440.706594+0.705356Grange Observatory, Bussoleno\n477   0.4856 0.62103 +0.78117 Galleywood\n478   3.0896 0.72548 +0.68597 Lamalou-les-Bains\n479   6.0505 0.73020 +0.68096 Sollies-Pont\n480   0.7733 0.61466 +0.78616 Cockfield\n481   7.93   0.596   +0.800   Moorwarfen\n482 357.1854 0.55560 +0.82866 St. Andrews\n483 173.8036 0.74734 -0.66254 Carter Observatory, Black Birch Station\n484 174.7594 0.75191 -0.65706 Happy Valley, Wellington\n485 174.7654 0.75256 -0.65635 Carter Observatory, Wellington\n486 175.47   0.765   -0.643   Palmerston North\n487 355.4444 0.56858 +0.81989 Macnairston Observatory\n488 358.3664 0.57486 +0.81553 Newcastle-upon-Tyne\n489 359.87   0.612   +0.788   Hemingford Abbots\n490 358.00   0.633   +0.772   Wimborne Minster\n491 356.9000 0.76131 +0.64644 Centro Astronomico de Yebes\n492 358.47   0.605   +0.795   Mickleover\n493 357.4542 0.79753 +0.60182 Calar Alto\n494 357.8361 0.61126 +0.78879 Stakenbridge\n495 357.66   0.598   +0.800   Altrincham\n496 358.6860 0.6311  +0.7731  Bishopstoke\n497 359.30   0.626   +0.776   Ascot-Loudwater\n498 359.2581 0.61334 +0.78718 Earls Barton\n499 359.7924 0.62558 +0.77755 Cheam\n500   0.000000.000000 0.000000Geocentric\n501   0.3475 0.63237 +0.77208 Herstmonceux\n502   0.85   0.617   +0.783   Colchester\n503   0.0948 0.61400 +0.78667 Cambridge\n504   4.3944 0.68553 +0.72570 Le Creusot\n505   4.5639 0.6229  +0.7797  Simon Stevin\n506   9.96   0.598   +0.797   Bendestorf\n507   5.22   0.617   +0.783   Nyenheim\n508   5.29   0.617   +0.783   Zeist\n509   5.8725 0.73132 +0.67976 La Seyne sur Mer\n510   8.0256 0.63185 +0.77257 Siegen\n511   5.7157 0.72140 +0.69034 Haute Provence\n512   4.4893 0.61477 +0.78606 Leiden (before 1860)\n513   4.7855 0.69971 +0.71209 Lyons\n514   8.438  0.6513  +0.7563  Mundenheim (1907-1913)\n515   7.4956 0.64656 +0.76038 Volkssternwarte Dhaun, near Kirn\n516   9.973210.595399+0.800741Hamburg (before 1909)\n517   6.1358 0.69201 +0.71957 Geneva (from 1967)\n518   9.9727 0.59545 +0.80071 Marine Observatory, Hamburg\n519   8.2867 0.62598 +0.77729 Meschede\n520   7.0966 0.63427 +0.77053 Bonn\n521  10.887940.645624+0.761154Remeis Observatory, Bamberg\n522   7.7677 0.66279 +0.74633 Strasbourg\n523   8.6512 0.64251 +0.76374 Frankfurt\n524   8.4605 0.6509  +0.7566  Mannheim\n525   8.7708 0.6331  +0.7715  Marburg\n526  10.1477 0.58426 +0.80886 Kiel\n527   9.9431 0.5955  +0.8007  Altona\n528   9.9426 0.62340 +0.77931 Gottingen\n529  10.7229 0.50259 +0.86163 Christiania\n530  10.6898 0.5911  +0.8039  Lubeck\n531  12.4797 0.74545 +0.66434 Collegio Romano, Rome\n532  11.6084 0.66853 +0.74130 Munich\n533  11.8715 0.70335 +0.70847 Padua\n534  12.3913 0.62606 +0.77719 Leipzig (since 1861)\n535  13.3578 0.78782 +0.61386 Palermo\n536  13.1062 0.61135 +0.78873 Berlin-Babelsberg\n537  13.3642 0.6097  +0.7900  Urania Observatory, Berlin\n538  13.8461 0.70998 +0.70187 Pola\n539  14.1316 0.66968 +0.74024 Kremsmunster\n540  14.2753 0.66470 +0.74477 Linz\n541  14.3953 0.64306 +0.76331 Prague\n542  13.0374 0.6091  +0.7904  Falkensee\n543  12.3688 0.6260  +0.7772  Leipzig (before 1861)\n544  13.351310.610644+0.789263Wilhelm Foerster Observatory, Berlin\n545  16.3817 0.66767 +0.74200 Vienna (before 1879)\n546  16.3549 0.66760 +0.74207 Oppolzer Observatory, Vienna\n547  17.0363 0.62904 +0.77479 Breslau\n548  13.3950 0.60999 +0.78976 Berlin (1835-1913)\n549  17.6257 0.50341 +0.86116 Uppsala\n550  11.4196 0.5943  +0.8015  Schwerin\n551  18.1895 0.67201 +0.73808 Hurbanovo, formerly O'Gyalla\n552  11.3418 0.71485 +0.69700 Osservatorio S. Vittore, Bologna\n553  18.9938 0.64002 +0.76574 Chorzow\n554   8.3959 0.63684 +0.76845 Burgsolms Observatory, Wetzlar\n555  19.8263 0.64336 +0.76306 Cracow-Fort Skala\n556  11.26   0.675   +0.734   Reintal, near Munich\n557  14.7837 0.64530 +0.76148 Ondrejov\n558  21.0303 0.61396 +0.78672 Warsaw\n559  14.98   0.793   +0.607   Serra La Nave\n560  10.931000.703262+0.708561Madonna di Dossobuono\n561  19.8943 0.67153 +0.73869 Piszkesteto Stn. (Konkoly)\n562  15.9236 0.66938 +0.74062 Figl Observatory, Vienna\n563  13.60   0.671   +0.739   Seewalchen\n564  11.19   0.671   +0.741   Herrsching\n565  10.1344 0.70437 +0.70746 Bassano Bresciano\n566 203.7424 0.93623 +0.35156 Haleakala-NEAT/GEODSS\n567  12.7117 0.69783 +0.71387 Chions\n568 204.5278 0.94171 +0.33725 Mauna Kea\n569  24.9587 0.49891 +0.86375 Helsinki\n570  25.2990 0.5794  +0.8123  Vilnius (since 1939)\n571  10.63   0.704   +0.708   Cavriana\n572   6.89   0.631   +0.772   Cologne\n573   9.6612 0.6145  +0.7862  Eldagsen\n574  10.27   0.704   +0.708   Gottolengo\n575   6.808  0.68219 +0.72894 La Chaux de Fonds\n576   0.38   0.631   +0.774   Burwash\n577   7.50   0.678   +0.734   Metzerlen Observatory\n578  27.99   0.898   -0.439   Linden Observatory\n579   8.85   0.711   +0.701   Novi Ligure\n580  15.4936 0.68242 +0.72862 Graz\n581  22.80   0.830   -0.556   Sedgefield\n582   1.2408 0.61682 +0.78447 Orwell Park\n583  30.2717 0.69087 +0.72056 Odessa-Mayaki\n584  30.2946 0.50213 +0.86189 Leningrad\n585  30.524620.640079+0.765763Kyiv comet station\n586   0.1423 0.73358 +0.67799 Pic du Midi\n587   9.230250.697442+0.714485Sormano\n588  11.25   0.715   +0.697   Eremo di Tizzano\n589  12.643690.738223+0.672386Santa Lucia Stroncone\n590   7.46   0.678   +0.734   Metzerlen\n591   9.6258 0.60995 +0.78979 Resse Observatory\n592   7.021140.628245+0.775437Solingen\n593  11.17   0.739   +0.671   Monte Argentario\n594  13.2033 0.74497 +0.66529 Monte Autore\n595  13.525780.696925+0.714749Farra d'Isonzo\n596  12.6183 0.74446 +0.66545 Colleverde di Guidonia\n597   9.6631 0.61461 +0.78621 Springe\n598  11.334090.717444+0.694448Loiano\n599  13.557640.739311+0.671604Campo Imperatore-CINEOS\n600  11.4708 0.71618 +0.69564 TLC Observatory, Bologna\n601  13.7281 0.63009 +0.77394 Engelhardt Observatory, Dresden\n602  16.3854 0.66764 +0.74203 Urania Observatory, Vienna\n603  10.1300 0.58622 +0.80745 Bothkamp\n604  13.475240.610235+0.789572Archenhold Sternwarte, Berlin-Treptow\n605   7.1130 0.62142 +0.78086 Marl\n606   9.9956 0.59353 +0.80212 Norderstedt\n607   8.0000 0.6277  +0.7760  Hagen Observatory, Ronkhausen\n608 203.7420 0.93623 +0.35156 Haleakala-AMOS\n609  12.8533 0.73772 +0.67314 Osservatorio Polino\n610  11.3431 0.71577 +0.69604 Pianoro\n611   8.6531 0.64877 +0.75848 Starkenburg Sternwarte, Heppenheim\n612   7.10   0.625   +0.778   Lenkerbeck\n613   7.0709 0.62504 +0.77800 Heisingen\n614   2.467  0.6621  +0.7469  Soisy-sur-Seine\n615   6.9067 0.71233 +0.70014 St. Veran\n616  16.583480.654655+0.753466Brno\n617   2.5725 0.66496 +0.74437 Arbonne la Foret\n618   5.0077 0.72750 +0.68382 Martigues\n619   2.090130.749506+0.659828Sabadell\n620   2.9517 0.77110 +0.63463 Observatorio Astronomico de Mallorca\n621   7.485030.629461+0.774501Bergisch Gladbach\n622   7.5680 0.68778 +0.72358 Oberwichtrach\n623   5.5667 0.63577 +0.76932 Liege\n624   9.6167 0.64723 +0.75977 Dertingen\n625 203.5683 0.93557 +0.35201 Kihei-AMOS Remote Maui Experimental Site\n626   4.9864 0.62847 +0.77524 Geel\n627   5.2146 0.72002 +0.69168 Blauvac\n628   6.843660.624789+0.778184Mulheim-Ruhr\n629  20.1511 0.69273 +0.71880 Szeged Observatory\n630   7.2367 0.67051 +0.73951 Osenbach\n631  10.022930.595992+0.800307Hamburg-Georgswerder\n632  11.1739 0.72380 +0.68773 San Polo A Mosciano\n633   9.9339 0.71930 +0.69238 Romito\n634   5.1456 0.70182 +0.71007 Crolles\n635   2.9019 0.73605 +0.67467 Pergignan\n636   6.9794 0.62524 +0.77783 Essen\n637  10.0903 0.59326 +0.80232 Hamburg-Himmelsmoor\n638   8.8933 0.61778 +0.78374 Detmold\n639  13.7233 0.62933 +0.77456 Dresden\n640  13.5996 0.6429  +0.7634  Senftenberger Sternwarte\n641  20.0272 0.82468 -0.56374 Overberg\n642 236.6850 0.6648  +0.7445  Oak Bay, Victoria\n643 243.2794 0.83507 +0.54868 OCA-Anza Observatory\n644 243.140220.836325+0.546877Palomar Mountain/NEAT\n645 254.179420.841945+0.538563Apache Point-Sloan Digital Sky Survey\n646 242.4369 0.82999 +0.55603 Santana Observatory, Rancho Cucamonga\n647 245.9683 0.6337  +0.7712  Stone Finder Observatory, Calgary\n648 249.398220.852115+0.522053Winer Observatory, Sonoita\n649 265.3003 0.78207 +0.62117 Powell Observatory, Louisburg\n650 242.9028 0.83510 +0.54836 Temecula\n651 249.419160.852069+0.522123Grasslands Observatory, Tucson\n652 245.9333 0.6291  +0.7749  Rock Finder Observatory, Calgary\n653 237.8678 0.68091 +0.72996 Torus Observatory, Buckley\n654 242.318410.826471+0.561727Table Mountain Observatory, Wrightwood-PHMC\n655 236.383  0.6656  +0.7438  Sooke\n656 236.3921 0.66580 +0.74367 Victoria\n657 236.6903 0.66437 +0.74491 Climenhaga Observatory, Victoria\n658 236.583000.663631+0.745601National Research Council of Canada\n659 237.0514 0.66257 +0.74650 Heron Cove Observatory, Orcas\n660 237.7379 0.79038 +0.61059 Leuschner Observatory, Berkeley\n661 245.7117 0.63251 +0.77222 Rothney Astrophysical Observatory, Priddis\n662 238.3545 0.79619 +0.60335 Lick Observatory, Mount Hamilton\n663 248.3136 0.83483 +0.54879 Red Mountain Observatory\n664 239.2775 0.6840  +0.7273  Manastash Ridge Observatory\n665 240.9903 0.82215 +0.56781 Wallis Observatory\n666 241.1692 0.8270  +0.5604  Moorpark College Observatory\n667 240.009210.684483+0.726626Wanapum Dam\n668 240.82   0.821   +0.568   San Emigdio Peak\n669 240.8238 0.82540 +0.56279 Ojai\n670 240.9558 0.82775 +0.55922 Camarillo\n671 242.0022 0.82719 +0.56052 Stony Ridge\n672 241.9436 0.82794 +0.55942 Mount Wilson\n673 242.317830.826474+0.561722Table Mountain Observatory, Wrightwood\n674 242.336050.826464+0.561730Ford Observatory, Wrightwood\n675 243.137460.836357+0.546831Palomar Mountain\n676 242.3907 0.83553 +0.54762 San Clemente\n677 242.8281 0.82746 +0.56012 Lake Arrowhead\n678 248.2597 0.83352 +0.55083 Fountain Hills\n679 244.5367 0.85792 +0.51292 San Pedro Martir\n680 244.78   0.833   +0.554   Los Angeles\n681 245.8858 0.62954 +0.77459 Calgary\n682 247.6381 0.79932 +0.59932 Kanab\n683 248.9182 0.84751 +0.52922 Goodricke-Pigott Observatory, Tucson\n684 247.5100 0.82512 +0.56356 Prescott\n685 247.84   0.816   +0.575   Williams\n686 249.2092 0.84512 +0.53359 U. of Minn. Infrared Obs., Mt. Lemmon\n687 248.3473 0.81848 +0.57318 Northern Arizona University, Flagstaff\n688 248.4645 0.81938 +0.57193 Lowell Observatory, Anderson Mesa Station\n689 248.2601 0.81851 +0.57319 U.S. Naval Observatory, Flagstaff\n690 248.3367 0.81832 +0.57344 Lowell Observatory, Flagstaff\n691 248.4010 0.84951 +0.52642 Steward Observatory, Kitt Peak-Spacewatch\n692 249.0513 0.84679 +0.53036 Steward Observatory, Tucson\n693 249.267450.845317+0.533211Catalina Station, Tucson\n694 248.9943 0.84700 +0.53009 Tumamoc Hill, Tucson\n695 248.405330.849504+0.526425Kitt Peak\n696 249.1154 0.85205 +0.52249 Whipple Observatory, Mt. Hopkins\n697 248.3842 0.84956 +0.52629 Kitt Peak, McGraw-Hill\n698 249.267360.845316+0.533212Mt. Bigelow\n699 248.463310.819380+0.571930Lowell Observatory-LONEOS\n700 250.3817 0.80656 +0.58960 Chinle\n701 249.797160.853823+0.519224Junk Bond Observatory, Sierra Vista\n702 252.8117 0.8305  +0.5561  Joint Obs. for cometary research, Socorro\n703 249.267360.845315+0.533213Catalina Sky Survey\n704 253.340930.831869+0.553542Lincoln Laboratory ETS, New Mexico\n705 254.179420.841945+0.538563Apache Point\n706 253.9366 0.78294 +0.62043 Salida\n707 254.56   0.774   +0.633   Chamberlin field station\n708 255.0475 0.77092 +0.63520 Chamberlin Observatory, Denver\n709 254.228820.840250+0.541096W & B Observatory, Cloudcroft\n710 254.7336 0.77980 +0.62458 MPO Observatory, Florissant\n711 255.9785 0.86114 +0.50731 McDonald Observatory, Fort Davis\n712 255.118670.778365+0.626250USAF Academy Observatory, Colorado Springs\n713 254.9897 0.76865 +0.63793 Thornton\n714 246.8173 0.82444 +0.56439 Bagdad\n715 253.2759 0.84546 +0.53264 Jornada Observatory, Las Cruces\n716 255.2489 0.77753 +0.62731 Palmer Divide Observatory, Colorado Springs\n717 256.0481 0.86160 +0.50636 Prude Ranch\n718 247.7042 0.76004 +0.64802 Tooele\n719 253.086080.829384+0.557204Etscorn Observatory\n720 259.6261 0.90216 +0.43018 Universidad de Monterrey\n721 259.7312 0.76271 +0.64476 Lime Creek\n722 264.4192 0.87017 +0.49110 Missouri City\n723 263.3300 0.82134 +0.56861 Cottonwood Observatory, Ada\n724 260.8053 0.94388 +0.33026 National Observatory, Tacubaya\n725 261.3453 0.86883 +0.49358 Fair Oaks Ranch\n726 265.6933 0.69024 +0.72120 Brainerd\n727 262.538720.813941+0.579096Zeno Observatory, Edmond\n728 262.6084 0.88610 +0.46194 Corpus Christi\n729 262.878580.648804+0.758451Glenlea Astronomical Observatory, Winnipeg\n730 262.841430.671544+0.738537University of North Dakota, Grand Forks\n731 272.6711 0.77290 +0.63244 Rose-Hulman Observatory, Terre Haute\n732 263.2300 0.95591 +0.29359 Oaxaca\n733 263.3546 0.83802 +0.54387 Allen, Texas\n734 263.9986 0.77943 +0.62449 Farpoint Observatory, Eskridge\n735 264.406400.872133+0.487634George Observatory, Needville\n736 263.3357 0.87006 +0.49132 Houston\n737 275.6633 0.8282  +0.5586  New Bullpen Observatory, Alpharetta\n738 267.6733 0.7788  +0.6252  Observatory of the State University of Missouri\n739 265.2440 0.77965 +0.62419 Sunflower Observatory, Olathe\n740 265.3383 0.8511  +0.5233  SFA Observatory, Nacogdoches\n741 266.8503 0.71493 +0.69692 Goodsell Observatory, Northfield\n742 266.312160.748989+0.660428Drake University, Des Moines\n743 267.761480.708545+0.703382University of Minnesota, Minneapolis\n744 273.8378 0.76884 +0.63735 Doyan Rose Observatory, Indianapolis\n745 267.1747 0.77569 +0.62906 Morrison Obervatory, Glasgow\n746 275.2254 0.72551 +0.68597 Brooks Observatory, Mt. Pleasant\n747 268.9292 0.86373 +0.50227 Highland Road Park Observatory\n748 268.4680 0.75014 +0.65912 Van Allen Observatory, Iowa City\n749 276.1642 0.82795 +0.55902 Oakwood\n750 268.7282 0.71059 +0.70131 Hobbs Observatory, Fall Creek\n751 269.2439 0.78038 +0.62324 Lake Saint Louis\n752 275.4647 0.82278 +0.56659 Puckett Observatory, Mountain Town\n753 270.590690.731622+0.679491Washburn Observatory, Madison\n754 271.4432 0.73762 +0.67303 Yerkes Observatory, Williams Bay\n755 274.6478 0.73353 +0.67743 Optec Observatory\n756 272.3257 0.74361 +0.66641 Dearborn Observatory, Evanston\n757 280.0050 0.8096  +0.5851  High Point\n758 279.2379 0.88044 +0.47257 BCC Observatory, Cocoa\n759 273.1947 0.80946 +0.58530 Nashville\n760 273.6048 0.77216 +0.63337 Goethe Link Observatory, Brooklyn\n761 277.6456 0.88138 +0.47083 Zephyrhills\n762 274.2008 0.70885 +0.70304 Four Winds Observatory, Lake Leelanau\n763 280.4658 0.72157 +0.69009 King City\n764 275.1439 0.83264 +0.55205 Puckett Observatory, Stone Mountain\n765 275.5775 0.77669 +0.62784 Cincinnati\n766 275.5167 0.73600 +0.67477 Michigan State University Obs., East Lansing\n767 276.2697 0.74102 +0.66930 Ann Arbor\n768 272.325000.743590+0.666435Dearborn Observatory\n769 276.9892 0.76716 +0.63936 McMillin Observatory, Columbus\n770 274.0786 0.77573 +0.62900 Crescent Moon Observatory, Columbus\n771 277.57   0.922   +0.389   Boyeros Observatory, Havana\n772 284.0865 0.70517 +0.70669 Boltwood Observatory, Stittsville\n773 278.4318 0.74966 +0.65966 Warner and Swasey Observatory, Cleveland\n774 278.9250 0.74905 +0.66039 Warner and Swasey Nassau Station, Chardon\n775 284.6168 0.76029 +0.64743 Sayre Observatory, South Bethlehem\n776 284.4669 0.73472 +0.67619 Foggy Bottom, Hamilton\n777 280.6017 0.72454 +0.68695 Toronto\n778 279.9778 0.76172 +0.64582 Allegheny Observatory, Pittsburgh\n779 280.5779 0.72219 +0.68943 David Dunlap Observatory, Richmond Hill\n780 281.4778 0.78868 +0.61280 Leander McCormick Observatory, Charlottesville\n781 281.5075 1.00045 -0.00405 Quito\n782 281.65   0.999   +0.000   Quito, comet astrograph station\n783 282.02   0.783   +0.622   Rixeyville\n784 282.2146 0.74140 +0.66895 Stull Observatory, Alfred University\n785 285.3542 0.76323 +0.64397 Fitz-Randolph Observatory, Princeton\n786 282.9345 0.77906 +0.62487 U.S. Naval Obs., Washington (since 1893)\n787 282.9494 0.77934 +0.62451 U.S. Naval Obs., Washington (before 1893)\n788 284.3667 0.76953 +0.63650 Mount Cuba Observatory, Wilmington\n789 284.5940 0.73188 +0.67922 Litchfield Observatory, Clinton\n790 284.2835 0.70343 +0.70840 Dominion Observatory, Ottawa\n791 284.5236 0.76713 +0.63937 Flower and Cook Observatory, Philadelphia\n792 288.30   0.753   +0.657   University of Rhode Island, Quonochontaug\n793 286.2200 0.73660 +0.67407 Dudley Observatory, Albany (before 1893)\n794 286.1100 0.74789 +0.66161 Vassar College Observatory, Poughkeepsie\n795 286.0123 0.7589  +0.6491  Rutherford\n796 286.45   0.755   +0.654   Stamford\n797 287.0751 0.75218 +0.65676 Yale Observatory, New Haven\n798 287.0154 0.75093 +0.65822 Yale Observatory, Bethany\n799 288.8650 0.73896 +0.67150 Winchester\n800 288.4511 0.96006 -0.28021 Harvard Observatory, Arequipa\n801 288.442330.738364+0.672183Oak Ridge Observatory\n802 288.871640.739802+0.670574Harvard Observatory, Cambridge\n803 288.9167 0.74543 +0.66436 Taunton\n804 289.3121 0.83421 -0.54976 Santiago-San Bernardo\n805 288.9800 0.83997 -0.54145 Santiago-Cerro El Roble\n806 289.4513 0.83584 -0.54738 Santiago-Cerro Calan\n807 289.1941 0.86560 -0.49980 Cerro Tololo Observatory, La Serena\n808 290.6708 0.85098 -0.52414 El Leoncito\n809 289.266260.873440-0.486052European Southern Observatory, La Silla\n810 288.5154 0.73712 +0.67352 Wallace Observatory, Westford\n811 289.895650.752586+0.656289Maria Mitchell Observatory, Nantucket\n812 288.4543 0.83992 -0.54093 Vina del Mar\n813 289.3083 0.83533 -0.54805 Santiago-Quinta Normal (1862-1920)\n814 288.419170.746007+0.663734North Scituate\n815 289.3479 0.83539 -0.54799 Santiago-Santa Lucia (1849-1861)\n816 285.7583 0.71645 +0.69542 Rand Observatory\n817 288.6104 0.74018 +0.67017 Sudbury\n818 286.4167 0.7040  +0.7079  Gemeaux Observatory, Laval\n819 284.3850 0.69720 +0.71451 Val-des-Bois\n820 295.375810.930491-0.365872Tarija\n821 295.450410.852688-0.521032Cordoba-Bosque Alegre\n822 295.801370.854203-0.518325Cordoba\n823 288.1691 0.73715 +0.67354 Fitchburg\n824 285.7528 0.71641 +0.69546 Lake Clear\n825 288.2595 0.74033 +0.67003 Granville\n826 288.2282 0.69312 +0.71843 Plessissville\n827 287.5393 0.66190 +0.74710 Saint-Felicien\n828 288.9758 0.74656 +0.66310 Assonet\n829 290.6979 0.85102 -0.52411 Complejo Astronomico El Leoncito\n830 288.5697 0.73491 +0.67590 Hudson\n831 277.4134 0.87191 +0.48804 Rosemary Hill Observatory, University of Florida\n832 283.1850 0.7653  +0.6416  Etters\n833 301.4633 0.82373 -0.56508 Obs. Astronomico de Mercedes, Buenos Aires\n834 301.5654 0.82398 -0.56473 Buenos Aires-AAAA\n835 288.6428 0.73709 +0.67354 Drum Hill Station, Chelmsford\n836 288.5011 0.74708 +0.66252 Furnace Brook Observatory, Cranston\n837 279.7553 0.89228 +0.44996 Jupiter\n838 275.8628 0.77000 +0.63596 Dayton\n839 302.0678 0.82097 -0.56906 La Plata\n840 276.2833 0.73235 +0.67870 Flint\n841 279.442330.796229+0.603220Martin Observatory, Blacksburg\n842 282.7678 0.76901 +0.63713 Gettysburg College Observatory\n843 273.0648 0.82481 +0.56357 Emerald Lane Observatory, Decatur\n844 303.809820.822499-0.566884Observatorio Astronomico Los Molinos\n845 283.5058 0.73942 +0.67107 Ford Observatory, Ithaca\n846 269.655010.779842+0.623926Principia Astronomical Observatory, Elsah\n847 275.9750 0.7078  +0.7041  Lunar Cafe Observator, Flint\n848 237.0219 0.72412 +0.68741 Tenagra Observatory, Cottage Grove\n849 265.1694 0.77927 +0.62467 Everstar Observatory, Olathe\n850 274.0802 0.81810 +0.57333 Cordell-Lorenz Observatory, Sewanee\n851 296.4189 0.71284 +0.69900 Burke-Gaffney Observatory, Halifax\n852 269.4050 0.7805  +0.6231  River Moss Observatory, St. Peters\n853 249.1517 0.84365 +0.53544 Biosphere 2 Observatory\n854 249.179950.846183+0.531351Sabino Canyon Observatory, Tucson\n855 266.5383 0.7093  +0.7026  Wayside Observatory, Minnetonka\n856 242.5540 0.8300  +0.5560  Riverside\n857 249.3992 0.85213 +0.52204 Iowa Robotic Observatory, Sonoita\n858 253.7800 0.8194  +0.5719  Tebbutt Observatory, Edgewood\n859 316.3097 0.94132 -0.33707 Wykrota Observatory-CEAMIG\n860 313.0347 0.92108 -0.38842 Valinhos\n861 312.9204 0.92253 -0.38487 Barao Geraldo\n862 138.5262 0.80861 +0.58658 Saku\n863 137.18   0.807   +0.588   Furukawa\n864 130.7533 0.84257 +0.53680 Kumamoto\n865 285.8792 0.74765 +0.66189 Emmy Observatory, New Paltz\n866 283.5100 0.7784  +0.6257  U.S. Naval Academy, Michelson\n867 134.1222 0.81671 +0.57522 Saji Observatory\n868 135.1359 0.83066 +0.55492 Hidaka Observatory\n869 133.4298 0.83480 +0.54870 Tosa\n870 313.17   0.934   -0.359   Campinas\n871 134.3925 0.82256 +0.56678 Akou\n872 134.2411 0.82904 +0.55734 Tokushima\n873 133.7717 0.82410 +0.56455 Kurashiki Observatory\n874 314.417350.924359-0.380986Observatorio do Pico dos Dias, Itajuba\n875 139.2353 0.80896 +0.58593 Yorii\n876 139.2467 0.80762 +0.58774 Honjo\n877 139.0828 0.81194 +0.58196 Okutama\n878 136.9142 0.82019 +0.57019 Kagiya\n879 137.3535 0.81970 +0.57099 Tokai\n880 316.7771 0.92169 -0.38664 Rio de Janeiro\n881 137.2571 0.81872 +0.57230 Toyota\n882 137.3558 0.81842 +0.57281 JCPM Oi Station\n883 138.4215 0.81986 +0.57065 Shizuoka\n884 138.0792 0.8187  +0.5724  Kawane\n885 138.4667 0.82049 +0.56975 JCPM Yakiimo Station\n886 138.9367 0.81836 +0.57280 Mishima\n887 139.3367 0.80745 +0.58798 Ojima\n888 138.9952 0.81885 +0.57217 Gekko\n889 140.1427 0.80322 +0.59372 Karasuyama\n890 140.2500 0.8108  +0.5834  JCPM Tone Station\n891 140.8633 0.78606 +0.61609 JCPM Kimachi Station\n892 139.4753 0.80852 +0.58650 YGCO Hoshikawa and Nagano Stations\n893 140.862220.786233+0.615870Sendai Municipal Observatory\n894 138.4476 0.81113 +0.58321 Kiyosato\n895 140.7203 0.78573 +0.61658 Hatamae\n896 138.3678 0.81132 +0.58292 Yatsugatake South Base Observatory\n897 139.4929 0.80797 +0.58725 YGCO Chiyoda Station\n898 138.1883 0.82107 +0.56899 Fujieda\n899 142.5500 0.7224  +0.6891  Toma\n900 135.989940.819572+0.571083Moriyama\n901 137.0877 0.81664 +0.57525 Tajimi\n902 132.2208 0.82775 +0.55922 Ootake\n903 135.1769 0.81738 +0.57418 Fukuchiyama and Kannabe\n904 135.12   0.824   +0.565   Go-Chome and Kobe-Suma\n905 135.9246 0.83368 +0.55040 Nachi-Katsuura Observatory\n906 145.667  0.8113  -0.5837  Cobram\n907 144.9758 0.79082 -0.61001 Melbourne\n908 137.2467 0.80352 +0.59330 Toyama\n909 237.8717 0.6711  +0.7389  Snohomish Hilltop Observatory\n910   6.9267 0.72368 +0.68811 Caussols-ODAS\n911 282.9233 0.7429  +0.6672  Collins Observatory, Corning Community College\n912 288.2342 0.74769 +0.66186 Carbuncle Hill Observatory, Greene\n913 303.8161 0.82093 -0.56912 Observatorio Kappa Crucis, Montevideo\n914 288.0108 0.73809 +0.67254 Underwood Observatory, Hubbardston\n915 261.8789 0.86861 +0.49393 River Oaks Observatory, New Braunfels\n916 272.6836 0.77287 +0.63248 Oakley Observatory, Terre Haute\n917 237.5522 0.68140 +0.72948 Pacific Lutheran University Keck Observatory\n918 257.8694 0.72071 +0.69110 Badlands Observatory, Quinn\n919 248.3183 0.8419  +0.5379  Desert Beaver Observatory\n920 282.3353 0.73161 +0.67947 RIT Observatory, Rochester\n921 254.4725 0.83988 +0.54159 SW Institute for Space Research, Cloudcroft\n922 272.8333 0.82335 +0.56569 Timberland Observatory, Decatur\n923 284.6300 0.76655 +0.64006 The Bradstreet Observatory, St. Davids\n924 287.6769 0.68988 +0.72150 Observatoire du Cegep de Trois-Rivieres\n925 249.8589 0.85450 +0.51811 Palominas Observatory\n926 249.1209 0.85394 +0.51902 Tenagra II Observatory, Nogales\n927 270.561940.735007+0.675850Madison-YRS\n928 286.6761 0.75688 +0.65136 Moonedge Observatory, Northport\n929 268.7758 0.86319 +0.50319 Port Allen\n930 210.412240.953752-0.299638Southern Stars Observatory, Tahiti\n931 210.3842 0.95330 -0.30100 Punaauia\n932 286.573940.749771+0.659497John J. McCarthy Obs., New Milford\n933 249.7342 0.85383 +0.51924 Rockland Observatory, Sierra Vista\n934 242.9572 0.83985 +0.54108 Poway Valley\n935 282.3394 0.77977 +0.62400 Wyrick Observatory, Haymarket\n936 263.3792 0.77614 +0.62852 Ibis Observatory, Manhattan\n937 358.6900 0.58065 +0.81143 Bradbury Observatory, Stockton-on-Tees\n938 351.6162 0.77243 +0.63299 Linhaceira\n939 359.6033 0.76982 +0.63619 Observatorio Rodeno\n940 358.9611 0.63199 +0.77238 Waterlooville\n941 359.6139 0.76988 +0.63608 Observatorio Pla D'Arguines\n942 359.3636 0.60413 +0.79423 Grantham\n943 355.8664 0.63881 +0.76679 Peverell\n944 354.083150.796657+0.602418Observatorio Geminis, Dos Hermanas\n945 354.3986 0.72671 +0.68474 Observatorio Monte Deva\n946   0.7931 0.75662 +0.65170 Ametlla de Mar\n947   2.1244 0.65268 +0.75511 Saint-Sulpice\n948   0.2189 0.61048 +0.78937 Pymoor\n949 359.8169 0.67454 +0.73577 Durtal\n950 342.1176 0.87764 +0.47847 La Palma\n951 358.2983 0.62194 +0.78046 Highworth\n952 359.7583 0.7787  +0.6253  Marxuquera\n953   2.1339 0.74602 +0.66393 Montjoia\n954 343.4906 0.88148 +0.47142 Teide Observatory\n955 350.6739 0.78146 +0.62188 Sassoeiros\n956 356.1908 0.76224 +0.64530 Observatorio Pozuelo\n957 359.3506 0.71047 +0.70137 Merignac\n958 358.969610.724206+0.687273Observatoire de Dax\n959   1.4653 0.72596 +0.68548 Ramonville Saint Agne\n960   0.6108 0.63016 +0.77387 Rolvenden\n961 356.8206 0.56112 +0.82498 City Observatory, Calton Hill, Edinburgh\n962 359.8188 0.77845 +0.62561 Gandia\n963 359.7333 0.6084  +0.7909  Werrington\n964 358.8433 0.62471 +0.77826 Southend Bradfield\n965 351.4008 0.79761 +0.60118 Observacao Astronomica no Algarve, Portimao\n966 357.204230.609591+0.790100Church Stretton\n967 358.9778 0.61508 +0.78585 Greens Norton\n968   0.4250 0.6158  +0.7853  Haverhill\n969 359.8454 0.6235  +0.7792  London-Regents Park\n970   0.4954 0.62045 +0.78162 Chelmsford\n971 350.812490.781336+0.622040Lisbon\n972 357.5833 0.54359 +0.83656 Dun Echt\n973 359.6671 0.62271 +0.77983 Harrow\n974   8.9220 0.71542 +0.69637 Genoa\n975 359.6333 0.77292 +0.63239 Observatorio Astronomico de Valencia\n976 358.48   0.612   +0.788   Leamington Spa\n977 351.5483 0.58660 +0.80717 Markree\n978 357.245410.588685+0.805673Conder Brow\n979 358.6697 0.62896 +0.77485 South Wonston\n980 357.2200 0.58864 +0.80570 Lancaster\n981 353.3522 0.58409 +0.80898 Armagh\n982 353.6621 0.59771 +0.79904 Dunsink Observatory, Dublin\n983 353.795250.805167+0.591067San Fernando\n984 357.26   0.631   +0.774   Eastfield\n985 357.5317 0.60801 +0.79130 Telford\n986 358.75   0.624   +0.779   Ascot\n987 355.3735 0.58658 +0.80721 Isle of Man Observatory, Foxdale\n988 355.7060 0.56225 +0.82421 Glasgow\n989 357.69   0.600   +0.797   Wilfred Hall Observatory, Preston\n990 356.3121 0.76260 +0.64487 Madrid\n991 356.9278 0.59750 +0.79919 Liverpool (since 1867)\n992 356.9995 0.5973  +0.7993  Liverpool (before 1867)\n993 357.495560.629975+0.774031Woolston Observatory\n994 359.3878 0.62827 +0.77540 Godalming\n995 358.4177 0.57819 +0.81319 Durham\n996 358.7483 0.62025 +0.78179 Oxford\n997 359.15   0.619   +0.783   Hartwell\n998 359.757530.622254+0.780206London-Mill Hill\n999 359.4725 0.71033 +0.70153 Bordeaux-Floirac\nA00   0.3770 0.62475 +0.77821 Gravesend\nA01   0.7441 0.74414 +0.66596 Masia Cal Maciarol Modul 2\nA02   0.7441 0.74414 +0.66596 Masia Cal Maciarol Modul 8\nA03   1.4000 0.7541  +0.6546  Torredembarra\nA04   1.7181 0.72206 +0.68956 Saint-Caprais\nA05   1.8175 0.72721 +0.68417 Belesta\nA06   2.4417 0.74922 +0.66012 Mataro\nA07   2.7444 0.66070 +0.74815 Gretz-Armainvilliers\nA08   2.8847 0.72735 +0.68406 Malibert\nA09   1.1803 0.65037 +0.75711 Quincampoix\nA10   1.9281 0.75278 +0.65613 Observatorio Astronomico de Corbera\nA11   2.4718 0.63222 +0.77219 Wormhout\nA12   8.747680.703404+0.708434Stazione Astronomica di Sozzago\nA13   7.1394 0.68632 +0.72501 Observatoire Naef, Marly\nA14   5.1864 0.72028 +0.69143 Les Engarouines Observatory\nA15   6.7972 0.61903 +0.78275 Josef Bresser Sternwarte, Borken\nA16   7.1922 0.68622 +0.72511 Tentlingen\nA17   8.681520.650125+0.757317Guidestar Observatory, Weinheim\nA18   7.1761 0.62342 +0.77928 Herne\nA19   7.0744 0.63164 +0.77267 Koln\nA20   7.518870.605274+0.793357Sogel\nA21   8.0581 0.63667 +0.76862 Irmtraut\nA22   8.6531 0.64877 +0.75848 Starkenburg Sternwarte-SOHAS\nA23   8.6677 0.65027 +0.75719 Weinheim\nA24   8.9481 0.69995 +0.71185 New Millennium Observatory, Mozzate\nA25   9.1925 0.70104 +0.71077 Nova Milanese\nA26   8.657360.646597+0.760303Darmstadt\nA27  10.3236 0.61823 +0.78341 Eridanus Observatory, Langelsheim\nA28  10.3342 0.67398 +0.73642 Kempten\nA29  10.6733 0.72369 +0.68782 Santa Maria a Monte\nA30  11.223080.700397+0.711555Crespadoro\nA31  11.4186 0.70024 +0.71155 Corcaroli Observatory\nA32  10.5517 0.58423 +0.80887 Panker\nA33  11.0157 0.63231 +0.77217 Volkssternwarte Kirchheim\nA34  10.7911 0.64944 +0.75793 Grosshabersdorf\nA35  12.8978 0.63511 +0.76995 Hormersdorf Observatory\nA36   9.7911 0.69856 +0.71340 Ganda di Aviatico\nA37  13.6634 0.61128 +0.78877 Mueggelheim\nA38  13.3747 0.74706 +0.66266 Campocatino Automated Telescope, Collepardo\nA39  12.4186 0.63084 +0.77336 Altenburg\nA40  14.4978 0.81104 +0.58306 Pieta\nA41  14.5911 0.69290 +0.71871 Rezman Observatory, Kamnik\nA42   9.5019 0.61280 +0.78760 Gehrden\nA43  13.0897 0.61201 +0.78821 Inastars Observatory, Potsdam (before 2006)\nA44  13.6972 0.66609 +0.74346 Altschwendt\nA45   9.3620 0.62525 +0.77786 Karrenkneul\nA46  16.5825 0.65349 +0.75447 Lelekovice\nA47  16.6031 0.75962 +0.64829 Matera\nA48  10.8885 0.70401 +0.70782 Povegliano Veronese\nA49  17.6372 0.50372 +0.86098 Uppsala-Angstrom\nA50  28.9973 0.64407 +0.76245 Andrushivka Astronomical Observatory\nA51  18.6667 0.5837  +0.8093  Danzig\nA52  18.7553 0.67756 +0.73304 Etyek\nA53  10.6883 0.70294 +0.70889 Peschiera del Garda\nA54  16.6217 0.60828 +0.79108 Ostrorog\nA55  13.1181 0.73871 +0.67204 Osservatorio Astronomico Vallemare di Borbona\nA56  10.3197 0.71406 +0.69784 Parma\nA57  11.1031 0.72364 +0.68791 Osservatorio Astron. Margherita Hack, Firenze\nA58   2.4694 0.66135 +0.74758 Observatoire de Chalandray-Canotiers\nA59  12.9071 0.64123 +0.76490 Karlovy Vary Observatory\nA60  20.8106 0.84556 -0.53260 YSTAR-NEOPAT Station, Sutherland\nA61   8.8581 0.70949 +0.70238 Tortona\nA62   9.2301 0.66233 +0.74678 Aichtal\nA63   4.7567 0.69879 +0.71298 Cosmosoz Obs., Tassin la Demi Lune\nA64   6.1151 0.69034 +0.72132 Couvaloup de St-Cergue\nA65   2.4083 0.71939 +0.69239 Le Couvent de Lentin\nA66  10.3161 0.72613 +0.68526 Stazione Osservativa Astronomica, Livorno\nA67   7.6785 0.71665 +0.69522 Chiusa di Pesio\nA68   9.6533 0.57755 +0.81362 Swedenborg Obs., Bockholmwik\nA69  11.3300 0.7287  +0.6826  Osservatorio Palazzo Bindi Sergardi\nA70  25.2033 0.42654 +0.90144 Lumijoki\nA71  15.4533 0.66486 +0.74459 Stixendorf\nA72  13.6222 0.62904 +0.77481 Radebeul Observatory\nA73  16.2895 0.66788 +0.74183 Penzing Astrometric Obs., Vienna\nA74   8.762400.641951+0.764216Bergen-Enkheim Observatory\nA75   2.1861 0.75124 +0.65783 Fort Pius Observatory, Barcelona\nA76  20.8356 0.66948 +0.74037 Andromeda Observatory, Miskolc\nA77   5.6475 0.72058 +0.69119 Observatoire Chante-Perdrix, Dauban\nA78  11.715090.730944+0.680264Stia\nA79  23.843400.743686+0.666622Zvezdno Obshtestvo Observatory, Plana\nA80  14.1222 0.61408 +0.78662 Lindenberg Observatory\nA81  12.4033 0.74578 +0.66397 Balzaretto Observatory, Rome\nA82  13.8744 0.70037 +0.71148 Osservatorio Astronomico di Trieste\nA83  29.9969 0.45945 +0.88525 Jakokoski Observatory\nA84  30.3333 0.80175 +0.59632 TUBITAK National Observatory\nA85  30.8065 0.68881 +0.72252 Odessa Astronomical Observatory, Kryzhanovka\nA86   4.3547 0.70170 +0.71021 Albigneux\nA87   8.7662 0.64935 +0.75798 Rimbach\nA88   8.901330.714961+0.696835Bolzaneto\nA89  10.3308 0.67421 +0.73621 Sterni Observatory, Kempten\nA90   2.1431 0.75120 +0.65788 Sant Gervasi Observatory, Barcelona\nA91  26.5997 0.46678 +0.88143 Hankasalmi Observatory\nA92  26.0927 0.71506 +0.69673 Urseanu Observatory, Bucharest\nA93  10.4189 0.72222 +0.68935 Lucca\nA94  13.4577 0.69641 +0.71526 Cormons\nA95  28.3892 0.46584 +0.88193 Taurus Hill Observatory, Varkaus\nA96  16.2867 0.66656 +0.74303 Klosterneuburg\nA97  16.4219 0.66646 +0.74308 Stammersdorf\nA98  30.2092 0.58214 +0.81040 Taurus-1 Observatory, Baran'\nA99  10.8589 0.69978 +0.71223 Osservatorio del Monte Baldo\nB00   2.5767 0.66289 +0.74622 Savigny-le-Temple\nB01   8.4464 0.64117 +0.76499 Taunus Observatory, Frankfurt\nB02  20.6566 0.63224 +0.77224 Kielce\nB03  16.2698 0.66759 +0.74211 Alter Satzberg, Vienna\nB04   7.478510.698677+0.713400OAVdA, Saint-Barthelemy\nB05  37.8831 0.57134 +0.81800 Ka-Dar Observatory, Barybino\nB06   2.533720.747520+0.662058Montseny Astronomical Observatory\nB07   9.0033 0.69383 +0.71778 Camorino\nB08  11.3807 0.71498 +0.69683 San Lazzaro di Savena\nB09  10.6708 0.72550 +0.68593 Capannoli\nB10   5.5150 0.71564 +0.69631 Observatoire des Baronnies Provencales, Moydans\nB11  10.6286 0.69881 +0.71318 Osservatorio Cima Rest, Magasa\nB12   4.4906 0.61329 +0.78721 Koschny Observatory, Noordwijkerhout\nB13   8.9311 0.69950 +0.71231 Osservatorio di Tradate\nB14   9.0758 0.71061 +0.70138 Ca del Monte\nB15  13.0129 0.61111 +0.78890 Inastars Observatory, Potsdam (since 2006)\nB16  36.9547 0.56382 +0.82317 1st Moscow Gymnasium Observatory, Lipki\nB17  33.162800.705588+0.706256AZT-8 Evpatoria\nB18  42.5008 0.72958 +0.68232 Terskol\nB19   2.4414 0.74963 +0.65966 Observatorio Iluro, Mataro\nB20   2.2636 0.75026 +0.65897 Observatorio Carmelita, Tiana\nB21  13.4744 0.66335 +0.74589 Gaisberg Observatory, Schaerding\nB22   0.7441 0.74412 +0.66598 Observatorio d'Ager\nB23  10.9710 0.70124 +0.71069 Fiamene\nB24   2.5983 0.66317 +0.74598 Cesson\nB25  15.0557 0.79386 +0.60614 Catania\nB26   5.6667 0.72204 +0.68966 Observatoire des Terres Blanches, Reillanne\nB27  14.1544 0.66425 +0.74516 Picard Observatory, St. Veit\nB28  13.1836 0.69466 +0.71696 Mandi Observatory, Pagnacco\nB29   0.6701 0.75801 +0.65008 L'Ampolla Observatory, Tarragona\nB30  16.5689 0.60872 +0.79074 Szamotuly-Galowo\nB31  20.8108 0.84560 -0.53254 Southern African Large Telescope, Sutherland\nB32  12.9486 0.63467 +0.77030 Gelenau\nB33  10.7783 0.72588 +0.68555 Libbiano Observatory, Peccioli\nB34  33.7258 0.81748 +0.57405 Green Island Observatory, Gecitkale\nB35  35.0317 0.84991 +0.52524 Bareket Observatory, Macabim\nB36  13.7125 0.66684 +0.74278 Redshed Observatory, Kallham\nB37   2.259340.748338+0.661147Obs. de L' Ametlla del Valles, Barcelona\nB38  11.857460.724995+0.686523Santa Mama\nB39   8.9072 0.69950 +0.71231 Tradate\nB40  15.0706 0.79331 +0.60690 Skylive Observatory, Catania\nB41  17.6925 0.65449 +0.75362 Zlin Observatory\nB42  30.3275 0.57401 +0.81614 Vitebsk\nB43   7.3089 0.63404 +0.77073 Hennef\nB44   5.5906 0.71772 +0.69419 Eygalayes\nB45  19.9356 0.64169 +0.76447 Narama\nB46  12.054390.714373+0.697420Sintini Observatory, Alfonsine\nB47  24.7503 0.49826 +0.86413 Metsala Observatory, Espoo\nB48   6.5981 0.61901 +0.78275 Bocholt\nB49   2.112690.749492+0.659841Paus Observatory, Sabadell\nB50   8.2767 0.65808 +0.75045 Corner Observatory, Durmersheim\nB51   7.066690.725612+0.685830Vallauris\nB52   2.997250.741344+0.668883Observatorio El Far\nB53  12.3536 0.74572 +0.66404 Casal Lumbroso, Rome\nB54   0.7439 0.74413 +0.66597 Ager\nB55  12.876000.689553+0.721975Comeglians\nB56   2.449350.749614+0.659663Observatorio Sant Pere, Mataro\nB57   2.224390.749316+0.660019Laietania Observatory, Parets del Valles\nB58  19.025290.676156+0.734318Polaris Observatory, Budapest\nB59   6.878810.619231+0.782586Borken\nB60   7.175310.612824+0.787576Deep Sky Observatorium, Bad Bentheim\nB61   2.043500.750575+0.658604Valldoreix Obs.,Sant Cugat del Valles\nB62   9.685310.609275+0.790314Brelingen\nB63  20.107990.642589+0.763698Solaris Observatory, Luczanowice\nB64  24.887790.491587+0.867927Slope Rock Observatory, Hyvinkaa\nB65  24.3878 0.49864 +0.86391 Komakallio Observatory, Kirkkonummi\nB66   9.006930.710595+0.701332Osservatorio di Casasco\nB67   9.224190.685858+0.725582Sternwarte Mirasteilas, Falera\nB68  13.539500.693458+0.718372Mount Matajur Observatory\nB69   9.017190.662152+0.746956Owls and Ravens Observatory, Holzgerlingen\nB70   2.4937 0.74787 +0.66165 Sant Celoni\nB71   1.5213 0.75363 +0.65510 Observatorio El Vendrell\nB72   7.6811 0.63470 +0.77022 Soerth\nB73   8.985030.662074+0.747029Mauren Valley Observatory, Holzgerlingen\nB74   1.105360.747550+0.662053Santa Maria de Montmagastrell\nB75   8.805190.701074+0.710741Stazione Astronomica Betelgeuse, Magnago\nB76  13.8944 0.63019 +0.77390 Sternwarte Schonfeld, Dresden\nB77   7.950830.677934+0.732833Schafmatt Observatory, Aarau\nB78  14.128110.670885+0.739158Astrophoton Observatory, Audorf\nB79  11.209900.700480+0.711457Marana Observatory\nB80  12.741260.742254+0.667919Osservatorio Astronomico Campomaggiore\nB81   2.8990 0.76967 +0.63634 Caimari\nB82   9.9716 0.64613 +0.76072 Maidbronn\nB83   5.797690.706034+0.705851Gieres\nB84   3.537750.622812+0.779749Cyclops Observatory, Oostkapelle\nB85   6.510110.604962+0.793587Beilen Observatory\nB86   7.455610.625931+0.777324Sternwarte Hagen\nB87   2.7701 0.74295 +0.66715 Banyoles\nB88   8.296810.710570+0.701309Bigmuskie Observatory, Mombercelli\nB89   2.2619 0.75018 +0.65907 Observatori Astronomic de Tiana\nB90  13.296860.693994+0.717600Malina River Observatory, Povoletto\nB91   7.255440.672149+0.737995Bollwiller\nB92   0.275390.681073+0.729781Chinon\nB93   6.478560.607102+0.791962Hoogeveen\nB94  34.2817 0.47422 +0.87748 Petrozavodsk\nB95   8.154500.602437+0.795492Achternholt\nB96   4.310310.628378+0.775301Brixiis Observatory, Kruibeke\nB97   6.1118 0.61688 +0.78442 Sterrenwacht Andromeda, Meppel\nB98  11.313000.728746+0.682563Siena\nB99   0.7443 0.74413 +0.66598 Santa Coloma de Gramenet\nC00  30.5150 0.55583 +0.82853 Velikie Luki\nC01  13.922930.630265+0.773855Lohrmann-Observatorium, Triebenberg\nC02   2.5305 0.74740 +0.66218 Observatorio Royal Park\nC03  24.961560.492890+0.867187Clayhole Observatory, Jokela\nC04  37.6331 0.65998 +0.74878 Kramatorsk\nC05  12.1153 0.68023 +0.73088 Konigsleiten\nC06  92.9744 0.56032 +0.82553 Krasnoyarsk\nC07   0.7442 0.74413 +0.66597 Anysllum Observatory, Ager\nC08  17.3761 0.50302 +0.86138 Fiby\nC09   3.803970.722660+0.688932Rouet\nC10   3.426220.661039+0.747874Maisoncelles\nC11  14.0901 0.64091 +0.76509 City Observatory, Slany\nC12   2.1107 0.74967 +0.65964 Berta Observatory, Sabadell\nC13   9.100310.698332+0.713430Como\nC14  15.967000.668463+0.741344Sky Vistas Observatory, Eichgraben\nC15 132.1656 0.72418 +0.68737 ISON-Ussuriysk Observatory\nC16  11.572610.673687+0.736691Isarwinkel Observatory, Bad Tolz\nC17   0.743810.744124+0.665978Observatorio Joan Roget, Ager\nC18   3.604000.634888+0.770037Frasnes-Lez-Anvaing\nC19   5.4231 0.71591 +0.69599 ROSA Observatory, Vaucluse\nC20  42.661910.723859+0.688104Kislovodsk Mtn. Astronomical Stn., Pulkovo Obs.\nC21   0.743830.744124+0.665978Observatorio Via Lactea, Ager\nC22  12.9599 0.63858 +0.76717 Oberwiesenthal\nC23   5.154390.628694+0.775052Olmen\nC24   9.1331 0.70036 +0.71145 Seveso\nC25  13.558060.739310+0.671605Pulkovo Observatory Station, Campo Imperatore\nC26   4.499280.614813+0.786032Levendaal Observatory, Leiden\nC27   1.353020.748763+0.660753Pallerols\nC28   7.483000.624224+0.778652Wellinghofen\nC29   1.078890.737202+0.673777Observatori Astronomic de Les Planes de Son\nC30  35.3425 0.47988 +0.87440 Petrozavodsk University Obs., Sheltozero Stn.\nC31   6.9825 0.62777 +0.77581 Sternwarte Neanderhoehe Hochdahl e.V., Erkrath\nC32  41.4258 0.72496 +0.68694 Ka-Dar Observatory, TAU Station, Nizhny Arkhyz\nC33   2.8989 0.76967 +0.63634 Observatorio CEAM, Caimari\nC34  19.0108 0.69361 +0.71796 Baja Astronomical Observatory\nC35   2.0349 0.74927 +0.66012 Terrassa\nC36  30.3086 0.58230 +0.81028 Starry Wanderer Observatory, Baran'\nC37   1.018300.614242+0.786484Stowupland\nC38   7.649110.703322+0.708581Varuna Observatory, Cuorgne\nC39   5.7992 0.61929 +0.78253 Nijmegen\nC40  39.0308 0.70806 +0.70380 Kuban State University Astrophysical Observatory\nC41  42.661260.723857+0.688105MASTER-II Observatory, Kislovodsk\nC42  87.1778 0.72711 +0.68469 Xingming Observatory, Mt. Nanshan\nC43  14.2792 0.62451 +0.77842 Hoyerswerda\nC44   9.022390.696268+0.715567A. Volta Observatory, Lanzo d'Intelvi\nC45  12.406390.744413+0.665514MPC1 Cassia Observatory, La Giustiniana\nC46  69.122190.576620+0.814296Horizon Observatory, Petropavlovsk\nC47  15.2356 0.66017 +0.74871 Nonndorf\nC48 100.9214 0.62235 +0.78051 Sayan Solar Observatory, Irkutsk\nC49                           STEREO-A\nC50                           STEREO-B\nC51                           WISE\nC52                           Swift\nC53                           NEOSSat\nC54                           New Horizons\nC55                           Kepler\nC60   7.069260.634261+0.770545Argelander Institute for Astronomy Obs., Bonn\nC61   2.582020.658892+0.749723Chelles\nC62  11.3467 0.68967 +0.72175 Eurac Observatory, Bolzano\nC63   9.9797 0.69363 +0.71819 Giuseppe Piazzi Observatory, Ponte in Valtellina\nC64  15.284390.671380+0.738819Puchenstuben\nC65   0.729650.743841+0.666482Observatori Astronomic del Montsec\nC66   2.8050 0.77084 +0.63493 Observatorio El Cielo de Consell\nC67  12.2199 0.59747 +0.79922 Gnevsdorf\nC68  23.893390.789058+0.612302Ellinogermaniki Agogi Observatory, Pallini\nC69  13.3611 0.65835 +0.75036 Bayerwald Sternwarte, Neuhuette\nC70   4.497750.614779+0.786055Uiterstegracht Station, Leiden\nC71   1.4892 0.74780 +0.66186 Sant Marti Sesgueioles\nC72  12.8717 0.74621 +0.66358 Palestrina\nC73  28.0325 0.70312 +0.70870 Galati Observatory\nC74   0.7449 0.74412 +0.66598 Observatorio El Teatrillo de Lyra, Ager\nC75  13.2225 0.69384 +0.71776 Whitestar Observatory, Borgobello\nC76   0.744310.744127+0.665974Observatorio Estels, Ager\nC77   7.4535 0.71589 +0.69600 Bernezzo Observatory\nC78  34.812420.849698+0.525519Martin S. Kraar Observatory, Rehovot\nC79   2.7855 0.74801 +0.66147 Roser Observatory, Blanes\nC80  47.2344 0.77027 +0.63559 Don Astronomical Observatory, Rostov-on-Don\nC81  10.840980.693023+0.718872Dolomites Astronomical Observatory\nC82  14.357630.760171+0.647611Osservatorio Astronomico Nastro Verde, Sorrento\nC83  91.8425 0.55930 +0.82626 Badalozhnyj Observatory\nC84   2.243720.750690+0.658447Badalona\nC85   1.2408 0.77939 +0.62448 Observatorio Cala d'Hort, Ibiza\nC86   2.7813 0.74801 +0.66147 Blanes\nC87   8.7689 0.64913 +0.75817 Rimbach\nC88  11.183310.729763+0.681487Montarrenti Observatory, Siena\nC89  21.555580.730958+0.680397Astronomical Station Vidojevica\nC90   1.051810.754546+0.654066Vinyols\nC91  11.226210.717604+0.694214Montevenere Observatory, Monzuno\nC92  13.609950.727425+0.683915Valdicerro Observatory, Loreto\nC93  13.4064 0.74042 +0.67004 Bellavista Observatory, L'Aquila\nC94 103.0670 0.61962 +0.78241 MASTER-II Observatory, Tunka\nC95   5.712390.721401+0.690345SATINO Remote Observatory, Haute Provence\nC96  13.8786 0.73544 +0.67537 OACL Observatory, Mosciano Sant Angelo\nC97  57.976330.916656+0.398354Al-Fulaij Observatory, Oman\nC98  11.1764 0.72335 +0.68818 Osservatorio Casellina, Scandicci\nC99   2.896310.746295+0.663419Observatori Can Roig, Llagostera\nD00  42.6536 0.72388 +0.68809 ISON-Kislovodsk Observatory\nD01  23.930610.495920+0.865471Andean Northern Observatory, Nummi-Pusula\nD02   2.051890.751414+0.657647Observatori Petit Sant Feliu\nD03  10.5889 0.71522 +0.69670 Rantiga Osservatorio, Tincana\nD04  38.4308 0.70960 +0.70225 Krasnodar\nD05  42.500050.729580+0.682314ISON-Terskol Observatory\nD06  12.770170.747232+0.662472Associazione Tuscolana di Astronomia, Domatore\nD07   6.2094 0.62867 +0.77508 Wegberg\nD08   8.9191 0.69024 +0.72136 Ghezz Observatory, Leontica\nD09   5.6794 0.63139 +0.77287 Observatory Gromme, Maasmechelen\nD14 113.3231 0.92000 +0.39061 Nanchuan Observatory, Guangzhou\nD16 113.964220.925155+0.378330Po Leung Kuk Observatory, Tuen Mun\nD17 114.2200 0.9245  +0.3799  Hong Kong\nD18 114.3580 0.86219 +0.50490 Mt. Guizi Observatory\nD19 114.323000.924955+0.378843Hong Kong Space Museum, Tsimshatsui\nD20 115.713110.854733-0.517343Zadko Observatory, Wallingup Plain\nD21 115.8150 0.8492  -0.5263  Shenton Park\nD22 115.816670.849044-0.526558UWA Observatory, Crawley\nD24 117.089690.844095-0.534439LightBuckets Observatory, Pingelly\nD25 117.089780.844104-0.534424Tzec Maun Observatory, Pingelly (before 2010)\nD29 118.4639 0.84204 +0.53767 Purple Mountain Observatory, XuYi Station\nD32 119.599750.862770+0.504193JiangNanTianChi Observatory, Mt. Getianling\nD33 120.6982 0.92730 +0.37308 Kenting Observatory, Checheng\nD34 120.7839 0.92796 +0.37148 Kenting Observatory, Hengchun\nD35 120.8736 0.91818 +0.39597 Lulin Observatory\nD36 120.8897 0.91801 +0.39625 Tataka, Mt. Yu-Shan National Park\nD39 122.049610.793971+0.605943Shandong University Observatory, Weihai\nD44 124.139280.911427+0.410157Ishigakijima Astronomical Observatory\nD53 127.4820 0.63981 +0.76600 ISON-Blagoveschensk Observatory\nD54 127.4830 0.63981 +0.76601 MASTER-II Observatory, Blagoveshchensk\nD55 127.9747 0.79571 +0.60370 Kangwon Science High School Observatory, Ksho\nD57 128.887440.817572+0.573996Gimhae Astronomical Observatory, Uhbang-dong\nD58 129.025000.818419+0.572736KSA SEM Observatory, Danggam-dong\nD61 134.9131 0.82671 +0.56075 Suntopia Marina, Sumoto\nD62 130.4494 0.83676 +0.54575 Miyaki-Argenteus\nD70 133.4686 0.83505 +0.54834 Tosa\nD74 134.6819 0.83041 +0.55530 Nakagawa\nD78 136.132810.822378+0.567077Iga-Ueno\nD79 138.630920.821212-0.568722YSVP Observatory, Vale Park\nD80 138.9728 0.80392 +0.59297 Gumma Astronomical Observatory\nD81 138.2239 0.80310 +0.59394 Nagano\nD82 137.6317 0.83058 -0.55504 Wallaroo\nD83 138.4681 0.80501 +0.59161 Miwa\nD84 138.5086 0.8192  -0.5716  Hallet Cove\nD85 138.6597 0.82186 -0.56782 Ingle Farm\nD86 138.6407 0.83075 -0.55490 Penwortham\nD87 138.5500 0.82079 -0.56931 Brooklyn Park\nD88 139.3142 0.81635 +0.57562 Hiratsuka\nD89 140.3383 0.7871  +0.6149  Yamagata\nD90 140.3420 0.82728 -0.55991 RAS Observatory, Moorook\nD91 140.8250 0.79261 +0.60775 Adati\nD92 140.946380.782920+0.620047Osaki\nD93 140.755160.786291+0.615826Sendai Astronomical Observatory\nD94 139.9962 0.80351 +0.59335 Takanezawa, Tochigi\nD95 141.0680 0.78035 +0.62325 Kurihara\nD96 140.342160.827287-0.559905Tzec Maun Observatory, Moorook\nD97 140.5700 0.82752 -0.55956 Berri\nE00 144.2089 0.79902 -0.59937 Castlemaine\nE01 144.541420.798618-0.599924Barfold\nE03 145.3822 0.78756 -0.61419 RAS Observatory, Officer\nE04 145.7403 0.96545 +0.25977 Pacific Sky Observatory, Saipan\nE05 145.697210.957625-0.287092Earl Hill Observatory, Trinity Beach\nE07 148.998890.820544-0.569830Murrumbateman\nE08 149.334310.855971-0.515472Wobblesock Observatory, Coonabarabran\nE09 149.0814 0.85551 -0.51630 Oakley Southern Sky Observatory, Coonabarabran\nE10 149.070280.855623-0.516200Siding Spring-Faulkes Telescope South\nE11 149.6627 0.84469 -0.53362 Frog Rock Observatory, Mudgee\nE12 149.0642 0.85563 -0.51621 Siding Spring Survey\nE13 149.0969 0.81622 -0.57597 Wanniassa\nE14 149.1100 0.81852 -0.57274 Hunters Hill Observatory, Ngunnawal\nE15 149.6061 0.82016 -0.57041 Magellan Observatory, near Goulburn\nE16 149.366240.831681-0.553654Grove Creek Observatory, Trunkey\nE17 150.3417 0.8329  -0.5519  Leura\nE18 151.027140.829819-0.556191BDI Observatory, Regents Park\nE19 151.0958 0.83042 -0.55528 Kingsgrove\nE20 151.103200.832146-0.552728Marsfield\nE21 151.5667 0.8838  -0.4665  Norma Rose Observatory, Leyburn\nE22 151.855000.885337-0.463616Univ. of Southern Queensland Obs., Mt. Kent\nE23 151.071190.833596-0.550574Arcadia\nE24 150.7769 0.83176 -0.55329 Tangra Observatory, St. Clair\nE25 153.1170 0.88713 -0.45997 Rochedale (APTA)\nE26 153.3971 0.88414 -0.46566 RAS Observatory, Biggera Waters\nE27 153.2667 0.8871  -0.4600  Thornlands\nE28 150.6411 0.83319 -0.55121 Kuriwa Observatory, Hawkesbury Heights\nE81 173.2617 0.75267 -0.65622 Nelson\nE83 173.957030.749648-0.659621Wither Observatory, Witherlea\nE85 174.894000.800696-0.597064Farm Cove\nE87 175.6540 0.76249 -0.64485 Turitea\nE89 176.2040 0.78759 -0.61421 Geyserland Observatory, Pukehangi\nE94 177.883310.782217-0.620920Possum Observatory, Gisborne\nF51 203.744090.936241+0.351543Pan-STARRS 1, Haleakala\nF52 203.744090.936239+0.351545Pan-STARRS 2, Haleakala\nF59 201.941000.932037+0.361160Ironwood Remote Observatory, Hawaii\nF60 201.952830.929942+0.366558Ironwood Observatory, Hawaii\nF65 203.7424 0.93624 +0.35154 Haleakala-Faulkes Telescope North\nF84 210.3842 0.95330 -0.30100 Hibiscus Observatory, Punaauia\nF85 210.3842 0.95330 -0.30100 Tiki Observatory, Punaauia\nF86 210.383810.953304-0.301004Moana Observatory, Punaauia\nG25 288.1050 0.70317 +0.70867 Sherbrooke\nG26 109.8236 0.82499 +0.56338 Fushan Observatory, Mt Shaohua\nG27   0.729350.743842+0.666483Fabra Observatory, Montsec\nG28   1.008500.609900+0.789830Wyncroft Observatory, Attleborough\nG29 358.9124 0.77285 +0.63263 Requena\nG30 284.907190.704518+0.707320Casselman\nG31  13.7253 0.69946 +0.71233 CCAT Trieste\nG32 291.820400.921639-0.387713Elena Remote Observatory, San Pedro de Atacama\nG33   7.608790.623411+0.779293Wickede\nG34  13.7015 0.63254 +0.77203 Oberfrauendorf\nG35 249.157890.849476+0.526134Elephant Head Obsevatory, Sahuarita\nG36 357.452500.797538+0.601812Calar Alto-CASADO\nG37 248.577490.822887+0.566916Lowell Observatory-Discovery Channel Telescope\nG38 356.768420.759967+0.647951Observatorio La Senda, Cabanillas del Campo\nG39 291.820390.921640-0.387711ROAD, San Pedro de Atacama\nG40 343.491740.881470+0.471441Slooh.com Canary Islands Observatory\nG41 264.738160.867040+0.496575Insperity Observatory, Humble\nG42 259.0230 0.90391 +0.42687 Observatorio Astronomico UAdeC, Saltillo\nG43 293.6879 0.83817 -0.54382 Observatorio Buenaventura Suarez, San Luis\nG44 313.3061 0.92118 -0.38816 Observatorio Longa Vista, Sao Paulo\nG45 253.635640.832748+0.552480Space Surveillance Telescope, Atom Site\nG46 244.661530.818022+0.573711Pinto Valley Observatory\nG47 253.806540.819827+0.571261HillTopTop Observatory, Edgewood\nG48 251.101480.849514+0.526196Doc Greiner Research Obs., Rancho Hildalgo\nG49 266.5943 0.70889 +0.70302 Minnetonka\nG50 253.3300 0.84629 +0.53134 Organ Mesa Observatory, Las Cruces\nG51 239.957780.823164+0.565990Byrne Observatory, Sedgwick Reserve\nG52 237.496040.785917+0.616275Stone Edge Observatory, El Verano\nG53 240.587270.799043+0.599625Alder Springs Observatory, Auberry\nG54 243.0630 0.83295 +0.55166 Hemet\nG55 241.095330.816361+0.575651Bakersfield\nG56 237.9294 0.78983 +0.61128 Walnut Creek\nG57 236.8564 0.70171 +0.71009 Dilbert Observatory, Forest Grove\nG58 237.8180 0.79100 +0.60988 Chabot Space and Science Center, Oakland\nG59 237.4530 0.67475 +0.73559 Maiden Lane Obs., Bainbridge Island\nG60 240.338880.825544+0.562496Carroll Observatory, Montecito\nG61 238.1524 0.79270 +0.60760 Pleasanton\nG62 238.5469 0.72214 +0.68971 Sunriver Nature Center Observatory, Sunriver\nG63 238.6858 0.70152 +0.71031 Mill Creek Observatory, The Dalles\nG64 239.2911 0.77535 +0.62979 Blue Canyon Observatory\nG65 238.3612 0.79616 +0.60338 Vulcan North, Lick Observatory, Mount Hamilton\nG66 238.9169 0.78135 +0.62206 Lake Forest Observatory, Forest Hills\nG67 239.3650 0.78134 +0.62225 Rancho Del Sol, Camino\nG68 240.2250 0.78044 +0.62355 Sierra Stars Observatory, Markleeville\nG69 241.0158 0.82829 +0.55850 Via Capote Sky Observatory, Thousand Oaks\nG70 241.4547 0.82543 +0.56273 Francisquito Observatory, Los Angeles\nG71 241.6047 0.83216 +0.55276 Rancho Palos Verdes\nG72 241.824080.829301+0.556970University Hills\nG73 241.9400 0.82804 +0.55925 Mount Wilson-TIE\nG74 242.885380.837429+0.544849Boulder Knolls Observatory, Escondido\nG75 243.2783 0.8351  +0.5487  Starry Knight Observatory, Coto de Caza\nG76 242.4178 0.83388 +0.55015 Altimira Observatory, Coto de Caza\nG77 243.7183 0.8274  +0.5603  Baldwin Lake\nG78 244.3127 0.84158 +0.53832 Desert Wanderer Observatory, El Centro\nG79 243.6165 0.82718 +0.56030 Goat Mountain Astronomical Research Station\nG80 240.5873 0.79904 +0.59962 Sierra Remote Observatories, Auberry\nG81 242.913000.834904+0.548639Temecula\nG82 248.400250.849488+0.526449SARA Observatory, Kitt Peak\nG83 250.110390.842740+0.537440Mt. Graham-LBT\nG84 249.210840.845112+0.533610Mount Lemmon SkyCenter\nG85 247.565180.799502+0.599067Vermillion Cliffs Observatory, Kanab\nG86 249.0697 0.84645 +0.53090 Tucson-Winterhaven\nG87 248.1894 0.74666 +0.66331 Calvin M. Hooper Memorial Observatory, Hyde Park\nG88 247.8881 0.83064 +0.55514 LAMP Observatory, New River\nG89 248.3069 0.81933 +0.57197 Kachina Observatory, Flagstaff\nG90 248.9658 0.84301 +0.53639 Three Buttes Observatory, Tucson\nG91 249.1219 0.85208 +0.52234 Whipple Observatory, Mt. Hopkins--2MASS\nG92 249.2814 0.84920 +0.52660 Jarnac Observatory, Vail\nG93 249.3726 0.85215 +0.52201 Sonoita Research Observatory, Sonoita\nG94 249.9267 0.84971 +0.52594 Sonoran Skies Observatory, St. David\nG95 249.7622 0.85404 +0.51888 Hereford Arizona Observatory, Hereford\nG96 249.211280.845111+0.533614Mt. Lemmon Survey\nG97 250.8694 0.84965 +0.52600 Astronomical League Alpha Observatory, Portal\nG98 251.343540.815037+0.578012Calvin-Rehoboth Observatory, Rehoboth\nG99 251.8104 0.84192 +0.53835 NF Observatory, Silver City\nH00 251.6987 0.84247 +0.53746 Tyrone\nH01 252.8108 0.83047 +0.55610 Magdalena Ridge Observatory, Socorro\nH02 253.3706 0.81146 +0.58309 Sulphur Flats Observatory, La Cueva\nH03 253.3553 0.81753 +0.57440 Sandia View Observatory, Rio Rancho\nH04 254.0260 0.81388 +0.57964 Santa Fe\nH05 256.0707 0.77126 +0.63477 Edmund Kline Observatory, Deer Trail\nH06 254.471300.840712+0.540310iTelescope Observatory, Mayhill\nH07 254.471340.840711+0.5403107300 Observatory, Cloudcroft\nH08 254.470810.840705+0.540319BlackBird Observatory, Cloudcroft\nH09 255.5886 0.77070 +0.63549 Antelope Hills Observatory, Bennett\nH10 254.471410.840711+0.540309Tzec Maun Observatory, Mayhill\nH11 250.9840 0.85029 +0.52492 LightBuckets Observatory, Rodeo\nH12 254.470780.840712+0.540307TechDome, Mayhill\nH13 248.252120.840489+0.540134Lenomiya Observatory, Casa Grande\nH14 249.212330.846402+0.530995Morning Star Observatory, Tucson\nH15 254.471560.840711+0.540308ISON-NM Observatory, Mayhill\nH16 253.2890 0.77152 +0.63472 HUT Observatory, Eagle\nH17 254.383330.783783+0.619652Angel Peaks Observatory\nH18 249.287980.849231+0.526572Vail\nH19 263.862590.828144+0.558685Lone Star Observatory, Caney\nH20 271.816820.772950+0.632393Eastern Illinois University Obs., Charleston\nH21 272.031730.772885+0.632471Astronomical Research Observatory, Westfield\nH22 272.7371 0.77438 +0.63062 Terre Haute\nH23 273.498580.862319+0.504671Pear Tree Observatory, Valparaiso\nH24 274.598810.733648+0.677310J. C. Veen Observatory, Lowell\nH25 266.870820.714467+0.697388Harvest Moon Observatory, Northfield\nH26 270.789220.735075+0.675789Doc Greiner Research Observatory, Janesvillle\nH27 266.231340.780074+0.623645Moonglow Observatory, Warrensburg\nH28 263.231500.836912+0.545569Preston Hills Observatory, Celina\nH29 262.5494 0.81372 +0.57940 Ivywood Observatory, Edmond\nH30 262.5558 0.81808 +0.57328 University of Oklahoma Observatory, Norman\nH31 263.3300 0.87011 +0.49123 Star Ridge Observatory, Weimar\nH32 263.6334 0.86174 +0.50567 Texas A&M Physics Observatory, College Station\nH33 264.1217 0.80990 +0.58466 Bixhoma Observatory, Bixby\nH34 264.8258 0.84600 +0.53143 Chapel Hill\nH35 264.9517 0.77423 +0.63085 Leavenworth\nH36 264.2936 0.78043 +0.62323 Sandlot Observatory, Scranton\nH37 265.2003 0.72947 +0.68182 Grems Timmons Observatories, Graettinger\nH38 265.9864 0.75079 +0.65840 Timberline Observatory, Urbandale\nH39 266.6828 0.70944 +0.70247 S.O.S. Observatory, Minneapolis\nH40 266.7306 0.82519 +0.56302 Nubbin Ridge Observatory\nH41 267.0742 0.81870 +0.57238 Petit Jean Mountain\nH42 267.5078 0.73568 +0.67512 Wartburg College Observatory, Waverly\nH43 267.4998 0.81918 +0.57163 Conway\nH44 267.7982 0.81880 +0.57220 Cascade Mountain\nH45 267.0831 0.81890 +0.57210 Arkansas Sky Obs., Petit Jean Mountain South\nH46 265.7297 0.77818 +0.62602 Ricky Observatory, Blue Springs\nH47 269.1439 0.84639 +0.53079 Vicksburg\nH48 265.0139 0.79424 +0.60565 PSU Greenbush Observatory, Pittsburg\nH49 266.8636 0.81712 +0.57457 ATU Astronomical Observatory, Russellville\nH50 267.541390.819253+0.571536University of Central Arkansas Obs., Conway\nH51 270.4003 0.73117 +0.68011 Greiner Research Observatory, Verona\nH52 270.673540.739151+0.671335Hawkeye Observatory, Durand\nH53 271.228420.789618+0.611581Thompsonville\nH54 271.6514 0.71305 +0.69883 Cedar Drive Observatory, Pulaski\nH55 271.8558 0.77283 +0.63254 Astronomical Research Observatory, Charleston\nH56 272.167640.742693+0.667433Northbrook Meadow Observatory\nH57 275.972460.758850+0.649150Ohio State University Observatory, Lima\nH58 273.3353 0.82349 +0.56548 NASA/MSFC ALaMO, Redstone Arsenal\nH59 273.3651 0.76362 +0.64356 Prairie Grass Observatory, Camp Cullom\nH60 273.865420.767435+0.639034Heartland Observatory, Carmel\nH61 281.416890.721533+0.690080Newcastle\nH62 274.4117 0.73335 +0.67763 Calvin College Observatory\nH63 274.9276 0.75227 +0.65672 DeKalb Observatory, Auburn\nH64 275.4364 0.77796 +0.62623 Thomas More College Observatory, Crestview Hills\nH65 275.4364 0.77995 +0.62381 Waltonfields Observatory, Walton\nH66 276.1460 0.76956 +0.63651 Yellow Springs\nH67 276.162410.740813+0.669522Stonegate Observatory, Ann Arbor\nH68 276.348240.854246+0.518152Red Barn Observatory, Ty Ty\nH69 276.944630.764320+0.642741Perkins Observatory, Delaware\nH70 277.4458 0.81412 +0.57897 Asheville\nH71 276.482820.852885+0.520378Chula\nH72 278.2258 0.89584 +0.44289 Evelyn L. Egan Observatory, Fort Myers\nH73 278.6351 0.74850 +0.66097 Lakeland Astronomical Observatory, Kirtland\nH74 278.8747 0.87602 +0.48066 Bar J Observatory, New Smyrna Beach\nH75 278.918560.749551+0.659816Indian Hill North Observatory, Huntsburg\nH76 279.4133 0.90197 +0.43036 Oakridge Observatory, Miami\nH77 279.7653 0.89877 +0.43695 Buehler Observatory\nH78 282.708961.000183+0.021030University of Narino Observatory, Pasto\nH79 280.492700.723258+0.688308York University Observatory, Toronto\nH80 285.335670.763194+0.644015Halstead Observatory, Princeton\nH81 283.615390.738959+0.671615Hartung-Boothroyd Observatory, Ithaca\nH82 281.7839 0.77836 +0.62576 CBA-NOVAC Observatory, Front Royal\nH83 282.6641 0.77926 +0.62463 Timberlake Observatory, Oakton\nH84 282.4961 0.73259 +0.67843 Northview Observatory, Mendon\nH85 283.0029 0.77784 +0.62638 Silver Spring\nH86 283.1576 0.77693 +0.62749 CBA-East Observatory, Laurel\nH87 282.4361 0.79309 +0.60708 Fenwick Observatory, Richmond\nH88 283.7577 0.77295 +0.63235 Hope Observatory, Belcamp\nH89 284.2975 0.70235 +0.70945 Galaxy Blues Observatory, Gatineau\nH90 284.4731 0.70267 +0.70914 Ottawa\nH91 285.048390.712263+0.699590Reynolds Observatory, Potsdam\nH92 285.6211 0.76785 +0.63849 Arcturus Observatory\nH93 285.5758 0.75934 +0.64853 Berkeley Heights\nH94 285.5439 0.75781 +0.65032 Cedar Knolls\nH95 285.821200.758745+0.649211NJIT Observatory, Newark\nH96 286.6142 0.69143 +0.72005 Observatoire des Pleiades, Mandeville\nH97 287.201320.746487+0.663233Talcott Mountain Science Center, Avon\nH98 287.2655 0.74987 +0.65938 Dark Rosanne Obs., Middlefield\nH99 288.8036 0.74040 +0.66992 Sunhill Observatory, Newton\nI00 288.2294 0.74794 +0.66157 Carbuncle Hill Observatory, Coventry\nI01 288.862530.740677+0.669630Clay Center Observatory, Brookline\nI02 289.1949 0.86558 -0.49976 Cerro Tololo Observatory, La Serena--2MASS\nI03 289.266260.873440-0.486052European Southern Obs., La Silla--ASTROVIRTEL\nI04 289.3152 0.86693 -0.49697 Mamalluca Observatory\nI05 289.2980 0.87559 -0.48217 Las Campanas Observatory-TIE\nI06 289.8061 0.74801 +0.66147 Werner Schmidt Obs., Dennis-Yarmouth Regional HS\nI07 288.0971 0.74279 +0.66735 Conlin Hill Observatory, Oxford\nI08 290.6932 0.85116 -0.52394 Alianza S4, Cerro Burek\nI09 289.803770.910166-0.413875Cerro Armazones\nI10 291.8200 0.92165 -0.38770 CAO, San Pedro de Atacama (until 2012)\nI11 289.263450.865020-0.500901Gemini South Observatory, Cerro Pachon\nI12 288.870530.736679+0.673998Phillips Academy Observatory, Andover\nI13 282.930060.779116+0.624793Burleith Observatory, Washington D.C.\nI14 288.589310.740298+0.670040Tigh Speuran Observatory, Framingham\nI15 288.700760.747034+0.662558Wishing Star Observatory, Barrington\nI16 291.820330.921638-0.387715IAA-AI Atacama, San Pedro de Atacama\nI17 284.322060.748993+0.660451Thomas G. Cupillari Observatory, Fleetville\nI18 281.3067 0.79038 +0.61070 Fan Mountain Observatory, Covesville\nI19 295.407110.854834-0.517422Observatorio El Gato Gris, Tanti\nI20 295.681610.838551-0.543122Observatorio Astronomico Salvador, Rio Cuarto\nI21 295.8281 0.85465 -0.51760 El Condor Observatory, Cordoba\nI22 296.1740 0.71212 +0.69973 Abbey Ridge Observatory, Stillwater Lake\nI23 292.266490.714173+0.697623Frosty Cold Observatory, Mash Harbor\nI24 282.2306 0.78534 +0.61702 Lake of the Woods Observatory, Locust Grove\nI25 295.443810.850887-0.523945ECCCO Observatory, Bosque Alegre\nI26 295.8214 0.85417 -0.51839 Observatorio Kappa Crucis, Cordoba\nI27 284.0006 0.70401 +0.70783 Barred Owl Observatory, Carp\nI28 289.0889 0.74643 +0.66324 Starhoo Observatory, Lakeville\nI29 288.633040.738432+0.672081Middlesex School Observatory, Concord\nI30 299.3417 0.83966 -0.54131 Observatorio Geminis Austral\nI31 299.3649 0.83995 -0.54086 Observatorio Astronomico del Colegio Cristo Rey\nI32 299.3464 0.83969 -0.54125 Observatorio Beta Orionis, Rosario\nI33 289.2608 0.86504 -0.50086 SOAR, Cerro Pachon\nI34 284.1297 0.76548 +0.64134 Morgantown\nI35 301.5572 0.82198 -0.56762 Sidoli\nI36 301.282710.819978-0.570483Observatorio Los Campitos, Canuelas\nI37 301.352750.825603-0.562360Astrodomi Observatory, Santa Rita\nI38 302.021410.854400-0.517885Observatorio Los Algarrobos, Salto\nI39 301.426610.823342-0.565652Observatorio Cruz del Sur, San Justo\nI40 289.260610.873472-0.485986La Silla--TRAPPIST\nI41 243.140220.836325+0.546877Palomar Mountain--PTF\nI42 288.9081 0.74895 +0.66041 Westport Observatory\nI43 261.902370.846901+0.530084Tarleton State University Obs., Stephenville\nI44 273.5176 0.86201 +0.50521 Northwest Florida State College, Niceville\nI45 301.4281 0.82326 -0.56577 Observatorio W Crucis, San Justo\nI46 281.6108 0.76192 +0.64558 The Cottage Observatory, Altoona\nI47 290.5503 0.81526 -0.57753 Pierre Auger Observatory, Malargue\nI48 295.6757 0.80340 -0.59348 Observatorio El Catalejo, Santa Rosa\nI49 253.986170.813183+0.580617Sunflower Observatory, Santa Fe\nI50 254.471420.840712+0.540309P2 Observatory, Mayhill\nI51 283.0547 0.78133 +0.62203 Clinton\nI52 249.211080.845113+0.533611Steward Observatory, Mt. Lemmon Station\nI53 356.3783 0.79822 +0.60052 Armilla\nI54 353.030810.779853+0.623912Observatorio Las Vaguadas, Badajoz\nI55 359.642140.772769+0.632566Valencia\nI56 357.710660.801182+0.596429Observatorio Astronomico John Beckman, Almeria\nI57 359.3256 0.78579 +0.61646 Elche\nI58 359.5374 0.77206 +0.63345 Betera\nI59 356.1558 0.72754 +0.68377 Observatorio Fuente de los matos, Muriedas\nI60 357.1781 0.67397 +0.73630 Guernanderf\nI61 352.1494 0.74047 +0.66989 Ourense\nI62 356.426390.767072+0.639561Observatorio Helios Ontigola\nI63 358.8330 0.62944 +0.77446 Cygnus Observatory, New Airesford\nI64 359.293860.623532+0.779182Maidenhead\nI65 355.0796 0.80245 +0.59491 Yunquera\nI66 312.0000 0.96235 -0.27153 Taurus Australis Observatory, Brasilia\nI67 359.087530.626440+0.776870Hartley Wintney\nI68 312.4981 0.96931 -0.24573 Pousada dos Anoes Observatory\nI69 352.0069 0.85232 +0.52140 AGM Observatory, Marrakech\nI70 359.941580.604128+0.794217Gedney House Observatory, Kirton\nI71 353.6698 0.77330 +0.63205 Observatorio Los Milanos, Caceres\nI72 355.9849 0.75923 +0.64893 Observatorio Carpe-Noctem, Madrid\nI73 359.587110.670611+0.739353Salvia Observatory, Saulges\nI74 358.187390.629588+0.774337Baxter Garden Observatory, Salisbury\nI75 359.9650 0.76735 +0.63910 Observatorio Castellon\nI76 355.936810.761573+0.646107Observatorio Tesla, Valdemorillo\nI77 316.0025 0.94119 -0.33714 CEAMIG-REA Observatory, Belo Horizonte\nI78 355.5721 0.80240 +0.59481 Observatorio Principia, Malaga\nI79 357.6733 0.78743 +0.61474 AstroCamp, Nerpio\nI80 358.133280.590762+0.804183Rose Cottage Observatory, Keighley\nI81 356.201110.533510+0.842967Tarbatness Observatory, Portmahomack\nI82 343.5797 0.88105 +0.47156 Guimar\nI83 353.1900 0.59630 +0.80008 Cherryvalley Observatory, Rathmolyon\nI84 353.0212 0.77967 +0.62415 Cerro del Viento, Badajoz\nI85 357.9848 0.80086 +0.59686 Las Negras\nI86 356.2739 0.76211 +0.64543 Observatorio UCM, Madrid\nI87 352.9593 0.60121 +0.79643 Astroshot Observatory, Monasterevin\nI88 356.0823 0.79287 +0.60753 Fuensanta de Martos\nI89 357.6739 0.78744 +0.61474 iTelescope Observatory, Nerpio\nI90 351.597600.618315+0.783298Blackrock Castle Observatory\nI91 357.692500.801192+0.596407Retamar\nI92 353.952890.795987+0.603315Astreo Observatory, Mairena del Aljarafe\nI93 359.797000.713711+0.698096St Pardon de Conques\nI94 356.1367 0.76162 +0.64603 Observatorio Rho Ophiocus, Las Rozas de Madrid\nI95 356.813940.771993+0.633666Observatorio de la Hita\nI96 356.503840.758233+0.649960Hyperion Observatory, Urbanizacion Caraquiz\nI97 359.501780.621889+0.780493Penn Heights Observatory, Rickmansworth\nI98 356.413390.757256+0.651181El Berrueco\nI99 356.460430.763221+0.644121Observatorio Blanquita, Vaciamadrid\nJ00 359.5056 0.76880 +0.63744 Segorbe\nJ01 354.284500.739938+0.670609Observatorio Cielo Profundo, Leon\nJ02 359.5550 0.78391 +0.61884 Busot\nJ03 355.132500.638787+0.766833Gothers Observatory, St. Dennis\nJ04 343.488170.881463+0.471461ESA Optical Ground Station, Tenerife\nJ05 355.296390.749617+0.659822Bootes Observatory, Boecillo\nJ06 358.812470.604374+0.794039Trent Astronomical Observatory, Clifton\nJ07 353.895430.767881+0.638546Observatorio SPAG Monfrague, Palazuelo-Empalme\nJ08 359.6549 0.77127 +0.63439 Observatorio Zonalunar, Puzol\nJ09 353.7917 0.59450 +0.80141 Balbriggan\nJ10 359.598390.784437+0.618151Alicante\nJ11 351.317690.746984+0.662617Matosinhos\nJ12 356.510610.758248+0.649949Caraquiz\nJ13 342.1208 0.87763 +0.47851 La Palma-Liverpool Telescope\nJ14 345.992810.880303+0.472891La Corte\nJ15 352.830610.755420+0.653125Muxagata\nJ16 354.203560.584292+0.808826An Carraig Observatory, Loughinisland\nJ17 357.203130.609723+0.790018Ragdon\nJ18 356.906000.609920+0.789845Dingle Observatory, Montgomery\nJ19 359.830360.764671+0.642359El Maestrat\nJ20 356.219260.762019+0.645541Aravaca\nJ21 356.080030.759065+0.649062El Boalo\nJ22 342.132350.878415+0.476543Tacande Observatory, La Palma\nJ23 358.493610.671765+0.738300Centre Astronomique de La Couyere\nJ24 343.557190.881661+0.470499Observatorio Altamira\nJ25 354.488830.728241+0.683076Penamayor Observatory, Nava\nJ26 356.981190.612507+0.787898The Spaceguard Centre, Knighton\nJ27 355.968990.760373+0.647528El Guijo Observatory\nJ28 356.213810.791408+0.609366Jaen\nJ29 346.342130.875695+0.481318Observatorio Nira, Tias\nJ30 356.293000.761925+0.645666Observatorio Ventilla, Madrid\nJ31 355.774110.802445+0.594759La Axarquia\nJ32 352.977690.796769+0.602268Aljaraque\nJ33 359.906000.620040+0.781953University of Hertfordshire Obs., Bayfordbury\nJ34 355.227110.748695+0.660858La Fecha\nJ35 356.029110.792167+0.608432Tucci Observatory, Martos\nJ36 356.945190.765179+0.641659Observatorio DiezALaOnce, Illana\nJ37 353.064690.796893+0.602104Huelva\nJ38 353.608900.726876+0.684507Observatorio La Vara, Valdes\nJ39 344.5636 0.88429 +0.46547 Ingenio\nJ40 355.558470.802546+0.594601Malaga\nJ41 353.8189 0.59779 +0.79897 Raheny\nJ42 359.6989 0.77138 +0.63425 Puzol\nJ43 352.133540.856441+0.515339Oukaimeden Observatory, Marrakech\nJ44 357.6552 0.73506 +0.67596 Observatorio Iturrieta, Alava\nJ45 344.6779 0.88370 +0.46678 Observatorio Montana Cabreja, Vega de San Mateo\nJ46 346.3594 0.87569 +0.48131 Observatorio Montana Blanca, Tias\nJ47 346.4440 0.87501 +0.48260 Observatorio Nazaret\nJ48 343.6960 0.87977 +0.47393 Observatory Mackay, La Laguna\nJ49 359.4482 0.78695 +0.61496 Santa Pola\nJ50 342.1176 0.87764 +0.47847 La Palma-NEON\nJ51 343.728980.879789+0.473809Observatorio Atlante, Tenerife\nJ52 358.6608 0.74198 +0.66826 Observatorio Pinsoro\nJ53 354.892780.791142+0.609607Posadas\nJ54 343.4906 0.88149 +0.47142 Bradford Robotic Telescope\nJ55 344.3144 0.88549 +0.46313 Los Altos de Arguineguin Observatory\nJ56 344.4536 0.88416 +0.46624 Observatorio La Avejerilla\nJ57 358.890890.767817+0.638833Centro Astronomico Alto Turia, Valencia\nJ58 356.6644 0.62304 +0.77959 Brynllefrith Observatory, Llantwit Fardre\nJ59 356.202560.726956+0.684386Observatorio Linceo, Santander\nJ60 354.3406 0.74773 +0.66201 Tocororo Observatory, Arquillinos\nJ61 353.4264 0.59719 +0.79942 Brownstown Observatory, Kilcloon\nJ62 351.6345 0.59017 +0.80459 Kingsland Observatory, Boyle\nJ63 359.4831 0.78548 +0.61683 San Gabriel\nJ64 359.3459 0.78871 +0.61271 La Mata\nJ65 353.4497 0.59830 +0.79860 Celbridge\nJ66 357.7833 0.61071 +0.78922 Kinver\nJ67 359.4667 0.77114 +0.63457 Observatorio La Puebla de Vallbona\nJ68 357.7055 0.61813 +0.78345 Tweenhills Observatory, Hartpury\nJ69 358.9803 0.63144 +0.77286 North Observatory, Clanfield\nJ70 358.8404 0.78968 +0.61149 Obs. Astronomico Vega del Thader, El Palmar\nJ71 357.8947 0.59350 +0.80217 Willow Bank Observatory\nJ72 358.9664 0.79065 +0.61028 Valle del Sol\nJ73 359.0833 0.6187  +0.7830  Quainton\nJ74 357.0961 0.72950 +0.68169 Bilbao\nJ75 357.434710.789388+0.612222OAM Observatory, La Sagra\nJ76 358.797180.790771+0.610163La Murta\nJ77 357.5947 0.63154 +0.77276 Golden Hill Observatory, Stourton Caundle\nJ78 358.8244 0.78887 +0.61253 Murcia\nJ79 358.380660.795516+0.603908Observatorio Calarreona, Aguilas\nJ80 359.1083 0.70862 +0.70323 Sainte Helene\nJ81 358.1350 0.7360  +0.6749  Guirguillano\nJ82 357.3067 0.5935  +0.8021  Leyland\nJ83 357.3883 0.59274 +0.80270 Olive Farm Observatory, Hoghton\nJ84 358.9803 0.63144 +0.77285 South Observatory, Clanfield\nJ85 357.4833 0.5666  +0.8213  Makerstoun\nJ86 356.6153 0.79930 +0.59968 Sierra Nevada Observatory\nJ87 355.5067 0.76047 +0.64753 La Canada\nJ88 358.5592 0.63165 +0.77266 Strawberry Field Obs., Southampton\nJ89 356.2861 0.76045 +0.64739 Tres Cantos Observatory\nJ90 358.5317 0.62251 +0.78000 West Challow\nJ91 357.0483 0.7411  +0.6692  Alt emporda Observatory, Figueres\nJ92 359.3487 0.62214 +0.78031 Beaconsfield\nJ93 357.7426 0.61927 +0.78255 Mount Tuffley Observatory, Gloucester\nJ94 357.7886 0.61909 +0.78270 Abbeydale\nJ95 358.553000.624147+0.778709Great Shefford\nJ96 356.056690.735326+0.675690Observatorio de Cantabria\nJ97 359.5333 0.7754  +0.6293  Alginet\nJ98 359.5344 0.77275 +0.63259 Observatorio Manises\nJ99 359.578080.772589+0.632790Burjassot\nK01   0.620910.618636+0.783060Astrognosis Observatory, Bradwell\nK02   0.667610.622858+0.779718Eastwood Observatory, Leigh on Sea\nK03   0.744110.744133+0.665979Observatori AAS Montsec\nK04   0.744160.744130+0.665983Lo Fossil Observatory, Ager\nK05   1.023110.610689+0.789233Eden Observatory, Banham\nK07   2.4614 0.65973 +0.74902 Observatoire de Gravelle, St. Maurice\nK08   1.8800 0.75142 +0.65773 Observatorio Lledoner, Vallirana\nK09   2.2400 0.74889 +0.66051 Llica d'Amunt\nK10   5.4214 0.71851 +0.69332 Micro Palomar, Reilhanette\nK11   2.880790.697458+0.714390Observatoire de Pommier\nK12   2.7267 0.77121 +0.63447 Obsevatorio Astronomico de Marratxi\nK13   2.9124 0.77015 +0.63575 Albireo Observatory, Inca\nK14   2.9131 0.77090 +0.63485 Observatorio de Sencelles\nK15   3.755220.725152+0.686311Murviel-les-Montpellier\nK16   5.421060.718540+0.693283Reilhanette\nK17   7.026790.692802+0.718806Observatoire des Valentines, Bex\nK18   7.5242 0.67588 +0.73460 Hesingue\nK19   5.647310.720582+0.691187PASTIS Observatory, Banon\nK20   4.680150.642261+0.763954Danastro Observatory, Romeree\nK21   4.9292 0.72101 +0.69061 Saint-Saturnin-les-Avignon\nK22   5.076110.724222+0.687283Les Barres Observatory, Lamanon\nK23   9.4023 0.70168 +0.71014 Gorgonzola\nK24   6.860690.651487+0.756168Schmelz\nK25   5.7136 0.72157 +0.69014 Haute Provence Sud, Saint-Michel-l'Observatoire\nK26   6.2201 0.64965 +0.75775 Contern\nK27   6.2094 0.68296 +0.72816 St-Martin Observatory, Amathay Vesigneux\nK28   6.8947 0.63326 +0.77137 Sternwarte Eckdorf\nK29   7.783470.696415+0.715918Stellarium Gornergrat\nK30   7.148390.682674+0.728365Luscherz\nK31   7.003610.713656+0.698546Osservatorio Astronomico di Bellino\nK32   7.529640.716152+0.695733Maritime Alps Observatory, Cuneo\nK33   7.497610.715775+0.696117San Defendente\nK34   7.7005 0.70697 +0.70492 Turin\nK35   8.163690.639883+0.765937Huenfelden\nK36   8.248870.645167+0.761522Ebersheim\nK37   8.3148 0.70738 +0.70449 Cereseto\nK38   8.5511 0.70189 +0.71002 M57 Observatory, Saltrio\nK39   8.955560.714080+0.697844Serra Observatory\nK40   9.0135 0.66228 +0.74685 Altdorf\nK41   8.7930 0.71113 +0.70075 Vegaquattro Astronomical Obs., Novi Ligure\nK42   8.3332 0.65685 +0.75151 Knielingen\nK43   9.8389 0.69215 +0.71970 OVM Observatory, Chiesa in Valmalencom\nK44   9.973310.615161+0.785779Marienburg Sternwarte, Hildesheim\nK45  10.498140.733299+0.677639Oss. Astronomico di Punta Falcone, Piombino\nK46  10.9114 0.64561 +0.76115 Bamberg\nK47  10.688220.724257+0.687222BSCR Observatory, Santa Maria a Monte\nK48  10.838810.705714+0.706127Keyhole Observatory, San Giorgio di Mantova\nK49  11.185810.724381+0.687146Carpione Observatory, Spedaletto\nK50  11.133000.646903+0.760116Sternwarte Feuerstein, Ebermannstadt\nK51  11.6579 0.69563 +0.71626 Osservatorio del Celado, Castello Tesino\nK52   7.6478 0.70548 +0.70642 Gwen Observatory, San Francesco al Campo\nK53  12.045640.744479+0.665409Marina di Cerveteri\nK54  11.336780.728803+0.682494Astronomical Observatory University of Siena\nK55   7.765000.645586+0.761172Wallhausen\nK56  12.704970.732993+0.678008Osservatorio di Foligno\nK57  13.0444 0.69854 +0.71317 Fiore Observatory\nK58   7.4497 0.62655 +0.77685 Gevelsberg\nK59  13.277440.620411+0.781663Elsterland Observatory, Jessnigk\nK60  13.510690.568623+0.819848Lindby\nK61  13.6026 0.64741 +0.75967 Rokycany Observatory\nK62  13.846750.635514+0.769557Teplice Observatory\nK63  10.4620 0.71953 +0.69218 G. Pascoli Observatory, Castelvecchio Pascoli\nK64  11.743970.644963+0.761748Waizenreuth\nK65  12.2339 0.71879 +0.69290 Cesena\nK66  12.628610.750491+0.658684Osservatorio Astronomico di Anzio\nK67  13.3610 0.65835 +0.75036 Bayerwald Sternwarte, Spiegelau\nK68  14.905120.759709+0.648110Osservatorio Elianto, Pontecagnano\nK69  10.9941 0.62938 +0.77452 Riethnordhausen\nK70  15.9736 0.78375 +0.61901 Rosarno\nK71  12.2159 0.65748 +0.75101 Neutraubling\nK72  16.3396 0.77485 +0.63021 Celico\nK73  16.4158 0.75789 +0.65029 Gravina in Puglia\nK74  10.2364 0.64667 +0.76025 Muensterschwarzach Observatory, Schwarzach\nK75  11.7289 0.68897 +0.72269 Astro Dolomites, Santa Cristina Valgardena\nK76   7.628980.713488+0.698410BSA Osservatorio, Savigliano\nK77  11.2903 0.64680 +0.76019 EHB01 Observatory, Engelhardsberg\nK78   9.853560.718987+0.692718iota Scorpii Observatory, La Spezia\nK79  11.057890.631175+0.773097Erfurt\nK80  16.637330.610859+0.789111Platanus Observatory, Lusowko\nK82  17.5894 0.75937 +0.64854 Alphard Observatory, Ostuni\nK83  11.043170.723487+0.688080Beppe Forti Astronomical Observatory, Montelupo\nK88  19.8936 0.67154 +0.73869 GINOP-KHK, Piszkesteto\nK90  20.545770.714093+0.697776Sopot Astronomical Observatory\nK91  20.810190.845561-0.532618Sutherland-LCOGT A\nK92  20.810040.845561-0.532618Sutherland-LCOGT B\nK93  20.810110.845560-0.532620Sutherland-LCOGT C\nK94  20.810970.845561-0.532606Sutherland\nK95  20.811060.845555-0.532613MASTER-SAAO Observatory, Sutherland\nK99  22.453500.663064+0.746102ISON-Uzhgorod Observatory\nL04  23.596400.685544+0.725675ROASTERR-1 Observatory, Cluj-Napoca\nL08  24.394470.497926+0.864325Metsahovi Optical Telescope, Metsahovi\nL13  25.621930.700409+0.711479Stardust Observatory, Brasov\nL15  25.978390.708234+0.703665St. George Observatory, Ploiesti\nL16  26.045610.705820+0.706098Stardreams Observatory, Valenii de Munte\nL21  27.421280.720179+0.691479Ostrov Observatory, Constanta\nL22  27.669530.692963+0.718573Barlad Observatory\nL23  27.8319 0.70211 +0.70968 Schela Observatory\nL24  27.9289 0.89882 -0.43743 Gauteng\nL33  29.9546 0.67379 +0.73646 Ananjev\nL35  30.5086 0.64055 +0.76537 DreamSky Observatory, Lisnyky\nL50  34.0114 0.71157 +0.70039 GenShtab Observatory, Nauchnij\nL51  34.0164 0.71169 +0.70028 MARGO, Nauchnij\nL71  38.5839 0.71089 +0.70101 Vedrus Observatory, Azovskaya\nL96  44.2745 0.76340 +0.64416 ISON-Byurakan Observatory\nN27  73.7253 0.57847 +0.81298 Omsk-Yogik Observatory\nN30  74.3694 0.85369 +0.51909 Zeds Astronomical Observatory, Lahore\nN42  76.971810.732126+0.679511Tien-Shan Astronomical Observatory\nN50  78.963830.842176+0.538692Himalayan Chandra Telescope, IAO, Hanle\nN55  80.026230.846497+0.532089Corona Borealis Observatory, Ngari\nN87  87.175030.727076+0.684720Nanshan Station, Xinjiang Observatory\nO43  99.781110.994005+0.109127Observatori Negara, Langkawi\nO44 100.0310 0.89435 +0.44698 Lijiang Station, Yunnan Observatories\nO45 100.032610.894444+0.446808Yunnan-HK Observatory, Gaomeigu\nO50 101.439420.998617+0.052565Hin Hua Observatory, Klang\nO75 107.051800.672284+0.738151ISON-Hureltogoot Observatory\nP25 118.312740.910976+0.411089Kinmen Educational Remote Observatory, Jincheng\nP34 120.320310.855040+0.516826Lvye Observatory, Suzhou\nP35 120.556990.913398+0.405722Cuteip Remote Observatory, Changhua\nP36 120.626690.855207+0.516553ULTRA Observatory,Suzhou\nP40 121.539580.905916+0.422185Chinese Culture University, Taipei\nP73 129.0820 0.81744 +0.57412 BSH Byulsem Observatory, Busan\nQ11 137.520690.820236+0.570158Shinshiro\nQ19 139.4390 0.81430 +0.57852 Machida\nQ21 139.853350.804747+0.591654Southern Utsunomiya\nQ24 140.5236 0.81099 +0.58310 Katori\nQ33 142.482780.715989+0.695814Nayoro Observatory, Hokkaido University\nQ38 143.5506 0.81654 -0.57538 Swan Hill\nQ59 149.070810.855626-0.516197Siding Spring-LCOGT Clamshell #2\nQ60 149.069000.855626-0.516198ISON-SSO Observatory, Siding Spring\nQ61 149.0619 0.85564 -0.51618 PROMPT, Siding Spring\nQ62 149.064420.855629-0.516206iTelescope Observatory, Siding Spring\nQ63 149.070640.855632-0.516202Siding Spring-LCOGT A\nQ64 149.070780.855632-0.516202Siding Spring-LCOGT B\nQ65 149.193130.855519-0.516201Warrumbungle Observatory\nQ68 150.337420.832917-0.551813Blue Mountains Observatory, Leura\nQ79 152.8481 0.88871 -0.45696 Samford Valley Observatory\nQ80 153.2160 0.88762 -0.45904 Birkdale\nR57 170.472780.720489-0.691309Aorangi Iti Observatory, Lake Tekapo\nR58 170.490390.697579-0.714138Beverly-Begg Observatory, Dunedin\nT04 203.742490.936241+0.351538Haleakala-LCOGT OGG B #2\nT05 203.742990.936235+0.351547ATLAS-HKO, Haleakala\nT08 204.4236 0.94329 +0.33246 ATLAS-MLO, Mauna Loa\nT09 204.523980.941706+0.337237Mauna Kea-UH/Tholen NEO Follow-Up (Subaru)\nT12 204.530570.941729+0.337199Mauna Kea-UH/Tholen NEO Follow-Up (2.24-m)\nT14 204.531130.941714+0.337236Mauna Kea-UH/Tholen NEO Follow-Up (CFHT)\nU53 237.1603 0.70274 +0.70909 Murray Hill Observatory, Beaverton\nU54 237.312860.782952+0.620081Hume Observatory, Santa Rosa\nU56 237.869170.795044+0.604511Palo Alto\nU57 237.841280.795776+0.603616Black Mountain Observatory, Los Altos\nU63 239.194560.681217+0.729770Burnt Tree Hill Observatory, Cle Elum\nU64 239.461510.683272+0.727821CWU-Lind Observatory, Ellensburg\nU69 240.5870 0.79904 +0.59962 iTelescope SRO Observatory, Auberry\nU73 241.6172 0.83164 +0.55346 Redondo Beach\nU78 242.8449 0.82758 +0.55989 Cedar Glen Observatory\nU79 242.791870.838837+0.542598Cosmos Research Center, Encinitas\nU80 243.6151 0.82737 +0.56004 CS3-DanHenge Observatory, Landers\nU81 243.615140.827367+0.560037CS3-Trojan Station, Landers\nU82 243.615190.827368+0.560036CS3-Palmer Divide Station, Landers\nU96 246.686000.579007+0.812698Athabasca University Geophysical Observatory\nV02 248.057940.835743+0.547377Command Module, Tempe\nV03 248.3314 0.79889 +0.59979 Big Water\nV05 248.631950.836631+0.546101Rusty Mountain Observatory, Gold Canyon\nV07 249.1219 0.85208 +0.52234 Whipple Observatory, Mount Hopkins-PAIRITEL\nV08 249.339000.848249+0.528126Mountain Creek Ranch, Vail\nV30 254.471050.840710+0.540313Heaven on Earth Observatory, Mayhill\nV31 254.4750 0.84061 +0.54046 Hazardous Observatory, Mayhill\nV37 255.984830.861053+0.507428McDonald Observatory-LCOGT ELP\nV59 261.0734 0.86642 +0.49781 Millwood Observatory, Comfort\nV60 261.094730.862140+0.505126Putman Mountain Observatory\nV70 263.335720.870056+0.491332Starry Night Observatory, Columbus\nV78 265.1081 0.70015 +0.71169 Spirit Marsh Observatory. Sauk Centre\nV81 265.7604 0.80902 +0.58590 Fayetteville\nV83 266.257280.781733+0.621590Rolling Hills Observatory, Warrensburg\nV86 266.8927 0.78221 +0.62099 Rattle Snake Observatory, Sedalia\nV88 267.428110.820618+0.569618River Ridge Observatory, Conway\nW04 271.009440.761606+0.645927Mark Evans Observatory, Bloomington\nW08 271.883310.747086+0.662545Jimginny Observatory, Naperville\nW11 272.6247 0.75272 +0.65618 Northwest Indiana Robotic Telescope, Lowell\nW14 273.245110.821914+0.567774Harvest\nW19 274.372830.740783+0.669559Kalamazoo\nW22 275.004470.844595+0.533635WestRock Observatory, Columbus\nW25 275.635060.776417+0.628165RMS Observatory, Cincinnati\nW28 276.3883 0.83011 +0.55581 Ex Nihilo Observatory, Winder\nW30 276.771170.838735+0.542749Georgia College Observatory, Milledgeville\nW34 277.8453 0.81784 +0.57360 Squirrel Valley Observatory, Columbus\nW38 278.585310.807479+0.588163Dark Sky Observatory, Boone\nW46 280.411920.818614+0.572448Foxfire Village\nW49 281.067570.778794+0.625380CBA-MM Observatory, Mountain Meadows\nW50 281.254040.813127+0.580167Apex\nW54 282.289440.785431+0.616890Mark Slade Remote Observatory, Wilderness\nW55 282.583890.773703+0.631447Natelli Observatory, Frederick\nW63 284.309580.996767+0.082976Observatorio Astronomico UTP, Pereira\nW66 285.053810.756278+0.652109SVH Observatory, Blairstown\nW67 285.102110.759453+0.648444Paul Robinson Observatory, Voorhees State Park\nW71 285.992970.717404+0.694456Rand II Observatory, Lake Placid\nW77 287.4010 0.75196 +0.65702 Skyledge Observatory, Killingworth\nW80 288.7678 0.74138 +0.66885 Westwood\nW81 288.999670.724557+0.686948Nebula Knoll Observatoy, East Wakefield\nW82 288.878040.736419+0.674274Mendel Observatory, Merrimack College\nW83 288.697470.740821+0.669461Whitin Observatory, Wellesley\nW84 289.193580.865572-0.499793Cerro Tololo-DECam\nW85 289.195190.865591-0.499760Cerro Tololo-LCOGT A\nW86 289.195330.865592-0.499759Cerro Tololo-LCOGT B\nW87 289.195320.865591-0.499761Cerro Tololo-LCOGT C\nW88 289.465700.837136-0.545574Slooh.com Chile Observatory, La Dehesa\nW89 289.195330.865589-0.499764Cerro Tololo-LCOGT Aqawan A #1\nW90 289.058140.732740+0.678229Phillips Exeter Academy Grainger Observatory\nW91 289.602570.910007-0.414148VHS-VISTA, Cerro Paranal\nW92 290.673570.850987-0.524150MASTER-OAFA Observatory, San Juan\nW94 291.820190.921646-0.387713AMACS1, San Pedro de Atacama\nW95 291.820120.921639-0.387712Observatorio Panameno, San Pedro de Atacama\nW96 291.820060.921637-0.387717CAO, San Pedro de Atacama (since 2013)\nW97 291.820240.921638-0.387716Atacama Desert Observatory, San Pedro de Atacama\nW98 291.820300.921639-0.387712Polonia Observatory, San Pedro de Atacama\nW99 291.820150.921638-0.387716SON, San Pedro de Atacama Station\nX13 295.4498 0.85269 -0.52103 Observatorio Remoto Bosque Alegre\nX14 295.832220.854475-0.517879Observatorio Orbis Tertius, Cordoba\nX38 301.137110.825648-0.562299Observatorio Pueyrredon, La Lonja\nX50 303.824190.821025-0.568999Observatorio Astronomico de Montevideo\nX57 305.406260.903659-0.426885Polo Astronomico CMF,Foz do Iguacu\nX87 312.0889 0.96218 -0.27210 Dogsheaven Observatory, Brasilia\nX88 312.491310.918012-0.395458Observatorio Adhara, Sorocaba\nY00 315.215040.935906-0.351562SONEAR Observatory, Oliveira\nY28 321.3126 0.98840 -0.15179 OASI, Nova Itacuruba\nZ18 342.108110.877671+0.478415Gran Telescopio Canarias, Roque de los Muchachos\nZ19 342.110940.877701+0.478380La Palma-TNG\nZ20 342.1217 0.87763 +0.47850 La Palma-MERCATOR\nZ21 343.488300.881468+0.471452Tenerife-LCOGT Aqawan A #1\nZ22 343.4894 0.88148 +0.47143 MASTER-IAC Observatory, Tenerife\nZ26 343.389690.883010+0.467899Observatorio Astronomico Arcangel, Las Zocas\nZ27 343.6998 0.87976 +0.47393 Observatorio Coralito, La Laguna\nZ39 346.4989 0.87535 +0.48189 Observatorio Costa Teguise\nZ44 351.672480.728723+0.682549Observatorio Terminus, A Coruna\nZ45 355.142640.804657+0.591779Cosmos Observatory, Marbella\nZ46 356.807000.623612+0.779131Cardiff\nZ47 357.2925 0.59846 +0.79849 Runcorn\nZ48 359.749150.623799+0.778975Northolt Branch Observatory 2, Shepherd's Bush\nZ49 357.406310.591893+0.803336Alston Observatory\nZ50 355.284310.744053+0.666069Mazariegos\nZ51 356.4486 0.76313 +0.64423 Anunaki Observatory, Rivas Vaciamadrid\nZ52 359.338990.604299+0.794113The Studios Observatory, Grantham\nZ53 352.1336 0.85645 +0.51534 TRAPPIST-North, Oukaimeden\nZ54 358.922140.623422+0.779306Greenmoor Observatory, Woodcote\nZ55 354.9150 0.79391 +0.60604 Uraniborg Observatory, Ecija\nZ56 350.2119 0.61577 +0.78529 Knocknaboola\nZ57 355.425890.803207+0.593753Observatorio Zuben, Alhaurin de la Torre\nZ58 355.630680.762093+0.645483ESA Cebreros TBT Observatory, Cebreros\nZ59 357.715400.599292+0.797871Chelford Observatory\nZ60 357.8506 0.73205 +0.67900 Observatorio Zaldibia\nZ61 359.064000.748594+0.660857Montecanal Observatory, Zaragoza\nZ62 351.629120.737181+0.673585Observatorio Forcarei\nZ63 358.470020.746291+0.663495Skybor Observatory, Borja\nZ64 352.1424 0.74016 +0.67021 Observatorio el Miron del Cielo\nZ65 352.172520.741388+0.668906Observatorio Astronomico Corgas\nZ66 355.591560.783284+0.619848DeSS Deimos Sky Survey, Niefla Mountain\nZ67 353.523140.597320+0.799328Dunboyne Castle Observatory\nZ68 353.4003 0.77964 +0.62418 Observatorio Torreaguila, Barbano\nZ69 353.1870 0.79823 +0.60034 Observatorio Mazagon Huelva\nZ70 353.357110.737583+0.673113Ponferrada\nZ71 353.609720.773272+0.632064Observatorio Norba Caesarina, Aldea Moret\nZ72 353.888640.599295+0.797856Cademuir Observatory, Dalkey\nZ73 353.967310.795365+0.604101Observatorio Nuevos Horizontes, Camas\nZ74 354.1562 0.79610 +0.60315 Amanecer de Arrakis\nZ75 354.4676 0.73736 +0.67346 Observatorio Sirius, Las Lomas\nZ76 354.5644 0.72675 +0.68460 Observatorio Carda, Villaviciosa\nZ77 354.889580.797212+0.601739Osuna\nZ78 358.324200.788031+0.613690Arroyo Observatory, Arroyo Hurtado\nZ79 357.453270.797556+0.601783Calar Alto TNO Survey\nZ80 359.628080.623054+0.779568Northolt Branch Observatory\nZ81 355.732400.802530+0.594629Observatorio Estrella de Mar\nZ82 355.9573 0.80215 +0.59514 BOOTES-2 Observatory, Algarrobo\nZ83 356.2881 0.76033 +0.64755 Chicharronian 3C Observatory, Tres Cantos\nZ84 357.451790.797523+0.601826Calar Alto-Schmidt\nZ85 356.750280.801058+0.596932Observatorio Sierra Contraviesa\nZ86 356.8900 0.62347 +0.77923 St. Mellons\nZ87 357.102100.608005+0.791293Stanley Laver Observatory, Pontesbury\nZ88 357.5101 0.62716 +0.77632 Fosseway Observatoy, Stratton-on-the-Fosse\nZ89 357.8281 0.59942 +0.79777 Macclesfield\nZ90 357.8482 0.79540 +0.60418 Albox\nZ91 358.749990.631731+0.772595Curdridge\nZ92 358.392220.591378+0.803713West Park Observatory, Leeds\nZ93 359.855890.782380+0.620769Observatorio Polop, Alicante\nZ94 358.8565 0.62725 +0.77623 Kempshott\nZ95 358.8909 0.76782 +0.63883 Astronomia Para Todos Remote Observatory\nZ96 359.193690.747818+0.661731Observatorio Cesaraugusto\nZ97 359.416470.704568+0.707270OPERA Observatory, Saint Palais\nZ98 359.5216 0.77156 +0.63405 Observatorio TRZ, Betera\nZ99 359.978740.595468+0.800687Clixby Observatory, Cleethorpes\n</pre>\n";
  var htmlsplit = lochtml.split("\n");
  var observatories = Array();
  for (var i = 2; i < htmlsplit.length - 1; i++) {
    obsname = htmlsplit[i].slice(30) + " [" + htmlsplit[i].slice(0, 3) + "]";
    var obslong = jQuery.trim(htmlsplit[i].slice(4, 13));
    var cosp = jQuery.trim(htmlsplit[i].slice(13, 21));
    var sinp = jQuery.trim(htmlsplit[i].slice(21, 30));
    if (cosp === "" || sinp === "") {
      continue;
    }
    cosp = parseFloat(cosp);
    sinp = parseFloat(sinp);
    if (cosp == 0.0 && sinp == 0.0) {
      continue;
    }
    var p = Math.sqrt(cosp * cosp + sinp * sinp);
    var obslat = ((180.0 / Math.PI) * Math.atan2(sinp / p, cosp / p)).toFixed(
      5
    );
    observatories.push(Array(obsname, obslong + "," + obslat));
  }
  observatories = observatories.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
  var obsstr = '<select class="obssel" id="inpobs" style="width:110px">';
  obsstr += '<option value="select">Observatories</option>';
  for (var i = 0; i < observatories.length; i++) {
    obsstr += '<option value="' + observatories[i][1] + '"';
    if (observatories[i][0].indexOf("Keck") != -1) {
      var obscoords = observatories[i][1];
      var obslong = obscoords.split(",")[0];
      var obslat = obscoords.split(",")[1];
      longitude = parseFloat(obslong);
      latitude = parseFloat(obslat);
      obsstr += " selected";
    }
    obsstr += ">" + observatories[i][0] + "</option>";
  }
  obsstr += "</select>";
  var monshort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var dayslist = Array.apply(null, Array(31)).map(function (_, i) {
    return i + 1;
  });
  var curdate = new Date();
  var curyear = curdate.getFullYear();
  var curmonth = curdate.getMonth();
  var curday = curdate.getDate();
  var yearslist = Array.apply(null, Array(1000)).map(function (_, i) {
    return curyear - i + 5;
  });
  var yearsstr = '<select class="obssel" id="inpyear">';
  for (var i = 0; i < yearslist.length; i++) {
    yearsstr += '<option value="' + yearslist[i] + '"';
    if (curyear - i + 5 == curyear) yearsstr += " selected";
    yearsstr += ">" + yearslist[i] + "</option>";
  }
  yearsstr += "</select>";
  var monsstr = '<select class="obssel" id="inpmon">';
  for (var i = 0; i < monshort.length; i++) {
    monsstr += '<option value="' + i + '"';
    if (i == curmonth) monsstr += " selected";
    monsstr += ">" + monshort[i] + "</option>";
  }
  monsstr += "</select>";
  var daysstr = '<select class="obssel" id="inpday">';
  for (var i = 0; i < dayslist.length; i++) {
    daysstr += '<option value="' + dayslist[i] + '"';
    if (i + 1 == curday) daysstr += " selected";
    daysstr += ">" + dayslist[i] + "</option>";
  }
  daysstr += "</select>";
  var footstring =
    '<table id="advancedtab"><tr><td><div id="obsfrom"><label><input type="checkbox" id="coordobservable">' +
    'Observable from</label> </div><span id="lonlat">' +
    '<input class="coordfield" id="inplon" incremental="incremental" title="Longitude (deg.)" placeholder="Longitude">, ' +
    '<input class="coordfield" id="inplat" incremental="incremental" title="Latitude (deg.)" placeholder="Latitude"><br>' +
    '<button type="button" id="locbutt" onclick="geoFindMe()"><span id="inpmessage">🌎 Use my location</span></button>' +
    obsstr +
    "</span>" +
    '<span id="obstime"><select id="nowon" class="obssel"><option value="now">now</option><option value="on">on</option></select>' +
    '<span id="ondate" style="display:none">' +
    yearsstr +
    monsstr +
    daysstr +
    ' at <input class="coordfield" id="inptime" title="24-hour time (hh:mm:ss)" value="00:00:00" placeholder="hh:mm:ss"> [UTC]</span>' +
    '<br><span id="suninfo"></span></span><br><span title="Exclude objects closer than 5&deg; from the Moon">' +
    '<label><input type="checkbox" id="farfrommoon"> Far from the Moon</label></span> ' +
    '<span title="Exclude objects closer than 5&deg; from the Sun">' +
    '<label><input type="checkbox" id="farfromsun"> Far from the Sun</label></span>' +
    '</td><td>Has <span id="prepost"><label><input type="checkbox" id="premaxphoto"> pre-</label> ' +
    '<label><input type="checkbox" id="postmaxphoto"> post-max</label> photometry' +
    '<br><label><input type="checkbox" id="premaxspectra"> pre-</label> ' +
    '<label><input type="checkbox" id="postmaxspectra"> post-max</label> spectroscopy' +
    '<br><input id="maxdayrange" size="7" value="0" type="search" incremental="incremental"> days before/after max</span>' +
    "</td></tr></table>";
  jQuery("div.coordfoot").html(footstring);
  var addmodalstring =
    '<div id="addmodalwindow" class="addmodal-bg">' +
    '<div class="addmodal-content">' +
    '<span class="addmodal-close">&times;</span>' +
    "<p>Specify object details below:</p>" +
    '<table id="addtable"><tr><th>' +
    sing +
    " name*</th>";
  for (var i = 0; i < quantityNames.length; i++) {
    addmodalstring += "<th>" + quantityNames[i] + "</th>";
  }
  addmodalstring +=
    '<th>Bibcode*</th></tr><tr><td><input type="text" id="objectname"></td>';
  for (var i = 0; i < quantityNames.length; i++) {
    addmodalstring +=
      '<td><input type="text" id="object' + quantityNames[i] + '"></td>';
  }
  addmodalstring +=
    '<td><input type="text" id="objectbibcode"></td></tr>' +
    "</table>" +
    "<p>* = Required</p>" +
    '<a class="dt-button" id="addgithub"><span>Submit to GitHub</span></a>' +
    "</div>" +
    "</div>";
  jQuery("div.addmodal").html(addmodalstring);
  table.on("responsive-resize.dt", function (e, settings, columns, state) {
    jQuery(table.column("name:name").footer())
      .find("th")
      .attr("display", "block");
  });
  table.columns().every(function (index) {
    var that = this;
    var isFirefox = typeof InstallTrigger !== "undefined";
    if (isFirefox) {
      jQuery("input", that.footer()).change(function () {
        if (index == 2) return;
        if (
          floatColInds.indexOf(index) === -1 &&
          stringColInds.indexOf(index) === -1 &&
          dateColInds.indexOf(index) === -1 &&
          raDecColInds.indexOf(index) === -1
        ) {
          if (that.search() !== this.value) {
            that.search(this.value);
          }
        }
        that.draw();
      });
    } else {
      jQuery("input", that.footer()).on("search", function () {
        if (index == 2) return;
        if (
          floatColInds.indexOf(index) === -1 &&
          stringColInds.indexOf(index) === -1 &&
          dateColInds.indexOf(index) === -1 &&
          raDecColInds.indexOf(index) === -1
        ) {
          if (that.search() !== this.value) {
            that.search(this.value);
          }
        }
        that.draw();
      });
    }
  });
  nameColumn = table.column("name:name").index();
  raColumn = table.column("ra:name").index();
  decColumn = table.column("dec:name").index();
  altColumn = table.column("altitude:name").index();
  aziColumn = table.column("azimuth:name").index();
  amColumn = table.column("airmass:name").index();
  sbColumn = table.column("skybrightness:name").index();
  jQuery.fn.dataTable.ext.search.push(function (
    oSettings,
    aData,
    iDataIndex,
    rowData
  ) {
    var alen = aData.length;
    for (var i = 0; i < alen; i++) {
      if (floatColInds.indexOf(i) !== -1) {
        if (
          !advancedFloatFilter(
            aData[i],
            floatColValDict[i],
            floatColValPMDict[i]
          )
        )
          return false;
      } else if (stringColInds.indexOf(i) !== -1) {
        if (
          !advancedStringFilter(
            aData[i],
            stringColValDict[i],
            stringColValPMDict[i]
          )
        )
          return false;
      } else if (dateColInds.indexOf(i) !== -1) {
        if (
          !advancedDateFilter(aData[i], dateColValDict[i], dateColValPMDict[i])
        )
          return false;
      } else if (raDecColInds.indexOf(i) !== -1) {
        if (
          !advancedRaDecFilter(
            aData[i],
            raDecColValDict[i],
            raDecColValPMDict[i]
          )
        )
          return false;
      }
    }
    if (document.getElementById("coordobservable").checked) {
      if (aData[raColumn] === null || aData[decColumn] === null) return false;
      if (aData[altColumn] !== "") {
        if (aData[altColumn] < 0.0) return false;
      }
      alt = getAlt(aData[raColumn], aData[decColumn]);
      if (alt < 0.0) return false;
    }
    if (document.getElementById("farfrommoon").checked) {
      alt = aData[altColumn];
      azi = aData[aziColumn];
      if (moonAlt != 0.0 && moonAzi != 0.0) {
        moondist = angDist(
          (Math.PI / 180.0) * azi,
          (Math.PI / 180.0) * alt,
          moonAzi,
          moonAlt
        );
        if (moondist < (5.0 * Math.PI) / 180.0) return false;
      }
    }
    if (document.getElementById("farfromsun").checked) {
      alt = aData[altColumn];
      azi = aData[aziColumn];
      if (sunAlt != 0.0 && sunAzi != 0.0) {
        sundist = angDist(
          (Math.PI / 180.0) * azi,
          (Math.PI / 180.0) * alt,
          sunAzi,
          sunAlt
        );
        if (sundist < (5.0 * Math.PI) / 180.0) return false;
      }
    }
    var maxdayrange = parseFloat(document.getElementById("maxdayrange").value);
    if (isNaN(maxdayrange)) maxdayrange = 0.0;
    if (document.getElementById("premaxphoto").checked) {
      if (!rowData.photolink) return false;
      var photosplit = rowData.photolink.split(",");
      if (photosplit.length < 2) return false;
      var premaxep = parseFloat(photosplit[1]);
      if (premaxep >= maxdayrange) return false;
    }
    if (document.getElementById("postmaxphoto").checked) {
      if (!rowData.photolink) return false;
      var photosplit = rowData.photolink.split(",");
      if (photosplit.length < 2) return false;
      var postmaxep = parseFloat(photosplit[photosplit.length == 3 ? 2 : 1]);
      if (postmaxep <= maxdayrange) return false;
    }
    if (document.getElementById("premaxspectra").checked) {
      if (!rowData.spectralink) return false;
      var spectrasplit = rowData.spectralink.split(",");
      if (spectrasplit.length < 2) return false;
      var premaxep = parseFloat(spectrasplit[1]);
      if (premaxep >= maxdayrange) return false;
    }
    if (document.getElementById("postmaxspectra").checked) {
      if (!rowData.spectralink) return false;
      var spectrasplit = rowData.spectralink.split(",");
      if (spectrasplit.length < 2) return false;
      var postmaxep = parseFloat(
        spectrasplit[spectrasplit.length == 3 ? 2 : 1]
      );
      if (postmaxep <= maxdayrange) return false;
    }
    return true;
  });
  function locTableUpdate() {
    updateLocation();
    altVisible = table.column(altColumn).visible();
    aziVisible = table.column(aziColumn).visible();
    amVisible = table.column(amColumn).visible();
    sbVisible = table.column(sbColumn).visible();
    if (
      document.getElementById("coordobservable").checked ||
      altVisible ||
      aziVisible ||
      amVisible ||
      sbVisible
    ) {
      table
        .rows()
        .invalidate("data")
        .every(function () {
          var d = this.data();
          delete d.altitude;
          delete d.azimuth;
          delete d.airmass;
          delete d.skybrightness;
        })
        .draw(false);
    }
  }
  table.on("search.dt", function () {
    searchFields = getSearchFields(allSearchCols);
    table.rows({ page: "current" }).invalidate();
  });
  jQuery("#premaxphoto, #postmaxphoto, #premaxspectra, #postmaxspectra").change(
    function () {
      table.draw();
    }
  );
  jQuery("#maxdayrange").on("input paste", function () {
    table.draw();
  });
  jQuery("#coordobservable, #farfrommoon, #farfromsun").change(function () {
    table.draw();
  });
  jQuery(
    "#inplon, #inplat, #inptime, #inpyear, #inpmon, #inpday, #nowon"
  ).change(function () {
    locTableUpdate();
  });
  jQuery("#inplon, #inplat").change(function () {
    jQuery("#inpobs").find("option:eq(0)").prop("selected", true);
  });
  jQuery("#inpobs").change(function () {
    var obscoords = jQuery("#inpobs").val();
    var obslong = obscoords.split(",")[0];
    var obslat = obscoords.split(",")[1];
    jQuery("#inplon").val(obslong);
    jQuery("#inplat").val(obslat);
    locTableUpdate();
  });
  jQuery("#nowon").change(function () {
    if (jQuery(this).val() == "on") {
      jQuery("#ondate").show();
    } else {
      jQuery("#ondate").hide();
    }
  });
  searchFields = getSearchFields(allSearchCols);
  var modal = document.getElementById("addmodalwindow");
  var span = document.getElementsByClassName("addmodal-close")[0];
  var addgithub = document.getElementById("addgithub");
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  addgithub.onclick = function () {
    var addname = document.getElementById("objectname").value;
    var addnamel = addname.toLowerCase();
    var quantities = Array();
    for (var i = 0; i < quantityNames.length; i++) {
      quantities.push([
        quantityNames[i],
        document.getElementById("object" + quantityNames[i]).value,
      ]);
    }
    var bibcode = document.getElementById("objectbibcode").value;
    if (addname === "") {
      alert("Please provide name.");
      return;
    }
    var oldnames = "";
    table.data().each(function (val, ind) {
      oldnames += "," + val["name"].toLowerCase();
      oldnames += "," + getAliases(val).join(",");
    });
    oldnames = oldnames.toLowerCase().split(",");
    if (oldnames.indexOf(addnamel) > -1) {
      alert(sing + " entry already exists.");
      return;
    }
    if (bibcode === "" || bibcode.length != 19) {
      alert("19 character bibcode required.");
      return;
    }
    eSN(addname, addname, ghpr, quantities, bibcode);
  };
  setInterval(function () {
    table.ajax.reload(null, false);
    table.draw(false);
  }, 14400000);
  setInterval(function () {
    if (
      document.getElementById("coordobservable").checked &&
      jQuery("#nowon").val() === "now"
    ) {
      table.draw(false);
    }
  }, 60000);
  updateLocation();
}); /*]]>*/
