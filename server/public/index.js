const btns = document.querySelectorAll(".reveal");
const interactiveCopy = document.querySelectorAll(".interactive_copy");
const inputs = document.querySelectorAll("form input");
const inputsNotOptional = document.querySelectorAll(
  "form input:not(.optional)"
);
const submitBtn = document.querySelector("button[type='submit']");
const loginBtn = document.querySelector("button[type='submit'].login_button");
const register = document.getElementById("register");
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const session_saved = document.getElementById("session_saved");
const create_password = document.getElementById("create_password");
const dashboard = document.getElementById("dashboard");
const cautionElement = document.querySelector(".validation_msg");
const result = document.getElementById("result");
const searchBtn = document.getElementById("search");
const preventsReload = ["click", "mousemove", "keydown", "scroll"];
let currentCardToUndo = [];
let currentOriginalValues = [];
let currentFoundItems = [];
const errorMessages = {
  invalidLoginDetails: "Password or username is wrong",
  lockedAccount: "Account is locked, please contact administrator",
};
function defaultStateInizialitation() {
  const inputFocus = document.querySelector("#password");
  const focusToPassword = function () {
    inputFocus.focus();
  };
  window.onload(focusToPassword());
}
async function initialize() {
  let currentUser = await checkSession();
  const setSession = function () {
    const request = fetch();
  };
  async function setUser() {
    const usernameEl = document.getElementById("current_user");
    usernameEl.innerText = currentUser.username;
  }
  setUser();
}
async function checkSession() {
  const session = localStorage.getItem("session");

  const parsedSession = JSON.parse(session);

  const authenticate = async function (token) {
    try {
      const uri = "/login/checkUser";
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      return response.json();
    } catch (err) {
      throw new Error(err);
    }
  };

  try {
    let cookie = document.cookie.split(";")[0].split("=")[1];
    let response = await authenticate(cookie);
    return response;
  } catch {
    try {
      let cookie = document.cookie.split(";")[1].split("=")[1];
      let response = await authenticate(cookie);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}

document.addEventListener("click", (e) => {
  const el = e.target;

  if (el.matches(".interactive_copy")) {
    try {
      navigator.clipboard.writeText(el.dataset.copies);
    } catch (err) {
      throw new Error(err);
    }
    if (document.querySelector(".copied_msg")) {
      removeElement(document.querySelector(".copied_msg"));
    }
    const copy_msg = document.createElement("span");
    copy_msg.classList.add("copied_msg");
    copy_msg.innerText = "copied";
    el.appendChild(copy_msg);
    el.classList.add("copied");
  } else {
    return;
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.parentElement) return;

  if (e.target.parentElement.matches(".reveal")) {
    let input = e.target.parentElement.previousElementSibling;

    if (e.target.tagName == "BUTTON") {
      input = e.target.previousElementSibling;
    }
    if (e.target.tagName == "I") {
      e.target.parentElement.previousElementSibling;
    }

    if (input.type === "text") {
      input.setAttribute("type", "password");
    } else {
      input.setAttribute("type", "text");
    }
  }
});

function validateRegisterPassword() {
  const parent = document.querySelector(".password_box");
  const password = document.querySelector("#new-password");
  const passwordConfirmation = document.querySelector(
    "#new-password-confirmation"
  );
  const helpMessage = document.querySelector(".help_msg.confirm_password");
  const PASSWORD_ELEMENTS = [password, passwordConfirmation, helpMessage];

  const handleAdd = function (className) {
    PASSWORD_ELEMENTS.forEach((el) => {
      el.classList.add(`${className}`);
    });
  };
  const handleRemove = function (className) {
    PASSWORD_ELEMENTS.forEach((el) => {
      el.classList.remove(`${className}`);
    });
  };

  function errorHandling(input, inputComparison) {
    const baseMsg = "Confirm new password";
    const passwordMatch = input === inputComparison;
    const regexHelper = {
      blankSpaces: /\s\s/,
    };
    if (input.length === 1 && inputComparison.length === 1) {
      helpMessage.innerText = "Password must have at least 2 digits";
    } else {
      if (input.length < 1 && inputComparison.length < 1) {
        helpMessage.innerText = baseMsg;
        handleRemove("match");
        handleRemove("mismatch");
      } else {
        if (
          regexHelper.blankSpaces.test(input) &&
          regexHelper.blankSpaces.test(inputComparison)
        ) {
          helpMessage.innerText = "Password cannot be blank spaces";
          handleRemove("match");
          handleAdd("mismatch");
        } else {
          if (!passwordMatch) {
            helpMessage.innerText = "Passwords must match!";
          }
          if (passwordMatch) {
            helpMessage.innerText = "Password matches";
          }
          if (input !== inputComparison) {
            handleRemove("match");
            handleAdd("mismatch");
          }
          if (input === inputComparison) {
            handleRemove("mismatch");
            handleAdd("match");
          }
        }
      }
    }
  }
  parent.addEventListener("input", () => {
    errorHandling(password.value, passwordConfirmation.value);
  });
}
function formIsValid() {
  for (let i = 0; i < inputsNotOptional.length; i++) {
    if (
      inputsNotOptional[i].classList.contains("mismatch") ||
      inputsNotOptional[i].value.length < 1
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
  }
  return true;
}

function validateLogin(element, getUsername = undefined) {
  let validateListener = loginToSession;
  element.addEventListener("click", () => {
    validateListener(
      element,
      validateListener,
      document.getElementById("password").value,
      getUsername
    );
  });
}

async function attemptLogin(username, password) {
  const uri = "/login";
  try {
    const response = fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(async (data) => {
      return data;
    });

    return response;
  } catch (error) {
    throw new Error(error);
  }
}
function loginToSession(
  el,
  validateListener,
  getPassword,
  getUsername = undefined
) {
  let loginValidationSuccesful;
  const username = getUsername
    ? getUsername
    : document.getElementById("username").value;
  const password = getPassword;
  let parsedData;
  const sanitizeUsername = () => {
    return username;
  };
  const sanitizePassword = () => {
    return password;
  };
  if (formIsValid()) {
    checkLoadingState(
      loginValidationSuccesful,
      el,
      validateListener,
      "Login",
      "Loading..."
    );
    attemptLogin(sanitizeUsername(), sanitizePassword())
      .then(async (data) => {
        parsedData = await data.json();
        loginValidationSuccesful = parsedData;
      })
      .then(() => {
        checkLoadingState(
          loginValidationSuccesful,
          el,
          validateListener,
          "Login",
          "Loading..."
        );
        if (loginValidationSuccesful === false) {
          cautionElement.classList.remove("hidden");
          cautionElement.innerText = errorMessages.invalidLoginDetails;
        }
        if (loginValidationSuccesful === "locked") {
          cautionElement.classList.remove("hidden");
          cautionElement.innerText = errorMessages.lockedAccount;
        }
        if (
          loginValidationSuccesful.tokenEarly ||
          loginValidationSuccesful.tokenLate
        ) {
          document.cookie = `tokenEarly=${parsedData.tokenEarly} ;max-age=${
            60 * 60 * 1
          }`;
          document.cookie = `tokenLate=${parsedData.tokenLate} ;max-age=${
            60 * 60 * 72
          }`;
          localStorage.setItem("session", JSON.stringify(parsedData));
          reRouteUser("/dashboard.html");
        } else {
          return;
        }
        loginValidationSuccesful = undefined;
      });
  } else {
    return;
  }
  return loginValidationSuccesful;
}

function reRouteUser(path) {
  window.location.href = path;
}
function checkLoadingState(response, el, fn, initialMsg, pendingState) {
  if (response === undefined) {
    el.innerText = pendingState;
    el.removeEventListener("click", fn);
  } else {
    el.innerText = initialMsg;
    window.scrollTo({ top: 0, behavior: "smooth" });
    el.addEventListener("click", fn);
  }
}
async function attemptRegisterUser(username, password) {
  const uri = "/register/submit";
  await fetch(uri, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
function validateRegisterUser() {
  let registerSuccesfully = undefined;

  let validateListener = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("new-password-confirmation").value;
    if (formIsValid()) {
      checkLoadingState(
        registerSuccesfully,
        submitBtn,
        validateListener,
        "Register",
        "Loading..."
      );
      try {
        attemptRegisterUser(username, password).then(async (data) => {
          loginToSession(submitBtn, loginToSession, password);
        });
      } catch (error) {
        registerSuccesfully = false;
        checkLoadingState(
          registerSuccesfully,
          submitBtn,
          validateListener,
          "Register",
          "Loading..."
        );
      }
    } else {
      return;
    }
  };
  submitBtn.addEventListener("click", validateListener);
}
async function attemptCreatePassword() {
  try {
    const currentUser = await checkSession();
    const payload = {
      username: currentUser.username,
      title: document.getElementById("title").value,
      source: document.getElementById("source").value,
      userId: document.getElementById("user").value,
      category: document.getElementById("category").value,
      password: document.getElementById("new-password-confirmation").value,
      description: document.getElementById("description").value,
      specialChar: document.getElementById("allowed_chr").value
        ? document.getElementById("allowed_chr").value
        : null,
      creationDate: document.getElementById("creation").value
        ? document.getElementById("creation").value
        : null,
      expiryDate: document.getElementById("expiry").value
        ? document.getElementById("expiry").value
        : null,
    };
    const uri = "/user-passwords";
    const response = fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    return Error();
  }
}
async function validateCreatePassword() {
  let validateListener = async function () {
    let createdPassword = undefined;
    if (formIsValid()) {
      checkLoadingState(
        createdPassword,
        submitBtn,
        validateListener,
        "Submit",
        "Creating..."
      );
      cautionElement.classList.add("hidden");
      try {
        await attemptCreatePassword().then((data) => {
          if (data.ok) {
            reRouteUser("/password-created");
            return;
          } else {
            createdPassword = false;
            checkLoadingState(
              createdPassword,
              submitBtn,
              validateListener,
              "Submit",
              "Creating..."
            );
            cautionElement.innerText = "Could not create password";
            cautionElement.classList.remove("hidden");
          }
        });
      } catch (err) {
        return;
      }
    } else {
      return;
    }
  };
  submitBtn.addEventListener("click", validateListener);
}
async function searchPasswords(userInput, session) {
  try {
    const sanitizeUserInput = function (input) {
      let result = input.toLowerCase();
      return result;
    };
    const URI = "/search-password";
    const request = await fetch(URI, {
      method: "POST",
      body: JSON.stringify({
        search: sanitizeUserInput(userInput),
        username: session,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return request.json();
  } catch (error) {
    throw new Error(error);
  }
}

async function displaySearchedPasswords(passwordArry) {
  result.innerHTML = "";

  for (let i = 0; i < passwordArry.length; i++) {
    const PASSWORD_CARD_ELEMENT = `<li data-id="${passwordArry[i].title}" data-password="${passwordArry[i].password}" class="consulted_passwords_card">
    <div class="card_options">
    <button  class="options_password"><i class="fa-solid fa-chevron-down"></i></button>
    <ul data-id="${passwordArry[i].title}" class="hidden password_options_menu options_menu">
    </ul>
</div>
    <h3 data-copies="${passwordArry[i].password}" class="interactive_copy">${passwordArry[i].title}</h3>
    <div class="main_details">
        <div data-type="password" class="displayed ">
        <input class="password" readonly value="${passwordArry[i].password}" type="password"">
        <button class="reveal"><i class="fa-solid fa-eye"></i></button></div>
        <ul class="key_details">
            <li data-header="Source" data-type="source"  class="changable"><b data-copies="${passwordArry[i].source}"class="interactive_copy">Source:</b>${passwordArry[i].source}</li>
            <li data-header="User ID" data-type="userId" class="changable" ><b data-copies="${passwordArry[i].userId}"class="interactive_copy">User ID:</b>${passwordArry[i].userId}</li>
            <li data-header="Category" data-type="category" class="changable"><b data-copies="${passwordArry[i].category}"class="interactive_copy">Category:</b> ${passwordArry[i].category}</li>
        </ul>
        <ul class="extra_details">
            <li data-type="description" data-header="Description" class="changable"><b data-copies="${passwordArry[i].description}">Description:</b><p> ${passwordArry[i].description} </p></li>
        </ul>
</div>

</li>`;
    result.innerHTML += PASSWORD_CARD_ELEMENT;
  }
}
function buttonDisplayOptions(btn, idleIcon, activeIcon, options) {
  if (!btn) {
    return;
  }
  btn.classList.toggle("active");
  const btnIsActive = btn.classList.contains("active");
  const toggleIcon = function () {
    if (btnIsActive) {
      btn.innerHTML = activeIcon;
    } else {
      btn.innerHTML = idleIcon;
    }
  };
  const toggleOptions = function () {
    if (btnIsActive) {
      options.forEach((el) => {
        btn.nextElementSibling.innerHTML += el.element;
      });
      btn.nextElementSibling.classList.remove("hidden");
    } else {
      btn.nextElementSibling.innerHTML = "";
      btn.nextElementSibling.classList.add("hidden");
    }
  };
  toggleOptions();
  toggleIcon();
}
function removeElement(el) {
  el.remove();
}
function confirmationModal(fn, e) {
  const modalElement = document.getElementById("main_confirmation");
  const acceptBtn = document.getElementById("accept");
  const denyBtn = document.getElementById("deny");
  modalElement.showModal();
  acceptBtn.addEventListener("click", () => {
    fn(e);
    modalElement.close();
  });
  denyBtn.addEventListener("click", () => {
    modalElement.close();
  });
}
async function deletePassword(passwordTitle) {
  const URI = "/delete-password";
  const session = await checkSession();
  fetch(URI, {
    method: "DELETE",

    body: JSON.stringify({
      title: passwordTitle,
      username: session.username,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function editPassword(passwordTitle, itemsTochange) {
  const URI = "/edit";
  const session = await checkSession();
  fetch(URI, {
    method: "PATCH",

    body: JSON.stringify({
      title: passwordTitle,
      username: session.username,
      items: itemsTochange,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
document.addEventListener("click", async (e) => {
  const parent = e.target.parentElement;
  const cardElement = parent.parentElement.parentElement;
  async function clientRemovesPassword(e) {
    deletePassword(parent.dataset.id);
    removeElement(cardElement);
  }

  async function clientEditsPassword() {
    const currentId = cardElement.dataset.id;
    const currentHTML = cardElement.innerHTML;
    e.target.classList.add("active");
    let originalValues = [];
    const elements = cardElement.querySelectorAll(".changable");
    elements.forEach((el) => {
      originalValues.push({
        [el.dataset.type]: el.childNodes[0].dataset.copies,
      });
      if (el.dataset.type === "category") {
        const original = el.childNodes[0].dataset.copies;
        el.innerHTML = `<b>${el.dataset.header}:</b><select data-id="${el.dataset.type}" id="category" class="changing">
                                <option value="Cryto and Wallets">Cryto and Wallets</option>
            <option value="Google Accounts">Google Accounts</option>
            <option value="Social Media Accounts">Social Media Accounts</option>
            <option value="Programming Tools">Programming Tools</option>
            <option value="One time websites">One time websites</option>
            <option value="Bureoucracy and Paperwork websites">
              Bureoucracy and Paperwork websites
            </option>
            <option value="Bank Accounts">Bank Accounts</option>
            <option value="Work Related Tools">Work Related Tools</option>
            <option value="Work Related Iternal Tools">
              Work Related Iternal Tools
            </option>
            <option value="Owned Domains">Owned Domains</option>
            <option value="Video Games">Video Games</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping and E-commerce">
              Shopping and E-commerce
            </option>
        </select>`;
        let current = el.querySelector("#category").children;
        for (let i = 0; i < current.length; i++) {
          if (current[i].value === original) {
            current[i].setAttribute("selected", "");
          }
        }
      } else {
        el.innerHTML = `<b>${el.dataset.header}:</b><input class="changing" type="text" data-id="${el.dataset.type}" value="${el.childNodes[0].dataset.copies}">`;
      }
    });
    cardElement.innerHTML += `<div class="confirmation_options_box"> <button data-parentid="${cardElement.dataset.id}" class="saveChanges">Save</button>  <button data-parentid="${cardElement.dataset.id}" class="negative_btn cancelChanges">Cancel</button> </div>
    `;
    currentCardToUndo.push({
      id: currentId,
      html: currentHTML,
      originalValues: originalValues,
    });
  }
  function undoChanges() {
    const foundOriginalCard = currentCardToUndo.find(
      (card) => card.id === e.target.dataset.parentid
    );

    parent.parentElement.innerHTML = foundOriginalCard.html;
    const newCurrentCards = currentCardToUndo.filter(
      (card) => card.id !== e.target.dataset.parentid
    );
    currentCardToUndo = newCurrentCards;
    console.log(currentCardToUndo);
  }
  function saveChanges() {
    const title = parent.parentElement.dataset.id;
    const password = parent.parentElement.dataset.password;
    const foundItems = [];
    const elements = parent.parentElement.querySelectorAll(".changing");
    const foundOriginalCard = currentCardToUndo.find(
      (card) => card.id === title
    );
    let editedHTML = "";
    elements.forEach((el) => {
      foundItems.push({ [el.dataset.id]: el.value });
    });
    currentFoundItems.push({ id: title, items: foundItems });
    const changes = function (compare) {
      if (compare.length > 2) {
        return;
      } else {
        let result = [];
        let objEdited = { title: title, password: password };
        for (let i = 0; i < compare[0].length; i++) {
          let originalObj = Object.entries(compare[0][i])[0];
          let newObj = Object.entries(compare[1][i])[0];

          objEdited = { ...objEdited, [newObj[0]]: newObj[1] };
          if (originalObj[1] !== newObj[1]) {
            result.push({ [newObj[0]]: newObj[1] });
          }
        }
        editedHTML = `<div class="card_options">
    <button  class="options_password"><i class="fa-solid fa-chevron-down"></i></button>
    <ul data-id="${objEdited.title}" class="hidden password_options_menu options_menu">
    </ul>
</div>
    <h3 data-copies="${objEdited.password}" class="interactive_copy">${objEdited.title}</h3>
    <div class="main_details">
        <div data-type="password" class="displayed ">
        <input class="password" readonly value="${objEdited.password}" type="password"">
        <button class="reveal"><i class="fa-solid fa-eye"></i></button></div>
        <ul class="key_details">
            <li data-header="Source" data-type="source" class="changable"><b data-copies="${objEdited.source}"class="interactive_copy">Source:</b>${objEdited.source}</li>
            <li data-header="User ID" data-type="userId" class="changable" ><b data-copies="${objEdited.userId}"class="interactive_copy">User ID:</b>${objEdited.userId}</li>
            <li data-header="Category" data-type="category" class="changable"><b data-copies="${objEdited.category}"class="interactive_copy">Category:</b> ${objEdited.category}</li>
        </ul>
        <ul class="extra_details">
            <li data-header="Description" data-type="description" class="changable"><b data-copies="${objEdited.description}">Description:</b><p> ${objEdited.description} </p></li>
        </ul>
</div>

`;
        return result;
      }
    };

    if (changes([foundOriginalCard.originalValues, foundItems]).length < 1) {
      parent.parentElement.innerHTML = editedHTML;
    } else {
      editPassword(
        title,
        changes([foundOriginalCard.originalValues, foundItems])
      );
      parent.parentElement.innerHTML = editedHTML;
      const newCurrentCards = currentCardToUndo.filter(
        (card) => card.id !== e.target.dataset.parentid
      );
      currentCardToUndo = newCurrentCards;
      console.log(currentCardToUndo);
    }
  }

  let clickedBtn = e.target.matches(".options_password")
    ? e.target.matches(".options_password")
    : e.target.parentElement.matches(".options_password");
  let btnDeletePassword = e.target.matches(".btn_delete_password");
  let btnEditPassword = e.target.matches(".btn_edit_password:not(.active)");
  let btnCancelChanges = e.target.matches(".cancelChanges");
  let btnSaveChanges = e.target.matches(".saveChanges");
  let options_password = {
    condition: e.target.matches(".options_password")
      ? e.target.matches(".options_password")
      : e.target.parentElement.matches(".options_password"),
    btnElement: function (e) {
      if (e.target.matches(".options_password")) {
        return e.target;
      }
      if (e.target.parentElement.matches(".options_password")) {
        return e.target.parentElement;
      } else {
        return null;
      }
    },
    options: [
      {
        action: "Edit",
        element: `<li class="btn_edit_password">Edit</li>`,
      },
      {
        action: "More",
        element: `<li>More</li>`,
      },
      {
        action: "Delete",
        element: `<li style="color:var(--accent)"  class="btn_delete_password">Delete</li>`,
      },
    ],
  };
  switch (true) {
    case options_password.condition:
      buttonDisplayOptions(
        options_password.btnElement(e),
        `<i class="fa-solid fa-chevron-down"></i>`,
        `<i class="fa-solid fa-chevron-up"></i>`,
        options_password.options
      );
      break;
    case btnDeletePassword:
      confirmationModal(clientRemovesPassword, e);
      break;
    case btnCancelChanges:
      undoChanges();
      break;
    case btnEditPassword:
      clientEditsPassword();
      break;
    case btnSaveChanges:
      saveChanges();
    default:
      break;
  }
});

document.addEventListener("click", (e) => {
  if (
    e.target.matches(".nav_responsive_button") ||
    e.target.matches(".nav_responsive_button span")
  ) {
    document.querySelector(".nav_responsive").classList.toggle("hidden");
  }
});
if (register) {
  validateRegisterPassword();
  validateRegisterUser();
  submitBtn.addEventListener("click", (e) => {
    if (formIsValid()) {
      cautionElement.classList.add("hidden");
    } else {
      cautionElement.classList.remove("hidden");
    }
    e.preventDefault();
  });
}
if (login) {
  validateLogin(loginBtn);
  submitBtn.addEventListener("click", (e) => {
    if (formIsValid()) {
      cautionElement.classList.add("hidden");
    } else {
      cautionElement.classList.remove("hidden");
    }
    e.preventDefault();
  });
}

if (session_saved) {
  initialize();
  const user = async function () {
    const response = await checkSession();
    validateLogin(loginBtn, response.username);
  };
  user();
  document.addEventListener("click", (e) => {
    if (e.target.matches("#logout")) {
      removeCookies();
    }
  });
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (formIsValid()) {
      cautionElement.classList.add("hidden");
    } else {
      cautionElement.classList.remove("hidden");
    }
  });
}
if (dashboard) {
  initialize();
  document.addEventListener("click", (e) => {
    if (e.target.matches("#logout")) {
      removeCookies();
    }
  });
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let session = await checkSession();
    displaySearchedPasswords(
      await searchPasswords(
        document.getElementById("main_search_bar").value,
        session.username
      )
    ).then((data) => {
      result.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    });
  });
}
if (create_password) {
  validateRegisterPassword();
  validateCreatePassword();
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (formIsValid()) {
      cautionElement.classList.add("hidden");
    } else {
      cautionElement.classList.remove("hidden");
    }
  });
}

function removeCookies() {
  document.cookie = "tokenLate=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=";
  document.cookie = "tokenEarly=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=";
}

let timer;

function reloadPageInactivity() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    location.reload();
  }, Math.floor(1000 * 60 * 60));
}
preventsReload.forEach((event) => {
  window.addEventListener(event, reloadPageInactivity);
});
reloadPageInactivity();
