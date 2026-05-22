const PHP = "libs/php/";
var _activeTab = "personnel";

// ── Validation helper ────────
function validateField(selector, condition) {
  var $el = $(selector);
  if (!condition) {
    $el.addClass("is-invalid");
    return false;
  }
  $el.removeClass("is-invalid");
  return true;
}

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// Only letters, spaces, hyphens, apostrophes — min 2 chars
function isValidName(val) {
  return /^[a-zA-Z\s'\-]{2,}$/.test(val);
}

// Letters, numbers, spaces, common punctuation — min 2 chars
function isValidText(val) {
  return /^[a-zA-Z0-9\s'\-&(),./]{2,}$/.test(val);
}

// Escape user-supplied strings before inserting into HTML
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

$(document).on("hide.bs.modal", ".modal", function () {
  if (document.activeElement) document.activeElement.blur();
});

// Clear validation state when any modal closes
$(document).on("hidden.bs.modal", ".modal", function () {
  $(this).find(".is-invalid").removeClass("is-invalid");
});

// ── Save-button gating ────────
function checkAddPersonnelSave() {
  var fn = $("#addPersonnelFirstName").val().trim();
  var ln = $("#addPersonnelLastName").val().trim();
  var em = $("#addPersonnelEmailAddress").val().trim();
  var jt = $("#addPersonnelJobTitle").val().trim();
  var dept = $("#addPersonnelDepartment").val();
  var v1 =
    fn === "" ? true : validateField("#addPersonnelFirstName", isValidName(fn));
  var v2 =
    ln === "" ? true : validateField("#addPersonnelLastName", isValidName(ln));
  var v3 =
    em === ""
      ? true
      : validateField("#addPersonnelEmailAddress", isValidEmail(em));
  var v4 = jt === "" || validateField("#addPersonnelJobTitle", isValidText(jt));
  var ok =
    isValidName(fn) &&
    isValidName(ln) &&
    isValidEmail(em) &&
    (jt === "" || isValidText(jt)) &&
    dept !== "" &&
    dept !== null;
  $('[form="addPersonnelForm"][type="submit"]').prop("disabled", !ok);
}

function checkEditPersonnelSave() {
  var fn = $("#editPersonnelFirstName").val().trim();
  var ln = $("#editPersonnelLastName").val().trim();
  var em = $("#editPersonnelEmailAddress").val().trim();
  var jt = $("#editPersonnelJobTitle").val().trim();
  var dept = $("#editPersonnelDepartment").val();
  var v1 =
    fn === ""
      ? true
      : validateField("#editPersonnelFirstName", isValidName(fn));
  var v2 =
    ln === "" ? true : validateField("#editPersonnelLastName", isValidName(ln));
  var v3 =
    em === ""
      ? true
      : validateField("#editPersonnelEmailAddress", isValidEmail(em));
  var v4 =
    jt === "" || validateField("#editPersonnelJobTitle", isValidText(jt));
  var ok =
    isValidName(fn) &&
    isValidName(ln) &&
    isValidEmail(em) &&
    (jt === "" || isValidText(jt)) &&
    dept !== "" &&
    dept !== null;
  $('[form="editPersonnelForm"][type="submit"]').prop("disabled", !ok);
}

function checkAddDepartmentSave() {
  var sv = $("#addDepartmentNameSelect").val();
  var nn = $("#addDepartmentName").val().trim();
  var loc = $("#addDepartmentLocation").val();
  var v1 = sv !== "" && sv !== null;
  var v2 =
    sv !== "__new__" ||
    (nn === "" ? true : validateField("#addDepartmentName", isValidText(nn)));
  var ok =
    v1 && (sv !== "__new__" || isValidText(nn)) && loc !== "" && loc !== null;
  $('[form="addDepartmentForm"][type="submit"]').prop("disabled", !ok);
}

function checkEditDepartmentSave() {
  var name = $("#editDepartmentName").val().trim();
  var loc = $("#editDepartmentLocation").val();
  if (name !== "") validateField("#editDepartmentName", isValidText(name));
  $('[form="editDepartmentForm"][type="submit"]').prop(
    "disabled",
    !isValidText(name) || loc === "" || loc === null,
  );
}

function checkAddLocationSave() {
  var name = $("#addLocationName").val().trim();
  if (name !== "") validateField("#addLocationName", isValidText(name));
  $('[form="addLocationForm"][type="submit"]').prop(
    "disabled",
    !isValidText(name),
  );
}

function checkEditLocationSave() {
  var name = $("#editLocationName").val().trim();
  if (name !== "") validateField("#editLocationName", isValidText(name));
  $('[form="editLocationForm"][type="submit"]').prop(
    "disabled",
    !isValidText(name),
  );
}
// Disable save on open; wire live field checking inside each modal
$("#addPersonnelModal")
  .on("show.bs.modal", function () {
    $('[form="addPersonnelForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkAddPersonnelSave);

$("#editPersonnelModal")
  .on("show.bs.modal", function () {
    $('[form="editPersonnelForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkEditPersonnelSave);

$("#addDepartmentModal")
  .on("show.bs.modal", function () {
    $('[form="addDepartmentForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkAddDepartmentSave);

$("#editDepartmentModal")
  .on("show.bs.modal", function () {
    $('[form="editDepartmentForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkEditDepartmentSave);

$("#addLocationModal")
  .on("show.bs.modal", function () {
    $('[form="addLocationForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkAddLocationSave);

$("#editLocationModal")
  .on("show.bs.modal", function () {
    $('[form="editLocationForm"][type="submit"]').prop("disabled", true);
  })
  .on("input change", ".form-control, .form-select", checkEditLocationSave);

// ── Helpers ───────────
function showAlert(message, type) {
  if (type === "success") {
    $("#successToastMessage").text(message);
    var toast = new bootstrap.Toast(document.getElementById("successToast"), {
      delay: 3000,
    });
    toast.show();
  } else {
    showError(message);
  }
}

function showError(message) {
  $("#errorModalMessage").text(message);
  $("#errorModal").modal("show");
}

function getInitials(firstName, lastName) {
  return (
    (firstName ? firstName.charAt(0) : "") +
    (lastName ? lastName.charAt(0) : "")
  );
}

// ── Profile panel ────────

function openProfile(id) {
  $.ajax({
    url: PHP + "getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id: id },
    success: function (result) {
      if (result.status.code == 200) {
        var p = result.data.personnel[0];
        var initials = getInitials(p.firstName, p.lastName);

        $("#profileInitials").text(initials);
        $("#profileName").text(p.firstName + " " + p.lastName);
        $("#profileJobTitle").text(p.jobTitle || "—");
        $("#profileDepartment").text(p.department || "—");
        $("#profileLocation").text(p.location || "—");
        if (p.email) {
          $("#profileEmail").replaceWith(
            '<a id="profileEmail" class="detail-val detail-link" href="mailto:' +
              escapeHtml(p.email) +
              '" aria-label="Email ' +
              escapeHtml(p.firstName) +
              ": " +
              escapeHtml(p.email) +
              '">' +
              escapeHtml(p.email) +
              "</a>",
          );
        } else {
          $("#profileEmail").replaceWith(
            '<span id="profileEmail" class="detail-val">—</span>',
          );
        }

        // Set data-id on action buttons so show.bs.modal can read them
        $("#profileEditBtn").attr("data-id", p.id);
        $("#profileDeleteBtn")
          .attr("data-id", p.id)
          .attr("data-name", p.firstName + " " + p.lastName);

        $("#profilePanel, #profileBackdrop").addClass("open");
      } else {
        showError("Could not load personnel details.");
      }
    },
    error: function () {
      showError("Network error loading personnel details.");
    },
  });
}

function closeProfile() {
  $("#profilePanel, #profileBackdrop").removeClass("open");
}

$("#closeProfileBtn").click(function () {
  closeProfile();
});
$("#profileBackdrop").click(function () {
  closeProfile();
});

// Close profile when a modal opens from within it
$("#editPersonnelModal, #deletePersonnelModal").on(
  "show.bs.modal",
  function () {
    closeProfile();
  },
);

// ── Load personnel (card grid) ─────

function loadPersonnel(onLoaded) {
  // Show skeleton
  var skeletons = "";
  for (var i = 0; i < 8; i++) {
    skeletons +=
      '<div class="skeleton-card">' +
      '<div class="skeleton-circle"></div>' +
      '<div class="skeleton-line" style="width:' +
      (55 + Math.random() * 30).toFixed(0) +
      '%"></div>' +
      '<div class="skeleton-line" style="width:' +
      (40 + Math.random() * 25).toFixed(0) +
      '%"></div>' +
      "</div>";
  }
  $("#cardGrid").html(skeletons);

  $.ajax({
    url: PHP + "getAll.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data.length === 0) {
          $("#cardGrid").html(
            '<div class="empty-grid">' +
              '<i class="fa-solid fa-users-slash"></i>' +
              "<p>No personnel found.</p>" +
              "</div>",
          );
          return;
        }
        var cards = "";
        $.each(result.data, function (i) {
          var initials = getInitials(this.firstName, this.lastName);
          cards +=
            '<div class="emp-card" data-id="' +
            this.id +
            '" data-dept-id="' +
            (this.departmentID || "") +
            '" style="animation-delay:' +
            i * 30 +
            'ms">' +
            '<div class="card-avatar">' +
            escapeHtml(initials) +
            "</div>" +
            '<p class="card-name">' +
            escapeHtml(this.lastName) +
            ", " +
            escapeHtml(this.firstName) +
            "</p>" +
            '<p class="card-job">' +
            (this.jobTitle ? escapeHtml(this.jobTitle) : "—") +
            "</p>" +
            (this.department
              ? '<span class="card-dept">' +
                escapeHtml(this.department) +
                "</span>"
              : "") +
            '<p class="card-loc">' +
            (this.location ? escapeHtml(this.location) : "—") +
            "</p>" +
            "</div>";
        });
        $("#cardGrid").html(cards);
        if (typeof onLoaded === "function") {
          onLoaded();
        } else {
          filterPersonnel();
        }
      } else {
        $("#cardGrid").html(
          '<div class="empty-grid">' +
            '<i class="fa-solid fa-circle-exclamation"></i>' +
            "<p>Failed to load personnel.</p>" +
            "</div>",
        );
      }
    },
    error: function () {
      $("#cardGrid").html(
        '<div class="empty-grid">' +
          '<i class="fa-solid fa-wifi"></i>' +
          "<p>Network error. Please refresh.</p>" +
          "</div>",
      );
    },
  });
}

// Card click — open profile
$(document).on("click", ".emp-card", function () {
  openProfile($(this).attr("data-id"));
});

// ── Load departments ─────────

function loadDepartments(onLoaded) {
  $.ajax({
    url: PHP + "getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data.length === 0) {
          $("#departmentTableBody").html(
            '<tr class="empty-table-row"><td colspan="4">No departments found.</td></tr>',
          );
          return;
        }
        var rows = "";
        $.each(result.data, function () {
          rows +=
            "<tr>" +
            "<td>" +
            escapeHtml(this.name) +
            "</td>" +
            '<td class="text-center">' +
            (this.personnelCount || 0) +
            "</td>" +
            "<td>" +
            (this.location ? escapeHtml(this.location) : "—") +
            "</td>" +
            '<td><div class="btn-row">' +
            '<a href="#" class="view-dept-link me-auto" data-dept="' +
            escapeHtml(this.name) +
            '" data-dept-id="' +
            this.id +
            '">View <i class="fa-solid fa-arrow-right fa-fw"></i></a>' +
            '<button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' +
            this.id +
            '" title="Edit"><i class="fa-solid fa-pencil fa-fw"></i></button>' +
            '<button type="button" class="btn btn-delete" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' +
            this.id +
            '" data-name="' +
            escapeHtml(this.name) +
            '" title="Delete"><i class="fa-solid fa-trash fa-fw"></i></button>' +
            "</div></td>" +
            "</tr>";
        });
        $("#departmentTableBody").html(rows);
        if (typeof onLoaded === "function") {
          onLoaded();
        } else {
          filterDepartments();
        }
      } else {
        $("#departmentTableBody").html(
          '<tr class="empty-table-row"><td colspan="4">Failed to load departments.</td></tr>',
        );
      }
    },
    error: function () {
      $("#departmentTableBody").html(
        '<tr class="empty-table-row"><td colspan="4">Network error. Please refresh.</td></tr>',
      );
    },
  });
}

// ── Load locations ────────

function loadLocations() {
  $.ajax({
    url: PHP + "getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data.length === 0) {
          $("#locationTableBody").html(
            '<tr class="empty-table-row"><td colspan="3">No locations found.</td></tr>',
          );
          return;
        }
        var rows = "";
        $.each(result.data, function () {
          var deptLabel =
            this.deptCount == 1 ? "1 dept" : (this.deptCount || 0) + " depts";
          rows +=
            "<tr>" +
            "<td>" +
            escapeHtml(this.name) +
            "</td>" +
            "<td>" +
            deptLabel +
            "</td>" +
            '<td><div class="btn-row">' +
            '<a href="#" class="view-loc-link me-auto" data-loc="' +
            escapeHtml(this.name) +
            '">View <i class="fa-solid fa-arrow-right fa-fw"></i></a>' +
            '<button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' +
            this.id +
            '" data-name="' +
            escapeHtml(this.name) +
            '" title="Edit"><i class="fa-solid fa-pencil fa-fw"></i></button>' +
            '<button type="button" class="btn btn-delete" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="' +
            this.id +
            '" data-name="' +
            escapeHtml(this.name) +
            '" title="Delete"><i class="fa-solid fa-trash fa-fw"></i></button>' +
            "</div></td>" +
            "</tr>";
        });
        $("#locationTableBody").html(rows);
        filterLocations();
      } else {
        $("#locationTableBody").html(
          '<tr class="empty-table-row"><td colspan="3">Failed to load locations.</td></tr>',
        );
      }
    },
    error: function () {
      $("#locationTableBody").html(
        '<tr class="empty-table-row"><td colspan="3">Network error. Please refresh.</td></tr>',
      );
    },
  });
}

// ── Filter ────────

var activeFilterDept = "";
var activeFilterDeptName = "";
var activeFilterLoc = "";

function filterPersonnel() {
  var search = $("#searchInp").val().toLowerCase();
  var hasFilter = activeFilterDept || activeFilterLoc;
  $("#filterBadge").toggleClass("d-none", !hasFilter);

  var visibleCount = 0;

  $(".emp-card").each(function () {
    var text = $(this).text().toLowerCase();
    var deptId = $(this).attr("data-dept-id");
    var loc = $(this).find(".card-loc").text().trim();
    var matchSearch = !search || text.includes(search);
    var matchDept = !activeFilterDept || deptId === activeFilterDept;
    var matchLoc = !activeFilterLoc || loc === activeFilterLoc;
    var visible = matchSearch && matchDept && matchLoc;
    $(this).toggle(visible);
    if (visible) visibleCount++;
  });

  // Show empty state if filter active but no results
  $("#cardGrid .filter-empty").remove();
  if (visibleCount === 0) {
    $("#cardGrid").append(
      '<div class="filter-empty empty-grid">' +
        '<i class="fa-solid fa-user-slash"></i>' +
        "<p>" +
        (search
          ? "No personnel found matching <strong>" +
            escapeHtml(search) +
            "</strong>."
          : "No personnel assigned to <strong>" +
            escapeHtml(activeFilterDeptName || activeFilterLoc) +
            "</strong>.") +
        "</p>" +
        "</div>",
    );
  }
}

$("#searchInp").on("keyup", function () {
  if ($("#personnelBtn").hasClass("active")) {
    filterPersonnel();
  } else if ($("#departmentsBtn").hasClass("active")) {
    filterDepartments();
  } else {
    filterLocations();
  }
});

function filterDepartments() {
  var search = $("#searchInp").val().toLowerCase();
  var visibleCount = 0;

  $("#departmentTableBody tr").each(function () {
    var text = $(this).text().toLowerCase();
    var loc = $(this).find("td:nth-child(3)").text().trim();
    var matchSearch = !search || text.includes(search);
    var matchLoc = !activeFilterLoc || loc === activeFilterLoc;
    var visible = matchSearch && matchLoc;
    $(this).toggle(visible);
    if (visible) visibleCount++;
  });

  $("#filterBadge").toggleClass("d-none", !activeFilterLoc);

  $("#departmentTableBody .filter-empty").remove();
  if (visibleCount === 0) {
    $("#departmentTableBody").append(
      '<tr class="filter-empty"><td colspan="4">' +
        '<div class="empty-grid">' +
        '<i class="fa-solid fa-building-circle-xmark"></i>' +
        "<p>" +
        (search
          ? "No departments found matching <strong>" +
            escapeHtml(search) +
            "</strong>."
          : "No departments assigned to <strong>" +
            escapeHtml(activeFilterLoc) +
            "</strong>.") +
        "</p>" +
        "</div>" +
        "</td></tr>",
    );
  }
}

function filterLocations() {
  var search = $("#searchInp").val().toLowerCase();
  var visibleCount = 0;
  $("#locationTableBody tr").each(function () {
    var text = $(this).text().toLowerCase();
    var visible = !search || text.includes(search);
    $(this).toggle(visible);
    if (visible) visibleCount++;
  });
  $("#locationTableBody .filter-empty").remove();
  if (visibleCount === 0 && search) {
    $("#locationTableBody").append(
      '<tr class="filter-empty"><td colspan="3">' +
        '<div class="empty-grid">' +
        '<i class="fa-solid fa-location-dot"></i>' +
        "<p>No locations found matching <strong>" +
        escapeHtml(search) +
        "</strong>.</p>" +
        "</div>" +
        "</td></tr>",
    );
  }
}

// ── Refresh ─────────────

$("#refreshBtn").click(function () {
  $("#searchInp").val("").trigger("keyup");
  if ($("#personnelBtn").hasClass("active")) {
    loadPersonnel();
  } else if ($("#departmentsBtn").hasClass("active")) {
    loadDepartments();
  } else {
    loadLocations();
  }
});

// ── Filter button ──────────

$("#filterBtn").click(function () {
  if ($("#departmentsBtn").hasClass("active")) {
    $("#filterModalLabel").html(
      '<i class="fa-solid fa-filter fa-fw me-2"></i>Filter Departments',
    );
  } else {
    $("#filterModalLabel").html(
      '<i class="fa-solid fa-filter fa-fw me-2"></i>Filter Personnel',
    );
  }
  $.ajax({
    url: PHP + "getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      $("#filterDepartment").html('<option value="">All departments</option>');
      if (result.status.code == 200) {
        $.each(result.data, function () {
          $("#filterDepartment").append(
            $("<option>", { value: this.id, text: this.name }),
          );
        });
        $("#filterDepartment").val(activeFilterDept);
      }
    },
  });
  $.ajax({
    url: PHP + "getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      $("#filterLocation").html('<option value="">All locations</option>');
      if (result.status.code == 200) {
        $.each(result.data, function () {
          $("#filterLocation").append(
            $("<option>", { value: this.name, text: this.name }),
          );
        });
        $("#filterLocation").val(activeFilterLoc);
      }
    },
  });
  $("#filterModal").modal("show");
});

$("#applyFilterBtn").click(function () {
  activeFilterDept = $("#filterDepartment").val();
  activeFilterDeptName = $("#filterDepartment option:selected").text();
  activeFilterLoc = $("#filterLocation").val();
  if ($("#departmentsBtn").hasClass("active")) {
    filterDepartments();
  } else {
    filterPersonnel();
  }
  $("#filterModal").modal("hide");
});

$("#clearFilterBtn").click(function () {
  activeFilterDept = "";
  activeFilterDeptName = "";
  activeFilterLoc = "";
  $("#filterDepartment").val("");
  $("#filterLocation").val("");
  if ($("#departmentsBtn").hasClass("active")) {
    filterDepartments();
  } else {
    filterPersonnel();
  }
  $("#filterModal").modal("hide");
});

$(document).on("change", "#addDepartmentNameSelect", function () {
  if ($(this).val() === "__new__") {
    $("#addDepartmentNewNameWrap").show();
    $("#addDepartmentName").attr("required", true);
  } else {
    $("#addDepartmentNewNameWrap").hide();
    $("#addDepartmentName").val($(this).val()).removeAttr("required");
  }
});

// ── Add button ────

$("#addBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $.ajax({
      url: PHP + "getAllDepartments.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        $("#addPersonnelDepartment").html(
          '<option value="">-- Select a department --</option>',
        );
        if (result.status.code == 200) {
          $.each(result.data, function () {
            $("#addPersonnelDepartment").append(
              $("<option>", { value: this.id, text: this.name }),
            );
          });
        }
        $("#addPersonnelForm")[0].reset();
        $("#addPersonnelModal").modal("show");
      },
      error: function () {
        showError("Could not load departments.");
      },
    });
  } else if ($("#departmentsBtn").hasClass("active")) {
    $.ajax({
      url: PHP + "getAllLocations.php",
      type: "POST",
      dataType: "json",
      success: function (locResult) {
        $("#addDepartmentLocation").html(
          '<option value="">-- Select a location --</option>',
        );
        if (locResult.status.code == 200) {
          $.each(locResult.data, function () {
            $("#addDepartmentLocation").append(
              $("<option>", { value: this.id, text: this.name }),
            );
          });
        }
        // Separately fetch department names for the name dropdown
        $.ajax({
          url: PHP + "getAllDepartments.php",
          type: "POST",
          dataType: "json",
          success: function (deptResult) {
            $("#addDepartmentNameSelect").html(
              '<option value="">-- Select existing or type new --</option>' +
                '<option value="__new__">+ Type a new name</option>',
            );
            if (deptResult.status.code == 200) {
              var seen = {};
              $.each(deptResult.data, function () {
                if (!seen[this.name]) {
                  seen[this.name] = true;
                  $("#addDepartmentNameSelect").append(
                    $("<option>", { value: this.name, text: this.name }),
                  );
                }
              });
            }
          },
          error: function () {
            showError("Could not load department names.");
          },
        });
        $("#addDepartmentNewNameWrap").hide();
        $("#addDepartmentName").val("");
        $("#addDepartmentForm")[0].reset();
        $("#addDepartmentModal").modal("show");
      },
      error: function () {
        showError("Could not load locations.");
      },
    });
  } else {
    $("#addLocationForm")[0].reset();
    $("#addLocationModal").modal("show");
  }
});

// ── Tabs ───────

$("#personnelBtn").click(function () {
  _activeTab = "personnel";
  loadPersonnel();
});
$("#departmentsBtn").click(function () {
  _activeTab = "departments";
  loadDepartments();
});
$("#locationsBtn").click(function () {
  _activeTab = "locations";
  loadLocations();
});

$(document).on("click", ".view-dept-link", function (e) {
  e.preventDefault();
  var dept = $(this).attr("data-dept");
  var deptId = $(this).attr("data-dept-id");

  activeFilterDept = deptId;
  activeFilterLoc = "";
  activeFilterDeptName = dept;
  _activeTab = "personnel";
  bootstrap.Tab.getOrCreateInstance(
    document.getElementById("personnelBtn"),
  ).show();
  loadPersonnel(function () {
    filterPersonnel();
  });
});

$(document).on("click", ".view-loc-link", function (e) {
  e.preventDefault();
  var loc = $(this).attr("data-loc");

  activeFilterLoc = loc;
  activeFilterDept = "";
  _activeTab = "departments";
  bootstrap.Tab.getOrCreateInstance(
    document.getElementById("departmentsBtn"),
  ).show();
  loadDepartments(function () {
    filterDepartments();
  });
});

// PERSONNEL — EDIT
// ── Handler 1: LOAD data when modal opens ─────────
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: PHP + "getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id: $(e.relatedTarget).attr("data-id") },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
        $("#editPersonnelDepartment").html(
          '<option value="">-- Select a department --</option>',
        );
        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", { value: this.id, text: this.name }),
          );
        });
        $("#editPersonnelDepartment").val(
          result.data.personnel[0].departmentID,
        );
        checkEditPersonnelSave();
      } else {
        $("#editPersonnelModal").modal("hide");
        showError("Error retrieving personnel data.");
      }
    },
    error: function () {
      $("#editPersonnelModal").modal("hide");
      showError("Network error retrieving personnel data.");
    },
  });
});

// ── Handler 2: VALIDATE then SAVE on form submit ───────────
$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  var firstName = $("#editPersonnelFirstName").val().trim();
  var lastName = $("#editPersonnelLastName").val().trim();
  var email = $("#editPersonnelEmailAddress").val().trim();
  var jobTitle = $("#editPersonnelJobTitle").val().trim();
  var v1 = validateField("#editPersonnelFirstName", isValidName(firstName));
  var v2 = validateField("#editPersonnelLastName", isValidName(lastName));
  var v3 = validateField("#editPersonnelEmailAddress", isValidEmail(email));
  var v4 =
    jobTitle === "" ||
    validateField("#editPersonnelJobTitle", isValidText(jobTitle));
  var v5 = validateField(
    "#editPersonnelDepartment",
    $("#editPersonnelDepartment").val() !== "" &&
      $("#editPersonnelDepartment").val() !== null,
  );
  if (!v1 || !v2 || !v3 || !v4 || !v5) return;

  $.ajax({
    url: PHP + "updatePersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editPersonnelEmployeeID").val(),
      firstName: firstName,
      lastName: lastName,
      jobTitle: $("#editPersonnelJobTitle").val().trim(),
      email: email,
      departmentID: $("#editPersonnelDepartment").val(),
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editPersonnelModal").modal("hide");
        loadPersonnel();
        showAlert("Personnel updated successfully.", "success");
      } else {
        showError(result.status.description || "Failed to update personnel.");
      }
    },
    error: function () {
      showError("Network error updating personnel.");
    },
  });
});

// PERSONNEL — DELETE
$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  $("#deletePersonnelID").val($(e.relatedTarget).attr("data-id"));
  $("#deletePersonnelName").text($(e.relatedTarget).attr("data-name"));
});

$("#confirmDeletePersonnelBtn").click(function () {
  $.ajax({
    url: PHP + "deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: { id: $("#deletePersonnelID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deletePersonnelModal").modal("hide");
        loadPersonnel();
        showAlert("Personnel deleted successfully.", "success");
      } else {
        $("#deletePersonnelModal").modal("hide");
        setTimeout(function () {
          showError(result.status.description || "Failed to delete personnel.");
        }, 300);
      }
    },
    error: function () {
      showError("Network error deleting personnel.");
    },
  });
});

// PERSONNEL — ADD
$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  var firstName = $("#addPersonnelFirstName").val().trim();
  var lastName = $("#addPersonnelLastName").val().trim();
  var email = $("#addPersonnelEmailAddress").val().trim();
  var jobTitle = $("#addPersonnelJobTitle").val().trim();
  var v1 = validateField("#addPersonnelFirstName", isValidName(firstName));
  var v2 = validateField("#addPersonnelLastName", isValidName(lastName));
  var v3 = validateField("#addPersonnelEmailAddress", isValidEmail(email));
  var v4 =
    jobTitle === "" ||
    validateField("#addPersonnelJobTitle", isValidText(jobTitle));
  var v5 = validateField(
    "#addPersonnelDepartment",
    $("#addPersonnelDepartment").val() !== "" &&
      $("#addPersonnelDepartment").val() !== null,
  );
  if (!v1 || !v2 || !v3 || !v4 || !v5) return;
  $.ajax({
    url: PHP + "insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: firstName,
      lastName: lastName,
      jobTitle: $("#addPersonnelJobTitle").val().trim(),
      email: email,
      departmentID: $("#addPersonnelDepartment").val(),
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addPersonnelModal").modal("hide");
        loadPersonnel();
        showAlert("Personnel added successfully.", "success");
      } else {
        showError(result.status.description || "Failed to add personnel.");
      }
    },
    error: function () {
      showError("Network error adding personnel.");
    },
  });
});

// DEPARTMENTS — EDIT
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: PHP + "getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: { id: $(e.relatedTarget).attr("data-id") },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);
        $("#editDepartmentLocation").html(
          '<option value="">-- Select a location --</option>',
        );
        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", { value: this.id, text: this.name }),
          );
        });
        $("#editDepartmentLocation").val(result.data.department[0].locationID);
        checkEditDepartmentSave();
      } else {
        $("#editDepartmentModal").modal("hide");
        showError("Error retrieving department data.");
      }
    },
    error: function () {
      $("#editDepartmentModal").modal("hide");
      showError("Network error retrieving department data.");
    },
  });
});

$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  var name = $("#editDepartmentName").val().trim();
  if (!validateField("#editDepartmentName", isValidText(name))) return;
  var locVal = $("#editDepartmentLocation").val();
  if (
    !validateField("#editDepartmentLocation", locVal !== "" && locVal !== null)
  )
    return;
  $.ajax({
    url: PHP + "updateDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editDepartmentID").val(),
      name: name,
      locationID: $("#editDepartmentLocation").val(),
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editDepartmentModal").modal("hide");
        loadDepartments();
        showAlert("Department updated successfully.", "success");
      } else {
        showError(result.status.description || "Failed to update department.");
      }
    },
    error: function () {
      showError("Network error updating department.");
    },
  });
});

// DEPARTMENTS — DELETE
$("#deleteDepartmentModal").on("show.bs.modal", function (e) {
  $("#deleteDepartmentID").val($(e.relatedTarget).attr("data-id"));
  $("#deleteDepartmentName").text($(e.relatedTarget).attr("data-name"));
});

$("#confirmDeleteDepartmentBtn").click(function () {
  $.ajax({
    url: PHP + "deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: { id: $("#deleteDepartmentID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteDepartmentModal").modal("hide");
        loadDepartments();
        showAlert("Department deleted successfully.", "success");
      } else {
        $("#deleteDepartmentModal").modal("hide");
        setTimeout(function () {
          showError(
            result.status.description || "Failed to delete department.",
          );
        }, 300);
      }
    },
    error: function () {
      showError("Network error deleting department.");
    },
  });
});

// DEPARTMENTS — ADD
$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  var selectVal = $("#addDepartmentNameSelect").val();
  var newName = $("#addDepartmentName").val().trim();
  var v1 = validateField(
    "#addDepartmentNameSelect",
    selectVal !== "" && selectVal !== null,
  );
  var v2 =
    selectVal === "__new__"
      ? validateField("#addDepartmentName", isValidText(newName))
      : true;
  var locVal = $("#addDepartmentLocation").val();
  var v3 = validateField(
    "#addDepartmentLocation",
    locVal !== "" && locVal !== null,
  );
  if (!v1 || !v2 || !v3) return;
  $.ajax({
    url: PHP + "insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: selectVal === "__new__" ? newName : selectVal,
      locationID: $("#addDepartmentLocation").val(),
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addDepartmentModal").modal("hide");
        loadDepartments();
        showAlert("Department added successfully.", "success");
      } else {
        showError(result.status.description || "Failed to add department.");
      }
    },
    error: function () {
      showError("Network error adding department.");
    },
  });
});

// LOCATIONS — EDIT
$("#editLocationModal").on("show.bs.modal", function (e) {
  $("#editLocationID").val($(e.relatedTarget).attr("data-id"));
  $("#editLocationName").val($(e.relatedTarget).attr("data-name"));
  checkEditLocationSave();
});

$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();
  var name = $("#editLocationName").val().trim();
  if (!validateField("#editLocationName", isValidText(name))) return;
  $.ajax({
    url: PHP + "updateLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editLocationID").val(),
      name: name,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editLocationModal").modal("hide");
        loadLocations();
        showAlert("Location updated successfully.", "success");
      } else {
        showError(result.status.description || "Failed to update location.");
      }
    },
    error: function () {
      showError("Network error updating location.");
    },
  });
});

// LOCATIONS — DELETE
$("#deleteLocationModal").on("show.bs.modal", function (e) {
  $("#deleteLocationID").val($(e.relatedTarget).attr("data-id"));
  $("#deleteLocationName").text($(e.relatedTarget).attr("data-name"));
});

$("#confirmDeleteLocationBtn").click(function () {
  $.ajax({
    url: PHP + "deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: { id: $("#deleteLocationID").val() },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteLocationModal").modal("hide");
        loadLocations();
        showAlert("Location deleted successfully.", "success");
      } else {
        $("#deleteLocationModal").modal("hide");
        setTimeout(function () {
          showError(result.status.description || "Failed to delete location.");
        }, 300);
      }
    },
    error: function () {
      showError("Network error deleting location.");
    },
  });
});

// LOCATIONS — ADD
$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();
  var name = $("#addLocationName").val().trim();
  if (!validateField("#addLocationName", isValidText(name))) return;
  $.ajax({
    url: PHP + "insertLocation.php",
    type: "POST",
    dataType: "json",
    data: { name: name },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addLocationModal").modal("hide");
        loadLocations();
        showAlert("Location added successfully.", "success");
      } else {
        showError(result.status.description || "Failed to add location.");
      }
    },
    error: function () {
      showError("Network error adding location.");
    },
  });
});

// INIT
$(document).ready(function () {
  loadPersonnel();

  // Hide preloader once page is ready
  setTimeout(function () {
    $("#appPreloader").addClass("hidden");
    setTimeout(function () {
      $("#appPreloader").hide();
    }, 500);
  }, 800);
});

// ── Mobile history (back button) ───────

var _backButtonClosing = false;

history.replaceState({ type: "base" }, "");
history.pushState({ type: "sentinel" }, "");

$(window).on("popstate", function (e) {
  var state = e.originalEvent.state;
  if (!state || state.type !== "base") return;

  history.pushState({ type: "sentinel" }, "");

  // Priority 1: close any open modal
  if ($(".modal.show").length) {
    _backButtonClosing = true;
    $(".modal.show").first().modal("hide");
    setTimeout(function () {
      _backButtonClosing = false;
    }, 300);
    return;
  }

  // Priority 2: close profile panel
  if ($("#profilePanel").hasClass("open")) {
    closeProfile();
    return;
  }

  // Priority 3: locations tab → departments tab
  if (_activeTab === "locations") {
    _activeTab = "departments";
    activeFilterLoc = "";
    activeFilterDept = "";
    activeFilterDeptName = "";
    bootstrap.Tab.getOrCreateInstance(
      document.getElementById("departmentsBtn"),
    ).show();
    loadDepartments();
    return;
  }

  // Priority 4: departments tab → personnel tab
  if (_activeTab === "departments") {
    _activeTab = "personnel";
    activeFilterDept = "";
    activeFilterDeptName = "";
    activeFilterLoc = "";
    bootstrap.Tab.getOrCreateInstance(
      document.getElementById("personnelBtn"),
    ).show();
    loadPersonnel();
    return;
  }

  // Priority 5: clear active filter
  if (activeFilterDept || activeFilterLoc) {
    activeFilterDept = "";
    activeFilterDeptName = "";
    activeFilterLoc = "";
    $("#filterDepartment").val("");
    $("#filterLocation").val("");
    filterPersonnel();
    return;
  }

  // Priority 6: clear search bar
  if ($("#searchInp").val() !== "") {
    $("#searchInp").val("").trigger("keyup");
    return;
  }

  // Nothing left — exit app naturally
  history.back();
});
