/*<![CDATA[*/var searchFields; var stem = 'sne'; var modu = 'supernovae'; var subd = 'sne'; var ghpr = 'sne'; var invi = ["alias", "maxdate", "velocity", "maxabsmag", "masses", "hostra", "hostdec", "hostoffsetang", "hostoffsetdist", "references", "instruments", "ebv", "lumdist", "altitude", "azimuth", "airmass", "skybrightness", "discoverer"]; var visi = []; invi = jQuery(invi).not(visi).get(); var ocol = 'photolink'; var srtb = 'photolink'; var srtd = 'desc'; var nowr = ["maxdate", "discoverdate"]; var nwnm = ["download", "spectralink", "photolink", "radiolink", "xraylink"]; var revo = ["photolink", "spectralink", "radiolink", "xraylink"]; var plen = [10, 50, 250]; var shrt = 'SNe'; var sing = 'Supernova'; var outp = 'astrocats/astrocats/supernovae/output/'; var urlbase = 'https://' + subd + '.space/'; var urlstem = urlbase + stem + '/'; var nameColumn; var raColumn; var decColumn; var altColumn; var aziColumn; var amColumn; var sbColumn; var lst = 0.0; var longitude = 0.0; var latitude = 0.0; var moonAlt = 0.0; var moonAzi = 0.0; var sunAlt = 0.0; var sunAzi = 0.0; var moonPhaseAlpha = 0.0; var moonPhaseIcon = ''; function updateLocation() {
    var sunmoontxt = document.getElementById("suninfo"); var lat = document.getElementById("inplat"); var lon = document.getElementById("inplon"); latitude = parseFloat((lat.value === '') ? latitude : lat.value); longitude = parseFloat((lon.value === '') ? longitude : lon.value); if (lat.value === '' && latitude != 0.0) lat.value = latitude; if (lon.value === '' && longitude != 0.0) lon.value = longitude; var j2000 = new Date(Date.UTC(2000, 0, 1, 12)); var nowon = document.getElementById("nowon"); if (nowon.value === "on") { var year = parseInt(document.getElementById("inpyear").value); var month = parseInt(document.getElementById("inpmon").value); var day = parseInt(document.getElementById("inpday").value); var time = document.getElementById("inptime").value.split(":"); var hour = (time.length > 0 && time[0] !== '') ? parseInt(time[0]) : 0; var minute = (time.length > 1 && time[1] !== '') ? parseInt(time[1]) : 0; var second = (time.length > 2 && time[2] !== '') ? parseInt(time[2]) : 0; var testdate = new Date(); var seldate = new Date(Date.UTC(year, month, day, hour, minute, second)); } else { var seldate = new Date(); }
    var ut = new Date(seldate.getTime()); var j2000d = (ut.getTime() - j2000.getTime()) / 86400000.0; var dechours = ut.getUTCHours() + ut.getUTCMinutes() / 60.0 + ut.getUTCSeconds() / 3600.0; lst = (100.46 + 0.985647 * j2000d + longitude + 15.0 * dechours) % 360.0; if (lst < 0) lst += 360; var sunpos = SunCalc.getPosition(seldate, latitude, longitude); var moonpos = SunCalc.getMoonPosition(seldate, latitude, longitude); var moonill = SunCalc.getMoonIllumination(seldate); var moonphase = moonill.phase; moonPhaseAlpha = moonill.angle; var times = SunCalc.getTimes(seldate, latitude, longitude); var start = seldate; moonAlt = moonpos.altitude; moonAzi = (moonpos.azimuth < Math.PI) ? Math.PI + moonpos.azimuth : moonpos.azimuth - Math.PI; sunAlt = sunpos.altitude; sunAzi = (sunpos.azimuth < Math.PI) ? Math.PI + sunpos.azimuth : sunpos.azimuth - Math.PI; var timesofday = [[times.nightEnd.getTime(), ' 🌃 Nighttime'], [times.sunrise.getTime(), ' 🌄 Dawn twilight'], [times.sunset.getTime(), ' ☀️ Daytime'], [times.night.getTime(), ' 🌆 Dusk twilight'],]; var sunriseStr = ' 🌃 Nighttime'; for (var i = timesofday.length - 1; i >= 0; i--) {
      if (seldate.getTime() < timesofday[i][0]) { continue; }
      if (i < timesofday.length - 1) { sunriseStr = timesofday[i + 1][1]; }
      break;
    }
    moonPhaseIcon = '◌'; moonPhaseDesc = 'No Moon'; if (moonAlt > 0.0) {
      var moonphases = [[0.035, '🌑', 'New Moon'], [0.2, '🌒', 'Waxing crescent'], [0.3, '🌓', 'First quarter'], [0.465, '🌔', 'Waxing gibbous'], [0.535, '🌕', 'Full Moon'], [0.7, '🌖', 'Waning gibbous'], [0.8, '🌗', 'Last quarter'], [0.965, '🌘', 'Waning crescent']]; var moonStr = '🌑 New Moon'; for (var i = moonphases.length - 1; i >= 0; i--) {
        if (moonphase < moonphases[i][0]) { continue; }
        if (i < moonphases.length - 1) { moonPhaseIcon = moonphases[i + 1][1]; moonPhaseDesc = moonphases[i + 1][2]; }
        break;
      }
    }
    sunmoontxt.innerHTML = sunriseStr + ', ' + moonPhaseIcon + ' ' + moonPhaseDesc;
  }
  function angDist(lon1, lat1, lon2, lat2) {
    var dlon = Math.abs(lon2 - lon1); var dlat = Math.abs(lat2 - lat1); var dist = Math.abs(Math.atan2(Math.pow(Math.pow(Math.cos(lat2) * Math.sin(dlon), 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon), 2), 0.5), Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dlon)))
    return dist;
  }
  function getAlt(ra, dec) { var ha = lst - ra; if (ha < 0) ha += 360; var lat = latitude * Math.PI / 180.0; ha *= Math.PI / 180.0; dec *= Math.PI / 180.0; return (180.0 / Math.PI) * Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha)); }
  function getAzi(ra, dec) { var ha = lst - ra; var lat = latitude * Math.PI / 180.0; ha *= Math.PI / 180.0; dec *= Math.PI / 180.0; var alt = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha)); var azi = (180.0 / Math.PI) * Math.acos((Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat))); if (Math.sin(ha) > 0.0) azi = 360 - azi; return azi; }
  function geoFindMe() {
    var lat = document.getElementById("inplat"); var lon = document.getElementById("inplon"); var message = document.getElementById("inpmessage"); var locbutt = document.getElementById("locbutt"); if (!navigator.geolocation) { message.innerHTML = "Geolocation is not supported by your browser"; return; }
    function success(position) { latitude = position.coords.latitude; longitude = position.coords.longitude; lat.value = latitude; lon.value = longitude; jQuery('#inplon').trigger('change'); message.innerHTML = "🌎  Use my location"; locbutt.disabled = false; updateLocation(); }
    function error() { message.innerHTML = "Unable to retrieve your location"; }
    message.innerHTML = "<img style='vertical-align:-26%; padding-right:3px; width:16px' src='" + urlbase + "wp-content/plugins/transient-table/loading.gif'>Finding your location..."; locbutt.disabled = true; navigator.geolocation.getCurrentPosition(success, error);
  }
  function getSearchFields(allSearchCols) {
    var sf = {}; var alen = allSearchCols.length; sf['search'] = jQuery('.dataTables_filter input'); for (i = 0; i < alen; i++) { var col = allSearchCols[i]; objID = document.getElementById(col); sf[col] = document.getElementById(col); }
    return sf;
  }
  function getQueryParams(qs) {
    qs = qs.split("+").join(" "); var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g; while (tokens = re.exec(qs)) { params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]); }
    return params;
  }
  function noBreak(str) { return str.replace(/ /g, "&nbsp;").replace(/-/g, "&#x2011;"); }
  function someBreak(str) { return str.replace(/([+-])/g, "&#8203;$1"); }
  function nameToFilename(name) { return name.replace(/\//g, '_') }
  function dateToMJD(da) { var mydate = new Date(da); return mydate.getJulian() - 2400000.5; }
  function getAliases(row, field) {
    if (field === undefined) field = 'alias'; var aliases = []; if (!(field in row)) { return aliases; }
    for (i = 0; i < row[field].length; i++) { if (typeof row[field][i] === 'string') { aliases.push(row[field][i]); } else { aliases.push(row[field][i].value); } }
    return aliases;
  }
  function getAliasesOnly(row, field) {
    if (field === undefined) field = 'alias'; var aliases = []; if (!(field in row)) { return aliases; }
    for (i = 1; i < row[field].length; i++) { if (typeof row[field][i] === 'string') { aliases.push(row[field][i]); } else { aliases.push(row[field][i].value); } }
    return aliases;
  }
  function eventAliases(row, type, full, meta, field) { if (field === undefined) field = 'alias'; if (!(field in row)) return ''; if (!row[field]) return ''; var aliases = getAliases(row, field); return aliases.join(', '); }
  function eventAliasesOnly(row, type, full, meta, field) { if (field === undefined) field = 'alias'; if (!(field in row)) return ''; if (!row[field]) return ''; if (row[field].length > 1) { var aliases = getAliasesOnly(row, field); return aliases.join(', '); } else return ''; }
  function goToEvent(id) { var ddl = document.getElementById(id); var selectedVal = ddl.options[ddl.selectedIndex].value; window.open(urlstem + encodeURIComponent(selectedVal) + '/', '_blank'); }
  function nameLinkedName(row, type, full, meta) { return nameLinked(row, type, full, meta, 'name', 'alias'); }
  function nameLinkedName1(row, type, full, meta) { return nameLinked(row, type, full, meta, 'name1', 'aliases1'); }
  function nameLinkedName2(row, type, full, meta) { return nameLinked(row, type, full, meta, 'name2', 'aliases2'); }
  function nameLinked(row, type, full, meta, namefield, aliasfield) { if (namefield === undefined) namefield = 'name'; if (aliasfield === undefined) aliasfield = 'alias'; if (row[aliasfield].length > 1) { var aliases = getAliasesOnly(row, aliasfield); return "<div class='tooltip'><a href='" + urlstem + nameToFilename(row[namefield]) + "/' target='_blank'>" + noBreak(row[namefield]) + "</a><span class='tooltiptext'> " + aliases.map(noBreak).join(', ') + "</span></div>"; } else { return "<a href='" + urlstem + nameToFilename(row[namefield]) + "/' target='_blank'>" + noBreak(row[namefield]) + "</a>"; } }
  function nameSwitcherName(data, type, row, meta) { return nameSwitcher(data, type, row, meta, 'name', 'alias'); }
  function nameSwitcherName1(data, type, row, meta) { return nameSwitcher(data, type, row, meta, 'name1', 'aliases1'); }
  function nameSwitcherName2(data, type, row, meta) { return nameSwitcher(data, type, row, meta, 'name2', 'aliases2'); }
  function nameSwitcher(data, type, row, meta, namefield, aliasfield) {
    var html = ''; if (namefield === undefined) namefield = 'name'; if (aliasfield === undefined) aliasfield = 'alias'; if ((type === 'display' || type === 'sort')) {
      if (row[aliasfield] !== undefined && row[aliasfield].length > 1) {
        var idObj = searchFields[namefield]; var filterTxt = searchFields['search'].val().toUpperCase().replace(/"/g, ''); var idObjTxt = (idObj === null) ? '' : idObj.value.toUpperCase().replace(/"/g, ''); var txts = [filterTxt, idObjTxt]; var tlen = txts.length; for (var t = 0; t < tlen; t++) {
          var txt = txts[t]; if (txt !== "") {
            var aliases = getAliases(row, aliasfield); var primaryname = row[namefield]; var alen = aliases.length; for (var a = 0; a < alen; a++) { if (aliases[a].toUpperCase().indexOf(txt) !== -1) { primaryname = aliases[a]; break; } }
            if (type === 'sort') { html = primaryname; break; }
            var otheraliases = []; for (var a = 0; a < alen; a++) {
              if (aliases[a].toUpperCase() === primaryname.toUpperCase()) { continue; }
              otheraliases.push(noBreak(aliases[a]));
            }
            html = "<div class='tooltip'><a href='" + urlstem + nameToFilename(row[namefield]) + "/' target='_blank'>" + primaryname + "</a><span class='tooltiptext'> " + otheraliases.join(', ') + "</span></div>"; break;
          }
        }
      }
      if (html === '') { if (type === 'display') { html = nameLinked(row, null, null, null, namefield, aliasfield); } else html = row[namefield]; }
    } else if (type === 'filter') { html = eventAliases(row, null, null, null, aliasfield); }
    if (html === '') html = row[namefield]; return html;
  }
  function hostLinked(row, type, full, meta) {
    var host = "<a class='" + (('kind' in row.host[0] && row.host[0]['kind'] == 'cluster') ? "hci" : "hhi") + "' href='" + urlstem + nameToFilename(row.name) + "/' target='_blank'></a>&nbsp;"; var mainHost = "<a href='http://simbad.u-strasbg.fr/simbad/sim-basic?Ident=" +
      encodeURIComponent(row.host[0]['value']) + "&submit=SIMBAD+search' target='_blank'>" + someBreak(row.host[0]['value']) + "</a>"; var hostImg = (row.ra && row.dec) ? ("<div class='tooltipimg' " + "style='background-image:url(" + urlbase + outp + 'html/' + nameToFilename(row.name) + "-host.jpg);'></div>") : ""; var hlen = row.host.length; if (hlen > 1) {
        var hostAliases = ''; for (var i = 1; i < hlen; i++) { if (i != 1) hostAliases += ', '; hostAliases += noBreak(row.host[i]['value']); }
        return "<div class='tooltip'>" + host + mainHost + "<span class='tooltiptext'> " +
          hostImg + 'AKA: ' + hostAliases + "</span></div>";
      } else {
        if (hostImg) {
          return "<div class='tooltip'>" + host + mainHost + "<span class='tooltiptext'> " +
            hostImg + "</span></div>";
        } else return host + mainHost;
    }
  }
  function hostSwitcher(data, type, row, meta) {
    if (!row.host) return ''; var hlen = row.host.length; if ((type === 'display' || type === 'sort')) {
      if (hlen > 1) {
        var mainHost = "<a href='http://simbad.u-strasbg.fr/simbad/sim-basic?Ident=%s&submit=SIMBAD+search' target='_blank'>%s</a>"; var hostImg = (row.ra && row.dec) ? ("<div class='tooltipimg' " + "style=background-image:url(" + urlbase + outp + 'html/' + nameToFilename(row.name) + "-host.jpg);'></div>") : ""; var idObj = searchFields['host']; var filterTxt = searchFields['search'].val().toUpperCase().replace(/"/g, ''); var idObjTxt = (idObj === null) ? '' : idObj.value.toUpperCase().replace(/"/g, ''); var txts = [filterTxt, idObjTxt]; var tlen = txts.length; for (var t = 0; t < tlen; t++) {
          var txt = txts[t]; if (txt !== "") {
            var aliases = []; for (i = 0; i < hlen; i++) { aliases.push(row.host[i]['value']); }
            var primaryname = aliases[0]; var primarykind = ('kind' in row.host[0]) ? row.host[0]['kind'] : ''; var alen = aliases.length; for (var a = 1; a < alen; a++) { if (aliases[a].toUpperCase().indexOf(txt) !== -1) { primaryname = aliases[a]; primarykind = ('kind' in row.host[a]) ? row.host[a]['kind'] : ''; break; } }
            if (type === 'sort') { return primaryname; }
            var otheraliases = []; for (var a = 0; a < alen; a++) {
              if (aliases[a].toUpperCase() === primaryname.toUpperCase()) { continue; }
              otheraliases.push(noBreak(aliases[a]));
            }
            var host = "<a class='" + ((primarykind == 'cluster') ? "hci" : "hhi") + "' href='" + urlstem + nameToFilename(row.name) + "/' target='_blank'></a> "; return "<div class='tooltip'>" + host + mainHost.replace(/%s/g, primaryname) + "<span class='tooltiptext'> " +
              hostImg + 'AKA: ' + otheraliases.join(', ') + "</span></div>";
          }
        }
      }
      if (type === 'display') { return hostLinked(row); }
      if (!row.host[0]) return ''; return row.host[0].value;
    } else if (type === 'filter') {
      var hostAliases = []; for (var a = 0; a < hlen; a++) { hostAliases.push(row.host[a].value); }
      return hostAliases.join(', ');
    }
    if (!row.host[0]) return ''; return row.host[0].value;
  }
  function typeLinked(row, type, full, meta) {
    var clen = row.claimedtype.length; if (clen > 1) {
      var altTypes = ''; for (var i = 1; i < clen; i++) { if (i != 1) altTypes += ', '; altTypes += noBreak(row.claimedtype[i]['value']); }
      return "<div class='tooltip'>" + noBreak(row.claimedtype[0]['value']) + "</a><span class='tooltiptext'> " + altTypes + "</span></div>";
    } else if (row.claimedtype[0]) { return row.claimedtype[0]['value']; }
    return '';
  }
  function typeSwitcher(data, type, row, meta) {
    if (!row.claimedtype) return ''; var clen = row.claimedtype.length; if (clen === 0) return ''; if ((type === 'display' || type === 'sort')) {
      if (clen > 1) {
        var idObj = searchFields['claimedtype']; var filterTxt = searchFields['search'].val().toUpperCase().replace(/"/g, ''); var idObjTxt = (idObj === null) ? '' : idObj.value.toUpperCase().replace(/"/g, ''); var txts = [filterTxt, idObjTxt]; var tlen = txts.length; for (var t = 0; t < tlen; t++) {
          var txt = txts[t]; if (txt !== "") {
            var types = []; for (i = 0; i < clen; i++) { types.push(row.claimedtype[i]['value']); }
            var primarytype = types[0]; var ylen = types.length; for (var a = 1; a < ylen; a++) { if (types[a].toUpperCase().indexOf(txt) !== -1) { primarytype = types[a]; break; } }
            if (type === 'sort') { return primarytype; }
            var othertypes = []; for (var a = 0; a < ylen; a++) {
              if (types[a].toUpperCase() === primarytype.toUpperCase()) { continue; }
              othertypes.push(types[a]);
            }
            return "<div class='tooltip'>" + primarytype + "<span class='tooltiptext'> " + othertypes + "</span></div>";
          }
        }
      }
      if (type === 'display') { return typeLinked(row); }
      return row.claimedtype[0].value;
    } else if (type === 'filter') {
      var allTypes = []; for (var a = 0; a < clen; a++) { allTypes.push(row.claimedtype[a].value); }
      return allTypes.join(', ');
    }
    return row.claimedtype[0].value;
  }
  function noBlanksNumRender(data, type, row) {
    if (type === 'sort') { if (data === '' || data === null || typeof data !== 'string') return NaN; return parseFloat(String(data).split(',')[0].replace(/<(?:.|\n)*?>/gm, '').trim()); }
    return data;
  }
  function noBlanksStrRender(data, type, row) {
    if (type === 'sort') { if (data === '' || data === null || typeof data !== 'string') return NaN; return String(data).split(',')[0].replace(/<(?:.|\n)*?>/gm, '').trim(); }
    return data;
  }
  function raToDegrees(data) {
    var str = data.trim(); var parts = str.split(':'); var value = 0.0; if (parts.length >= 1) { value += 360. / 24. * Number(parts[0]); var sign = 1.0; if (parts[0][0] == '-') { var sign = -1.0; } }
    if (parts.length >= 2) { value += sign * Number(parts[1]) * 360. / (24 * 60.); }
    if (parts.length >= 3) { value += sign * Number(parts[2]) * 360. / (24 * 3600.); }
    return value;
  }
  function decToDegrees(data) {
    var str = data.trim(); var parts = str.split(':'); var value = 0.0; if (parts.length >= 1) { value += Number(parts[0]); var sign = 1.0; if (parts[0][0] == '-') { var sign = -1.0; } }
    if (parts.length >= 2) { value += sign * Number(parts[1]) / 60.; }
    if (parts.length >= 3) { value += sign * Number(parts[2]) / 3600.; }
    return value;
  }
  jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "non-empty-string-asc": function (str1, str2) {
      if (isNaN(str1) && isNaN(str2))
        return 0; if (isNaN(str1))
        return 1; if (isNaN(str2))
        return -1; return ((str1 < str2) ? -1 : ((str1 > str2) ? 1 : 0));
    }, "non-empty-string-desc": function (str1, str2) {
      if (isNaN(str1) && isNaN(str2))
        return 0; if (isNaN(str1))
        return 1; if (isNaN(str2))
        return -1; return ((str1 < str2) ? 1 : ((str1 > str2) ? -1 : 0));
    }, "non-empty-float-asc": function (v1, v2) {
      if (isNaN(v1) && isNaN(v2))
        return 0; if (isNaN(v1))
        return 1; if (isNaN(v2))
        return -1; return ((v1 < v2) ? -1 : ((v1 > v2) ? 1 : 0));
    }, "non-empty-float-desc": function (v1, v2) {
      if (isNaN(v1) && isNaN(v2))
        return 0; if (isNaN(v1))
        return 1; if (isNaN(v2))
        return -1; return ((v1 < v2) ? 1 : ((v1 > v2) ? -1 : 0));
    }
  }); function compDates(date1, date2, includeSame) {
    var d1; var d1split = date1.split('/'); var d1len = d1split.length; if (d1len == 1) { d1 = new Date(date1 + '/12/31'); } else if (d1len == 2) { var daysInMonth = new Date(d1split[0], d1split[1], 0).getDate(); d1 = new Date(date1 + '/' + String(daysInMonth)); } else { d1 = new Date(date1); }
    var d2; var d2split = date2.split('/'); var d2len = d2split.length; if (d2len == 1) { d2 = new Date(date2 + '/12/31'); } else if (d2len == 2) { var daysInMonth = new Date(d2split[0], d2split[1], 0).getDate(); d2 = new Date(date2 + '/' + String(daysInMonth)); } else { d2 = new Date(date2); }
    if (includeSame) { return d1.getTime() <= d2.getTime(); } else { return d1.getTime() < d2.getTime(); }
  }
  function convertRaDec(radec, ra) {
    if (ra !== null && ra) { return raToDegrees(radec); }
    return decToDegrees(radec);
  }
  function compRaDecs(radec1inp, radec2inp, includeSame) { var val1 = convertRaDec(radec1inp); var val2 = convertRaDec(radec2inp); if (includeSame) { return val1 <= val2; } else { return val1 < val2; } }
  function advancedDateFilter(data, id, pmid) {
    var idObj = document.getElementById(id); var pmidString = ''; if (typeof pmid !== 'undefined') { var pmidObj = document.getElementById(pmid); if (pmidObj !== null) { pmidString = pmidObj.value; } }
    if (idObj === null) return true; var idString = idObj.value; if (idString === '') return true; var isNot = (idString.indexOf('!') !== -1 || idString.indexOf('NOT') !== -1)
    idString = idString.replace(/!/g, ''); var splitString = idString.split(/(?:,|OR)+/); var splitData = data.split(/(?:,|OR)+/); var sdlen = splitData.length; for (var d = 0; d < sdlen; d++) {
      var cData = splitData[d].trim(); var sslen = splitString.length; for (var i = 0; i < sslen; i++) {
        if (splitString[i].indexOf('-') !== -1) { var splitRange = splitString[i].split('-'); var minStr = splitRange[0].replace(/[<=>]/g, '').trim(); var maxStr = splitRange[1].replace(/[<=>]/g, '').trim(); if (minStr !== '') { if (!((minStr !== '' && compDates(cData, minStr, true)) || (maxStr !== '' && compDates(maxStr, cData, true)) || cData === '')) return !isNot; } }
        else if (pmidString !== '') { minMJD = dateToMJD(splitString[i]) - parseFloat(pmidString); maxMJD = dateToMJD(splitString[i]) + parseFloat(pmidString); cMJD = dateToMJD(cData); if (cMJD >= minMJD && cMJD <= maxMJD) { return !isNot; } else { return isNot; } }
        var idStr = splitString[i].replace(/[<=>]/g, '').trim(); if (idStr === "" || idStr === NaN || idStr === '-') { if (i === 0) return !isNot; }
        if (idStr === "" || idStr === NaN) { if (i === 0) return !isNot; }
        else {
          if (splitString[i].indexOf('<=') !== -1) { if (compDates(cData, idStr, true)) return !isNot; }
          else if (splitString[i].indexOf('<') !== -1) { if (compDates(cData, idStr, false)) return !isNot; }
          else if (splitString[i].indexOf('>=') !== -1) { if (compDates(idStr, cData, true)) return !isNot; }
          else if (splitString[i].indexOf('>') !== -1) { if (compDates(idStr, cData, false)) return !isNot; }
          else {
            if (idStr.indexOf('"') !== -1) { idStr = String(idStr.replace(/"/g, '').trim()); if (cData === idStr) return !isNot; }
            else { if (cData.indexOf(idStr) !== -1) return !isNot; }
          }
        }
      }
    }
    return isNot;
  }
  function advancedRaDecFilter(data, id, pmid) {
    var ra = (id.indexOf('ra') !== -1); var idObj = document.getElementById(id); var pmidString = ''; if (typeof pmid !== 'undefined') { var pmidObj = document.getElementById(pmid); if (pmidObj !== null) { pmidString = pmidObj.value; } }
    if (idObj === null) return true; var idString = idObj.value; if (idString === '') return true; var isNot = (idString.indexOf('!') !== -1 || idString.indexOf('NOT') !== -1)
    idString = idString.replace(/!/g, ''); var splitString = idString.split(/(?:,|OR)+/); var splitData = data.split(/(?:,|OR)+/); var sdlen = splitData.length; for (var d = 0; d < sdlen; d++) {
      var cData = splitData[d].trim(); var sslen = splitString.length; for (var i = 0; i < sslen; i++) {
        var cleanString = splitString[i].trim().replace(/\s+/g, ':').replace(/[hm]/g, ':'); if (!ra) cleanString = cleanString.replace(/[dm]/g, ':').replace(/s$/, ''); cleanString = cleanString.replace(/s$/, ''); if (cleanString.indexOf('-') !== -1) { var splitRange = cleanString.split('-'); var minStr = splitRange[0].replace(/[<=>]/g, '').trim(); var maxStr = splitRange[1].replace(/[<=>]/g, '').trim(); if (minStr !== '') { if (!((minStr !== '' && compRaDecs(cData, minStr, true)) || (maxStr !== '' && compRaDecs(maxStr, cData, true)) || cData === '')) return !isNot; } }
        else if (pmidString !== '') {
          var coorVal = convertRaDec(cleanString, ra); minCoord = coorVal - parseFloat(pmidString); maxCoord = coorVal + parseFloat(pmidString); cCoord = convertRaDec(cData, ra); if (cCoord == 0.0) { return isNot; }
          if (ra && minCoord < 0.0) { if ((cCoord >= minCoord && cCoord <= maxCoord) || (cCoord >= 360.0 + minCoord)) { return !isNot; } else { return isNot; } } else if (ra && maxCoord > 360.0) { if ((cCoord >= minCoord && cCoord <= maxCoord) || (cCoord <= maxCoord - 360.0)) { return !isNot; } else { return isNot; } } else { if (cCoord >= minCoord && cCoord <= maxCoord) { return !isNot; } else { return isNot; } }
        }
        var idStr = cleanString.replace(/[<=>]/g, '').trim(); if (idStr === "" || idStr === NaN || idStr === '-') { if (i === 0) return !isNot; }
        if (idStr === "" || idStr === NaN) { if (i === 0) return !isNot; }
        else {
          if (cleanString.indexOf('<=') !== -1) { if (compRaDecs(cData, idStr, true)) return !isNot; }
          else if (cleanString.indexOf('<') !== -1) { if (compRaDecs(cData, idStr, false)) return !isNot; }
          else if (cleanString.indexOf('>=') !== -1) { if (compRaDecs(idStr, cData, true)) return !isNot; }
          else if (cleanString.indexOf('>') !== -1) { if (compRaDecs(idStr, cData, false)) return !isNot; }
          else {
            if (idStr.indexOf('"') !== -1) { idStr = String(idStr.replace(/"/g, '').trim()); if (cData === idStr) return !isNot; }
            else { if (cData.indexOf(idStr) !== -1) return !isNot; }
          }
        }
      }
    }
    return isNot;
  }
  function advancedStringFilter(data, id, prid) {
    var idObj = document.getElementById(id); var pridString = ''; if (typeof prid !== 'undefined') { var pridObj = document.getElementById(prid); if (pridObj !== null) { pridString = pridObj.value.trim().toUpperCase(); } }
    if (idObj === null) return true; var idString = idObj.value; if (idString === '' && pridString === '') return true; var splitString = idString.split(/(?:,|OR)+/); var splitData = data.split(','); var sdlen = splitData.length; for (var d = 0; d < sdlen; d++) {
      var cData = splitData[d].trim(); var uData = cData.toUpperCase(); var sslen = splitString.length; for (var i = 0; i < sslen; i++) {
        var idStr = splitString[i].trim().toUpperCase(); var isNot = (idStr.indexOf('!') !== -1 || idStr.indexOf('NOT') !== -1)
        idStr = idStr.replace(/!/g, ''); if (pridString !== '') { if (uData.substring(0, pridString.length) !== pridString) { continue; } }
        if (idStr === "" || idStr === NaN) { if (i === 0) return !isNot; }
        else {
          var lowData = cData.toUpperCase(); if (idStr.indexOf('"') !== -1) { idStr = idStr.replace(/"/g, ''); if (isNot) { return (lowData !== idStr); } else { if (lowData === idStr) return true; } }
          else { if (isNot) { return (lowData.indexOf(idStr) === -1); } else { if (lowData.indexOf(idStr) !== -1) return true; } }
        }
      }
    }
    return false;
  }
  function advancedFloatFilter(data, id, pmid) {
    var idObj = document.getElementById(id); var pmidString = ''; if (typeof pmid !== 'undefined') { var pmidObj = document.getElementById(pmid); if (pmidObj !== null) { ; pmidString = pmidObj.value; } }
    if (idObj === null) return true; var idString = idObj.value; if (idString === '') return true; var splitString = idString.split(/(?:,|OR)+/); var splitData = data.split(/(?:,|OR)+/); var sdlen = splitData.length; for (var d = 0; d < sdlen; d++) {
      var cData = splitData[d].trim(); var cVal = cData * 1.0; var sslen = splitString.length; for (var i = 0; i < sslen; i++) {
        var dashindex = splitString[i].indexOf('-'); if (dashindex !== -1 && dashindex !== 0) {
          var splitRange = splitString[i].split('-'); var newSplitRange = []; var srlen = splitRange.length; for (var j = 0; j < srlen; j++) { if (j < srlen - 1 && splitRange[j].length == 0) { splitRange[j + 1] = '-' + splitRange[j + 1]; } else { newSplitRange.push(splitRange[j]); } }
          splitRange = newSplitRange; var minStr = splitRange[0].replace(/[<=>]/g, '').trim(); var maxStr = splitRange[1].replace(/[<=>]/g, '').trim(); var minVal = parseFloat(minStr); var maxVal = parseFloat(maxStr); if (maxVal < minVal) { var temp = maxVal; maxVal = minVal; minVal = temp; }
          if (minStr !== '') { if (!((minStr !== '' && cVal < minVal) || (maxStr !== '' && cVal > maxVal))) return !isNot; }
        }
        else if (pmidString !== '') { minVal = parseFloat(splitString[i]) - parseFloat(pmidString); maxVal = parseFloat(splitString[i]) + parseFloat(pmidString); cVal = parseFloat(cData); if (cVal >= minVal && cVal <= maxVal) { return !isNot; } else { return isNot; } }
        var idStr = splitString[i].replace(/[<=>]/g, '').trim(); var isNot = (idStr.indexOf('!') !== -1 || idStr.indexOf('NOT') !== -1)
        idStr = idStr.replace(/!/g, ''); if (idStr === "" || idStr === NaN || idStr === '-') { if (i === 0) return true; }
        else {
          idVal = idStr * 1.0; if (splitString[i].indexOf('<=') !== -1) { if (idVal >= cVal) return true; }
          else if (splitString[i].indexOf('<') !== -1) { if (idVal > cVal) return true; }
          else if (splitString[i].indexOf('>=') !== -1) { if (cData === "") return false; if (idVal <= cVal) return true; }
          else if (splitString[i].indexOf('>') !== -1) { if (cData === "") return false; if (idVal < cVal) return true; }
          else {
            if (idStr.indexOf('"') !== -1) { idStr = String(idStr.replace(/"/g, '').trim()); if (isNot) { return (cData !== idStr); } else { if (cData === idStr) return true; } }
            else { if (isNot) { return (cData.indexOf(idStr) === -1); } else { if (cData.indexOf(idStr) !== -1) return true; } }
          }
        }
      }
    }
    return false;
  }
  function needAdvanced(str) { var advancedStrs = ['!', 'NOT', '-', 'OR', ',', '<', '>', '=']; return (advancedStrs.some(function (v) { return str === v; })); }
  /*]]>*/
