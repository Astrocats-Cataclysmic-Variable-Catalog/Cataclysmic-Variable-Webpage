jQuery(document).ready(function () {
  var floatColValDict = {};
  var floatColInds = [];
  var floatSearchCols = ["photocount", "spectracount", "metacount"];
  var stringColValDict = {};
  var stringColInds = [];
  var stringSearchCols = ["bibcode", "events", "types"];
  var raDecColValDict = {};
  var raDecColInds = [];
  var raDecSearchCols = [];
  var dateColValDict = {};
  var dateColInds = [];
  var dateSearchCols = [];
  var allSearchCols = floatSearchCols.concat(
    stringSearchCols,
    raDecSearchCols,
    dateSearchCols
  );
  jQuery("#example tfoot th").each(function (index) {
    var title = jQuery(this).text();
    var classname = jQuery(this).attr("class").split(" ")[0];
    if (["check", "responsive"].indexOf(classname) >= 0) {
      jQuery(this).html("");
    }
    if (["check", "responsive"].indexOf(classname) >= 0) return;
    var fslen = floatSearchCols.length;
    for (i = 0; i < fslen; i++) {
      if (jQuery(this).hasClass(floatSearchCols[i])) {
        floatColValDict[index] = floatSearchCols[i];
        floatColInds.push(index);
        break;
      }
    }
    var sslen = stringSearchCols.length;
    for (i = 0; i < sslen; i++) {
      if (jQuery(this).hasClass(stringSearchCols[i])) {
        stringColValDict[index] = stringSearchCols[i];
        stringColInds.push(index);
        break;
      }
    }
    var dslen = dateSearchCols.length;
    for (i = 0; i < dslen; i++) {
      if (jQuery(this).hasClass(dateSearchCols[i])) {
        dateColValDict[index] = dateSearchCols[i];
        dateColInds.push(index);
        break;
      }
    }
    var rdlen = raDecSearchCols.length;
    for (i = 0; i < rdlen; i++) {
      if (jQuery(this).hasClass(raDecSearchCols[i])) {
        raDecColValDict[index] = raDecSearchCols[i];
        raDecColInds.push(index);
        break;
      }
    }
    jQuery(this).html(
      '<input class="colsearch" type="search" id="' +
        classname +
        '" placeholder="' +
        title +
        '" />'
    );
  });
  function bibcodeLinked(row, type, full, meta) {
    var html = "";
    if (row.authors) {
      html += row.authors + "<br>";
    }
    return (
      html +
      "<a href='http://adsabs.harvard.edu/abs/" +
      row.bibcode +
      "'>" +
      row.bibcode +
      "</a>"
    );
  }
  function eventsDropdown(row, type, full, meta) {
    var elen = row.events.length;
    var html = String(elen) + " " + shrt + ": ";
    if (elen == 1) {
      html +=
        "<a href='" +
        urlstem +
        row.events[0] +
        "/' target='_blank'>" +
        row.events[0] +
        "</a>";
    } else if (elen <= 25) {
      for (i = 0; i < elen; i++) {
        if (i != 0) html += ", ";
        html +=
          "<a href='" +
          urlstem +
          row.events[i] +
          "/' target='_blank'>" +
          row.events[i] +
          "</a>";
      }
      html += "</select>";
      return html;
    } else {
      html +=
        '<br><select id="' + row.bibcode.replace(/\./g, "_") + '" size="3>"';
      for (i = 0; i < elen; i++) {
        html +=
          '<option value="' +
          row.events[i] +
          '">' +
          row.events[i] +
          "</option>";
      }
      html += '</select><br><a class="dt-button" ';
      html +=
        "onclick=\"goToEvent('" +
        row.bibcode.replace(/\./g, "_") +
        "');\"><span>Go to selected SN</span></a>";
      return html;
    }
    return html;
  }
  function allAuthors(row, type, full, meta) {
    var html = "";
    if (!row.allauthors) return "";
    var alen = row.allauthors.length;
    for (i = 0; i < alen; i++) {
      if (i > 0) html += ", ";
      html += row.allauthors[i];
    }
    return html;
  }
  function eventsDropdownType(row, type, full, meta) {
    if (type == "sort") {
      return "num";
    }
    return "string";
  }
  function eventsCount(row, type, full, meta) {
    return row.events.length;
  }
  var table = jQuery("#example").DataTable({
    ajax: {
      url:
        "https://depts.washington.edu/catvar/astrocats/cataclysmic/output/biblio.json",
      dataSrc: "",
    },
    columns: [
      { defaultContent: "", responsivePriority: 6 },
      {
        data: { display: bibcodeLinked, _: "bibcode" },
        type: "string",
        defaultContent: "",
        responsivePriority: 1,
      },
      { data: { _: "allauthors[; ]" }, type: "string", defaultContent: "" },
      {
        data: { display: eventsDropdown, sort: eventsCount, _: "events[, ]" },
        type: eventsDropdownType,
        defaultContent: "",
        responsivePriority: 2,
      },
      {
        data: { _: "types[, ]" },
        type: "string",
        defaultContent: "",
        responsivePriority: 2,
      },
      {
        data: { _: "photocount" },
        type: "num",
        defaultContent: "",
        responsivePriority: 2,
      },
      {
        data: { _: "spectracount" },
        type: "num",
        defaultContent: "",
        responsivePriority: 2,
      },
      {
        data: { _: "metacount" },
        type: "num",
        defaultContent: "",
        responsivePriority: 2,
      },
      { defaultContent: "" },
    ],
    dom: "Bflprtip",
    orderMulti: false,
    pagingType: "simple_numbers",
    pageLength: 50,
    searchDelay: 400,
    responsive: { details: { type: "column", target: -1 } },
    select: true,
    lengthMenu: [
      [10, 50, 250],
      [10, 50, 250],
    ],
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
      /*{ extend: "colvis", columns: ":not(:first-child):not(:last-child)" },*/
      {
        extend: "csv",
        text: "Export selected to CSV",
        exportOptions: {
          modifier: { selected: true },
          columns: ":visible:not(:first-child):not(:last-child)",
          orthogonal: "export",
        },
      },
    ],
    columnDefs: [
      { targets: 0, orderable: false, className: "select-checkbox" },
      { targets: ["allauthors", "events", "photocount", "spectracount"], visible: false },
      {
        targets: ["metacount"],
        orderSequence: ["desc", "asc"],
      },
      { className: "control", orderable: false, width: "2%", targets: -1 },
    ],
    select: { style: "os", selector: "td:first-child" },
    order: [[6, "desc"]],
  });
  table.columns().every(function (index) {
    var that = this;
    jQuery("input", that.footer()).on("input", function () {
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
  });
  jQuery.fn.dataTable.ext.search.push(function (oSettings, aData, iDataIndex) {
    var alen = aData.length;
    for (var i = 0; i < alen; i++) {
      if (floatColInds.indexOf(i) !== -1) {
        if (!advancedFloatFilter(aData[i], floatColValDict[i])) return false;
      } else if (stringColInds.indexOf(i) !== -1) {
        if (!advancedStringFilter(aData[i], stringColValDict[i])) return false;
      } else if (dateColInds.indexOf(i) !== -1) {
        if (!advancedDateFilter(aData[i], dateColValDict[i])) return false;
      } else if (raDecColInds.indexOf(i) !== -1) {
        if (!advancedRaDecFilter(aData[i], raDecColValDict[i])) return false;
      }
    }
    return true;
  });
});
