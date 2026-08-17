"use strict";


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEY =
  "employee-manager-employees";

const THEME_KEY =
  "employee-manager-theme";


/* =========================================================
   DEFAULT EMPLOYEES
========================================================= */

const defaultEmployees = [

  {
    id: 1,
    name: "Sofia Williams",
    email: "Sofia.Williams@employee_management.com",
    role: "Product Designer",
    department: "Design",
    status: "Active",
    joinDate: "2026-03-12",
  },

  {
    id: 2,
    name: "Amelia Clarke",
    email: "amelia.clarke@employee_management.com",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
    joinDate: "2026-05-18",
  },

  {
    id: 3,
    name: "Lucas Bennett",
    email: "lucas_bennet@employee_management.com",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "On Leave",
    joinDate: "2025-11-04",
  },

  {
    id: 4,
    name: "Daniel Wilson",
    email: "daniel.wilson@employee_management.com",
    role: "HR Manager",
    department: "People Operations",
    status: "Active",
    joinDate: "2026-08-02",
  },

];


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getEmployees() {

  try {

    const savedEmployees =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!savedEmployees) {

      return [
        ...defaultEmployees
      ];
    }


    const parsedEmployees =
      JSON.parse(
        savedEmployees
      );


    return Array.isArray(
      parsedEmployees
    )
      ? parsedEmployees
      : [
          ...defaultEmployees
        ];

  } catch {

    return [
      ...defaultEmployees
    ];
  }
}


function saveEmployees() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(employees)
    );

  } catch {

    console.warn(
      "Employee data could not be saved to localStorage."
    );
  }
}


let employees =
  getEmployees();


/* =========================================================
   DOM ELEMENTS
========================================================= */

const elements = {

  employeeList:
    document.querySelector(
      "#employeeList"
    ),

  emptyState:
    document.querySelector(
      "#emptyState"
    ),

  searchInput:
    document.querySelector(
      "#searchInput"
    ),

  departmentFilter:
    document.querySelector(
      "#departmentFilter"
    ),

  statusFilter:
    document.querySelector(
      "#statusFilter"
    ),

  employeeModal:
    document.querySelector(
      "#employeeModal"
    ),

  employeeForm:
    document.querySelector(
      "#employeeForm"
    ),

  employeeId:
    document.querySelector(
      "#employeeId"
    ),

  employeeName:
    document.querySelector(
      "#employeeName"
    ),

  employeeEmail:
    document.querySelector(
      "#employeeEmail"
    ),

  employeeRole:
    document.querySelector(
      "#employeeRole"
    ),

  employeeDepartment:
    document.querySelector(
      "#employeeDepartment"
    ),

  employeeStatus:
    document.querySelector(
      "#employeeStatus"
    ),

  employeeJoinDate:
    document.querySelector(
      "#employeeJoinDate"
    ),

  modalTitle:
    document.querySelector(
      "#modalTitle"
    ),

  modalEyebrow:
    document.querySelector(
      "#modalEyebrow"
    ),

  saveEmployee:
    document.querySelector(
      "#saveEmployee"
    ),

  totalCount:
    document.querySelector(
      "#totalCount"
    ),

  activeCount:
    document.querySelector(
      "#activeCount"
    ),

  departmentCount:
    document.querySelector(
      "#departmentCount"
    ),

  newCount:
    document.querySelector(
      "#newCount"
    ),

  themeToggle:
    document.querySelector(
      "#themeToggle"
    ),

  todayText:
    document.querySelector(
      "#todayText"
    ),

  year:
    document.querySelector(
      "#year"
    ),

  openEmployeeModal:
    document.querySelector(
      "#openEmployeeModal"
    ),

  openEmployeeEmptyState:
    document.querySelector(
      "#openEmployeeEmptyState"
    ),

  closeModal:
    document.querySelector(
      "#closeModal"
    ),

  cancelEmployee:
    document.querySelector(
      "#cancelEmployee"
    ),

  clearFilters:
    document.querySelector(
      "#clearFilters"
    ),
};


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function escapeHtml(text) {

  const element =
    document.createElement(
      "div"
    );

  element.textContent =
    text;

  return element.innerHTML;
}


function getInitials(name) {

  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0)
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


function formatDate(date) {

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(
    new Date(
      `${date}T00:00:00`
    )
  );
}


function isNewThisMonth(
  employee
) {

  if (!employee.joinDate) {
    return false;
  }


  const today =
    new Date();


  const joiningDate =
    new Date(
      `${employee.joinDate}T00:00:00`
    );


  return (
    joiningDate.getMonth() ===
      today.getMonth() &&

    joiningDate.getFullYear() ===
      today.getFullYear()
  );
}


/* =========================================================
   DEPARTMENT FILTER
========================================================= */

function updateDepartmentFilter() {

  const selectedDepartment =
    elements.departmentFilter.value;


  const departments = [

    ...new Set(

      employees

        .map(
          (employee) =>
            employee.department
        )

        .filter(Boolean)

    ),

  ].sort();


  elements.departmentFilter.innerHTML =

    `
      <option value="all">
        All departments
      </option>
    `

    +

    departments

      .map(
        (department) =>

          `
            <option value="${escapeHtml(
              department
            )}">
              ${escapeHtml(
                department
              )}
            </option>
          `
      )

      .join("");


  if (
    departments.includes(
      selectedDepartment
    )
  ) {

    elements.departmentFilter.value =
      selectedDepartment;

  } else {

    elements.departmentFilter.value =
      "all";
  }
}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

  elements.totalCount.textContent =
    employees.length;


  elements.activeCount.textContent =

    employees.filter(
      (employee) =>
        employee.status ===
        "Active"
    ).length;


  elements.departmentCount.textContent =

    new Set(

      employees

        .map(
          (employee) =>
            employee.department
        )

        .filter(Boolean)

    ).size;


  elements.newCount.textContent =

    employees.filter(
      isNewThisMonth
    ).length;
}


/* =========================================================
   RENDER EMPLOYEES
========================================================= */

function renderEmployees() {

  updateDepartmentFilter();


  const searchTerm =

    elements.searchInput.value
      .trim()
      .toLowerCase();


  const selectedDepartment =
    elements.departmentFilter.value;


  const selectedStatus =
    elements.statusFilter.value;


  const filteredEmployees =

    employees.filter(
      (employee) => {

        const searchableText = `

          ${employee.name}

          ${employee.email}

          ${employee.role}

          ${employee.department}

        `.toLowerCase();


        const matchesSearch =

          searchableText.includes(
            searchTerm
          );


        const matchesDepartment =

          selectedDepartment ===
            "all" ||

          employee.department ===
            selectedDepartment;


        const matchesStatus =

          selectedStatus ===
            "all" ||

          employee.status ===
            selectedStatus;


        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus
        );
      }
    );


  elements.employeeList.innerHTML =

    filteredEmployees

      .map(
        (employee) => {

          const statusClass =

            employee.status

              .toLowerCase()

              .replace(
                /\s+/g,
                "-"
              );


          return `

            <tr>

              <td>

                <div class="person">

                  <span
                    class="avatar"
                    aria-hidden="true"
                  >
                    ${escapeHtml(
                      getInitials(
                        employee.name
                      )
                    )}
                  </span>

                  <div>

                    <strong>
                      ${escapeHtml(
                        employee.name
                      )}
                    </strong>

                    <small>
                      ${escapeHtml(
                        employee.email
                      )}
                    </small>

                  </div>

                </div>

              </td>


              <td>

                <strong>
                  ${escapeHtml(
                    employee.role
                  )}
                </strong>

                <span class="department-name">
                  ${escapeHtml(
                    employee.department
                  )}
                </span>

              </td>


              <td>
                ${formatDate(
                  employee.joinDate
                )}
              </td>


              <td>

                <span
                  class="status ${statusClass}"
                >
                  ${escapeHtml(
                    employee.status
                  )}
                </span>

              </td>


              <td>

                <div class="row-actions">

                  <button
                    class="small-action"
                    type="button"
                    data-action="edit"
                    data-id="${employee.id}"
                  >
                    Edit
                  </button>


                  <button
                    class="small-action delete"
                    type="button"
                    data-action="delete"
                    data-id="${employee.id}"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          `;
        }
      )

      .join("");


  elements.emptyState.hidden =
    filteredEmployees.length > 0;


  updateStatistics();
}


/* =========================================================
   EMPLOYEE MODAL
========================================================= */

function openEmployeeModal(
  employee = null
) {

  elements.employeeForm.reset();


  /*
    EDIT
  */

  if (employee) {

    elements.modalEyebrow.textContent =
      "UPDATE EMPLOYEE";


    elements.modalTitle.textContent =
      "Edit employee";


    elements.saveEmployee.textContent =
      "Save changes";


    elements.employeeId.value =
      employee.id;


    elements.employeeName.value =
      employee.name;


    elements.employeeEmail.value =
      employee.email;


    elements.employeeRole.value =
      employee.role;


    elements.employeeDepartment.value =
      employee.department;


    elements.employeeStatus.value =
      employee.status;


    elements.employeeJoinDate.value =
      employee.joinDate;

  }


  /*
    ADD
  */

  else {

    elements.modalEyebrow.textContent =
      "NEW EMPLOYEE";


    elements.modalTitle.textContent =
      "Add employee";


    elements.saveEmployee.textContent =
      "Add employee";


    elements.employeeJoinDate.value =
      new Date()
        .toISOString()
        .slice(0, 10);
  }


  elements.employeeModal.hidden =
    false;


  document.body.style.overflow =
    "hidden";


  elements.employeeName.focus();
}


function closeEmployeeModal() {

  elements.employeeModal.hidden =
    true;

  document.body.style.overflow =
    "";
}


/* =========================================================
   ADD / EDIT EMPLOYEE
========================================================= */

function handleEmployeeForm(
  event
) {

  event.preventDefault();


  const employeeData = {

    name:
      elements.employeeName.value
        .trim(),

    email:
      elements.employeeEmail.value
        .trim(),

    role:
      elements.employeeRole.value
        .trim(),

    department:
      elements.employeeDepartment.value
        .trim(),

    status:
      elements.employeeStatus.value,

    joinDate:
      elements.employeeJoinDate.value,
  };


  const employeeId =
    Number(
      elements.employeeId.value
    );


  /*
    EDIT EXISTING EMPLOYEE
  */

  if (employeeId) {

    const employeeIndex =

      employees.findIndex(
        (employee) =>
          employee.id ===
          employeeId
      );


    if (
      employeeIndex !== -1
    ) {

      employees[
        employeeIndex
      ] = {

        ...employees[
          employeeIndex
        ],

        ...employeeData,
      };
    }
  }


  /*
    ADD NEW EMPLOYEE
  */

  else {

    employees.unshift({

      id: Date.now(),

      ...employeeData,
    });
  }


  saveEmployees();

  renderEmployees();

  closeEmployeeModal();
}


/* =========================================================
   EDIT / DELETE
========================================================= */

function handleEmployeeActions(
  event
) {

  const button =
    event.target.closest(
      "[data-action]"
    );


  if (!button) {
    return;
  }


  const employeeId =
    Number(
      button.dataset.id
    );


  const employee =
    employees.find(
      (item) =>
        item.id ===
        employeeId
    );


  if (!employee) {
    return;
  }


  /*
    EDIT
  */

  if (
    button.dataset.action ===
    "edit"
  ) {

    openEmployeeModal(
      employee
    );
  }


  /*
    DELETE
  */

  if (
    button.dataset.action ===
    "delete"
  ) {

    const shouldDelete =
      confirm(
        `Delete ${employee.name} from the directory?`
      );


    if (!shouldDelete) {
      return;
    }


    employees =
      employees.filter(
        (item) =>
          item.id !==
          employeeId
      );


    saveEmployees();

    renderEmployees();
  }
}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

  elements.searchInput.value =
    "";


  elements.departmentFilter.value =
    "all";


  elements.statusFilter.value =
    "all";


  renderEmployees();
}


/* =========================================================
   THEME
========================================================= */

function setTheme(
  theme
) {

  const isDarkTheme =
    theme === "dark";


  document.body.classList.toggle(
    "dark",
    isDarkTheme
  );


  elements.themeToggle.textContent =

    isDarkTheme
      ? "☀"
      : "☾";


  elements.themeToggle.setAttribute(
    "aria-label",

    isDarkTheme

      ? "Switch to light theme"

      : "Switch to dark theme"
  );


  try {

    localStorage.setItem(
      THEME_KEY,
      theme
    );

  } catch {

    console.warn(
      "Theme preference could not be saved."
    );
  }
}


function toggleTheme() {

  const currentTheme =

    document.body.classList.contains(
      "dark"
    )

      ? "light"

      : "dark";


  setTheme(
    currentTheme
  );
}


/* =========================================================
   EVENT LISTENERS
========================================================= */


/*
  Add Employee button
*/

elements.openEmployeeModal
  .addEventListener(
    "click",
    () =>
      openEmployeeModal()
  );


/*
  Add Employee button
  from empty state
*/

elements.openEmployeeEmptyState
  .addEventListener(
    "click",
    () =>
      openEmployeeModal()
  );


/*
  Close modal
*/

elements.closeModal
  .addEventListener(
    "click",
    closeEmployeeModal
  );


/*
  Cancel
*/

elements.cancelEmployee
  .addEventListener(
    "click",
    closeEmployeeModal
  );


/*
  Form submit
*/

elements.employeeForm
  .addEventListener(
    "submit",
    handleEmployeeForm
  );


/*
  Edit / Delete
*/

elements.employeeList
  .addEventListener(
    "click",
    handleEmployeeActions
  );


/*
  Search
*/

elements.searchInput
  .addEventListener(
    "input",
    renderEmployees
  );


/*
  Department
*/

elements.departmentFilter
  .addEventListener(
    "change",
    renderEmployees
  );


/*
  Status
*/

elements.statusFilter
  .addEventListener(
    "change",
    renderEmployees
  );


/*
  Clear filters
*/

elements.clearFilters
  .addEventListener(
    "click",
    clearFilters
  );


/*
  Click outside modal
*/

elements.employeeModal
  .addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        elements.employeeModal
      ) {

        closeEmployeeModal();
      }
    }
  );


/*
  Escape key
*/

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      !elements.employeeModal.hidden
    ) {

      closeEmployeeModal();
    }
  }
);


/*
  DARK / LIGHT MODE

  The button is now inside the navigation,
  immediately after About.
*/

elements.themeToggle
  .addEventListener(
    "click",
    toggleTheme
  );


/* =========================================================
   INITIAL PAGE CONTENT
========================================================= */

elements.todayText.textContent =

  new Intl.DateTimeFormat(
    "en",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  ).format(
    new Date()
  );


elements.year.textContent =
  new Date().getFullYear();


/* =========================================================
   LOAD SAVED THEME
========================================================= */

let savedTheme =
  "light";


try {

  savedTheme =
    localStorage.getItem(
      THEME_KEY
    ) ||
    "light";

} catch {

  savedTheme =
    "light";
}


setTheme(
  savedTheme
);


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

renderEmployees();