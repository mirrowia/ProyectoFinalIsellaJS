const listaUsuario = [];
//=========================CREAR CLASE USUARIO=========================//
class Usuario {
  constructor(nombre, apellido, edad, email, clave, array) {
    this.id = this.setId(array);
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.email = email;
    this.clave = clave;
    this.profilePicture =
      "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
  }

  setId(array) {
    if (array.length == 0) {
      return 1;
    } else {
      array.sort((a, b) => {
        return a.id - b.id;
      });
      let lastElement = array[array.length - 1];
      let idValue = lastElement.id;
      idValue++;
      return idValue;
    }
  }
}

//=========================DECLARACION DE VARIALBES=========================//
let tries = 3;
let loggedUser;
//=========================DECLARAR FUNCIONES=========================//
//INSERTAR EJEMPLOS EN LISTA

async function fillList() {
  if (localStorage.getItem("userList") === null) {
    const getInfo = () => {
      return new Promise((resolve, reject) => {
        fetch("https://swapi.dev/api/people")
          .then((response) => response.json())
          .then((json) => resolve(json));
      });
    };

    let fetchedList = await getInfo();
    fetchedList.results.forEach((element) => {
      let usuario;
      let nombre;
      let apellido;
      let edad = element.birth_year;
      let email;
      let password = element.height;

      if (element.name.includes(" ")) {
        const [first, ...rest] = element.name.split(" ");
        nombre = first;
        apellido = rest.join(" ");
      } else if (element.name.includes("-")) {
        nombre = element.name.split("-")[0];
        apellido = element.name.split("-")[1];
      }
      email = nombre.toLowerCase() + apellido.toLowerCase() + "@starwars.com";

      usuario = new Usuario(
        nombre,
        apellido,
        edad,
        email,
        password,
        listaUsuario
      );
      listaUsuario.push(usuario);
    });

    () => {
      let usuario;
      usuario = new Usuario(
        "Solid",
        "Snake",
        42,
        "metalgear@gmail.com",
        "lalilulelo",
        listaUsuario
      );

      usuario.profilePicture =
        "https://static.wikia.nocookie.net/metalgear/images/e/e9/SnakeI15.png/revision/latest?cb=20160722234931&path-prefix=es";
      listaUsuario.push(usuario);

      usuario = new Usuario(
        "Sam",
        "Porter",
        40,
        "deathstranding@gmail.com",
        "Luden",
        listaUsuario
      );

      usuario.profilePicture =
        "https://sm.ign.com/t/ign_es/gallery/d/death-stra/death-stranding-every-confirmed-character-so-far_skpd.960.jpg";
      listaUsuario.push(usuario);

      usuario = new Usuario(
        "Dante",
        "Sparda",
        45,
        "dmc@gmail.com",
        "Nero",
        listaUsuario
      );

      usuario.profilePicture =
        "https://i.pinimg.com/564x/b1/b2/cb/b1b2cb1fa43c79e52a86e51c448ac04e.jpg";
      listaUsuario.push(usuario);

      usuario = new Usuario(
        "Sebastian",
        "Castellanos",
        38,
        "theevilwithin@gmail.com",
        "Lily",
        listaUsuario
      );

      usuario.profilePicture =
        "https://i.pinimg.com/564x/40/58/fc/4058fc497b784fe0fd906ca36397c276.jpg";
      listaUsuario.push(usuario);
    };

    localStorage.setItem("userList", JSON.stringify(listaUsuario));
  } else {
    const getStoredList = () => {
      return new Promise((resolve, reject) => {
        resolve(JSON.parse(localStorage.getItem("userList")));
      });
    };
    let storedList = await getStoredList();

    storedList.forEach((element) => {
      let usuario = new Usuario(
        element.nombre,
        element.apellido,
        element.edad,
        element.email,
        element.clave,
        listaUsuario
      );
      usuario.setId = element.id;
      usuario.profilePicture = element.profilePicture;
      listaUsuario.push(usuario);
    });
  }
}
//PRIMERA LETRA A MAYÚSCULA
function fToUpperCase(string) {
  return (tempString =
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase());
}
//VALIDACIÓN DE INICIO DE SESIÓN
function login(user, password) {
  if (tries == 0) {
    toastifyError(
      "Por motivos de seguridad no se puede seguir intentando. Favor de recargar la pagina y volver a intentar."
    );
    exit;
  }

  let emailInput = document.getElementById("emailInput").value;
  let pwInput = document.getElementById("pwInput").value;

  let loginOk = false;
  let userId;

  if (emailInput == "" || pwInput== "") {
    toastifyError("Completa todos los campos");
  } else {
    listaUsuario.forEach((element) => {
      if (emailInput.toLowerCase() == element.email.toLowerCase()) {
        if (pwInput == element.clave) {
          loginOk = true;
          userId = element.id;
          tries = 3;
          loggedUser = element;
        }
      }
    });

    if (loginOk) {
      listaUsuario.forEach((usuario) => {
        if (usuario.id == userId) {
          toastifyOk("Inicio de sesión correcto");
          if (document.getElementById("loginFrame") != null) {
            document.getElementById("loginFrame").remove();
            createListFrame();
            localStorage.setItem("user", JSON.stringify(usuario));
          }
          return usuario;
        }
      });
    } else {
      tries -= 1;
      tries != 0
        ? toastifyError("Datos erroneos. Quedan " + tries + " Inentos")
        : toastifyError("Datos erroneos. No quedan mas intentos");
    }
  }
}
//VALIDACIÓN DE REGISTRO
function register() {
  let nameInput = document.getElementById("nameInput").value;
  let surnameInput = document.getElementById("surnameInput").value;
  let ageInput = document.getElementById("ageInput").value;
  let emailInput = document.getElementById("emailInput").value;
  let pwInput = document.getElementById("pwInput").value;
  let pw2Input = document.getElementById("pw2Input").value;

  if (
    nameInput == "" ||
    surnameInput == "" ||
    ageInput == "" ||
    emailInput == "" ||
    pwInput == "" ||
    pw2Input == ""
  ) {
    toastifyError("Completa todos los campos");
  } else {
    let correoExist = false;
    listaUsuario.forEach((usuario) => {
      if (emailInput.toLowerCase() == usuario.email.toLowerCase()) {
        correoExist = true;
      }
    });
    if (correoExist) {
      toastifyError("El correo ingresado ya se encuentra registrado.");
    } else {
      if (pwInput != pw2Input) {
        toastifyError("Las claves no coinciden");
      } else {
        if (isNaN(ageInput) || ageInput < 5 || ageInput > 105) {
          toastifyError("Favor de ingresar una edad valida.");
        } else {
          let usuario = new Usuario(
            fToUpperCase(nameInput),
            fToUpperCase(surnameInput),
            ageInput,
            emailInput.toLowerCase(),
            pwInput,
            listaUsuario
          );
          listaUsuario.push(usuario);
          move("registerFrame", createLogin());
          toastifyOk("Usuario creado correctamente.");
        }
      }
    }
  }
}
//ELIMINA USUARIO
function deleteUser(id) {
  if (loggedUser.id == id) {
    toastifyError("No podes eliminar tu usuario.");
    return;
  }
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      listaUsuario.forEach((usuario) => {
        if (usuario.id == id) {
          let index = listaUsuario.indexOf(usuario);
          listaUsuario.splice(index, 1);
          document.getElementById("userList").remove();
          fillListFrame();
          localStorage.setItem("userList", JSON.stringify(listaUsuario));
        }
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      });
    }
  });
}
//MODIFICA USUARIO
function modifyUser(id) {
  loggedUser = JSON.parse(localStorage.getItem("user"));
  user = getUser(id);

  if (document.getElementById("listFrame") != null) {
    document.getElementById("listFrame").remove();
  }
  const userFrame = createElement("userFrame", "div");
  const title = createElement("title", "p");

  const userRow = createElement("userRow", "div");
  const userColumn1 = createElement("userColumn1", "div");
  const userColumn2 = createElement("userColumn2", "div");

  const nameDiv = createElement("nameDiv", "div");
  const nameInput = createElement("nameInput", "input");
  const nameLabel = createElement("nameLabel", "label");

  const surnameDiv = createElement("surnameDiv", "div");
  const surnameInput = createElement("surnameInput", "input");
  const surnameLabel = createElement("surnameLabel", "label");

  const ageDiv = createElement("ageDiv", "div");
  const ageInput = createElement("ageInput", "input");
  const ageLabel = createElement("ageLabel", "label");

  const emailDiv = createElement("emailDiv", "div");
  const emailInput = createElement("emailInput", "input");
  const emailLabel = createElement("emailLabel", "label");

  const pwDiv = createElement("pwDiv", "div");
  const pwInput = createElement("pwInput", "input");
  const pwLabel = createElement("pwLabel", "label");

  const pw2Div = createElement("pw2Div", "div");
  const pw2Input = createElement("pw2Input", "input");
  const pw2Label = createElement("pw2Label", "label");

  const imgFrame = createElement("imgFrame", "div");
  const userImg = createElement("userImg", "img");
  const imgOpt = createElement("imgOpt", "div");
  const btnAddImg = createElement("btnAddImg", "button");
  const btnRemoveImg = createElement("btnRemoveImg", "button");

  const btnBack = createElement("btnBack", "button");
  const btnSave = createElement("btnSave", "button");

  document.body.appendChild(userFrame);
  userFrame.className =
    "container m-auto p-5 w-50 border position-absolute top-50 start-50 translate-middle bg-light";
  userFrame.appendChild(title);
  title.innerHTML = "Registro";
  title.className = "fs-1 text-center p-2";

  userFrame.appendChild(userRow);
  userRow.className = "row";
  userRow.appendChild(userColumn1);
  userColumn1.className = "col-6";
  userRow.appendChild(userColumn2);
  userColumn2.className = "col-6";

  userColumn1.appendChild(nameDiv);
  nameDiv.className = "form-floating mb-3";
  nameDiv.appendChild(nameInput);
  nameInput.type = "text";
  nameInput.className = "form-control";
  nameInput.placeholder = "Nombre";
  nameInput.value = user.nombre;
  nameDiv.appendChild(nameLabel);
  nameLabel.innerHTML = "Nombre";
  nameLabel.setAttribute("for", "userInput");

  userColumn1.appendChild(surnameDiv);
  surnameDiv.className = "form-floating mb-3";
  surnameDiv.appendChild(surnameInput);
  surnameInput.type = "text";
  surnameInput.className = "form-control";
  surnameInput.placeholder = "Apellido";
  surnameInput.value = user.apellido;
  surnameDiv.appendChild(surnameLabel);
  surnameLabel.innerHTML = "Apellido";
  surnameLabel.setAttribute("for", "userInput");

  userColumn1.appendChild(ageDiv);
  ageDiv.className = "form-floating mb-3";
  ageDiv.appendChild(ageInput);
  ageInput.type = "text";
  ageInput.className = "form-control";
  ageInput.placeholder = "Edad";
  ageInput.value = user.edad;
  ageDiv.appendChild(ageLabel);
  ageLabel.innerHTML = "Edad";
  ageLabel.setAttribute("for", "userInput");

  userColumn1.appendChild(emailDiv);
  emailDiv.className = "form-floating mb-3";
  emailDiv.appendChild(emailInput);
  emailInput.type = "text";
  emailInput.className = "form-control";
  emailInput.placeholder = "Email";
  emailInput.value = user.email;
  emailDiv.appendChild(emailLabel);
  emailLabel.innerHTML = "Email";
  emailLabel.setAttribute("for", "userInput");

  userColumn1.appendChild(pwDiv);
  pwDiv.className = "form-floating mb-3";
  pwDiv.appendChild(pwInput);
  pwInput.type = "password";
  pwInput.className = "form-control";
  pwInput.placeholder = "Contraseña";
  pwDiv.appendChild(pwLabel);
  pwLabel.innerHTML = "Contraseña";
  pwLabel.setAttribute("for", "userInput");

  userColumn1.appendChild(pw2Div);
  pw2Div.className = "form-floating mb-3";
  pw2Div.appendChild(pw2Input);
  pw2Input.type = "password";
  pw2Input.className = "form-control";
  pw2Input.placeholder = "Repite la contraseña";
  pw2Div.appendChild(pw2Label);
  pw2Label.innerHTML = "Repite la contraseña";
  pw2Label.setAttribute("for", "userInput");

  userColumn2.appendChild(imgFrame);
  imgFrame.appendChild(userImg);
  imgFrame.className = "d-flex justify-content-center mb-5";
  userImg.setAttribute("src", user.profilePicture);
  userImg.setAttribute("height", "250");
  userImg.setAttribute("width", "250");

  userColumn2.appendChild(imgOpt);
  imgOpt.className = "d-flex justify-content-evenly";

  imgOpt.appendChild(btnAddImg);
  btnAddImg.innerHTML = "Establecer imagen";
  btnAddImg.className = "btn btn-primary my-2 mx-3 w-50";
  btnAddImg.setAttribute("onClick", "setImg(" + user.id + ")");

  imgOpt.appendChild(btnRemoveImg);
  btnRemoveImg.innerHTML = "Quitar imagen";
  btnRemoveImg.className = "btn btn-danger my-2 mx-3 w-50";
  btnRemoveImg.setAttribute("onClick", "removeImg(" + user.id + ")");

  userColumn1.appendChild(btnBack);
  btnBack.innerHTML = "Regresar";
  btnBack.className = "btn btn-outline-secondary my-2 mx-2";
  btnBack.setAttribute("onClick", "move('userFrame', createListFrame())");

  userColumn1.appendChild(btnSave);
  btnSave.innerHTML = "Guardar";
  btnSave.className = "btn btn-success my-2 mx-2";
  btnSave.setAttribute("onClick", "saveInfo(" + user.id + ")");
}
//GUARDAR INFO DEL USUARIO
function saveInfo(id) {
  user = getUser(id);
  if (pwInput.value !== "" || pw2Input.value !== "") {
    if (pwInput.value !== "" && pw2Input.value !== "") {
      if (pwInput.value === pw2Input.value) {
        if (nameInput.value.localeCompare("")) {
          user.nombre = nameInput.value;
        }
        if (surnameInput.value.localeCompare("")) {
          user.apellido = surnameInput.value;
        }
        if (ageInput.value.localeCompare("")) {
          user.edad = ageInput.value;
        }
        if (emailInput.value.localeCompare("")) {
          user.email = emailInput.value;
        }
        user.password = pwInput.value;
      }

      toastifyOk("Usuario modificado");
      move("userFrame", createListFrame());
    } else {
      toastifyError("Verifica las claves");
    }
  } else {
    if (nameInput.value.localeCompare("")) {
      user.nombre = nameInput.value;
    }
    if (surnameInput.value.localeCompare("")) {
      user.apellido = surnameInput.value;
    }
    if (ageInput.value.localeCompare("")) {
      user.edad = ageInput.value;
    }
    if (emailInput.value.localeCompare("")) {
      user.email = emailInput.value;
    }

    //VERIFICO SI EL USUARIO QUE SE MODIFICÓ ES EL LOGGEADO
    if(id == JSON.parse(localStorage.getItem("user")).id){
      localStorage.setItem("user", JSON.stringify(user))
      loggedUser = user;
    }

    localStorage.setItem("userList", JSON.stringify(listaUsuario));
    toastifyOk("Usuario modificado");
    move("userFrame", createListFrame());
  }
}
//ESTABLECER IMAGEN DE USUARIO
async function setImg(id) {
  let user = getUser(id);

  const { value: url } = await Swal.fire({
    input: "url",
    inputLabel: "Dirección URL",
    inputPlaceholder: "Ingresa la URL",
  });

  if (url) {
    user.profilePicture = url;
    document.getElementById("userImg").remove;
    imgFrame.appendChild(userImg);
    imgFrame.className = "d-flex justify-content-center mb-5";
    userImg.setAttribute("src", user.profilePicture);
    userImg.setAttribute("height", "250");
    userImg.setAttribute("width", "250");
  }
}
//ELIMINAR IMAGEN
function removeImg(id) {
  let user = getUser(id);

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      user.profilePicture =
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
      document.getElementById("userImg").remove;
      imgFrame.appendChild(userImg);
      imgFrame.className = "d-flex justify-content-center mb-5";
      userImg.setAttribute("src", user.profilePicture);
      userImg.setAttribute("height", "250");
      userImg.setAttribute("width", "250");
    }
  });
}
//PASA DE UN DIV A OTRO
function move(ActualDiv, functionCall) {
  document.getElementById(ActualDiv).remove();
  functionCall;
}
//OBTENER USUARIO
function getUser(userId) {
  let usuario;
  listaUsuario.forEach((user) => {
    if (user.id == userId) {
      usuario = user;
    }
  });
  return usuario;
}
//CREA ELEMENTOS EN EL DOM CON UN ID
function createElement(idName, element) {
  let a = document.createElement(element);
  a.id = idName;
  return a;
}
//CREA UN DIV DE LOGIN
function createLogin() {
  const loginFrame = createElement("loginFrame", "div");
  const title = createElement("title", "p");
  const emailDiv = createElement("emailDiv", "div");
  const emailInput = createElement("emailInput", "input");
  const emailLabel = createElement("emailLabel", "label");
  const pwDiv = createElement("pwDiv", "div");
  const pwInput = createElement("pwInput", "input");
  const pwLabel = createElement("pwLabel", "label");
  const aRegister = createElement("aRegister", "a");
  const btnLogin = createElement("btnLogin", "button");

  document.body.appendChild(loginFrame);
  loginFrame.className =
    "d-flex flex-column m-auto p-5 w-50 border position-absolute top-50 start-50 translate-middle bg-light";
  loginFrame.appendChild(title);
  title.innerHTML = "Login";
  title.className = "fs-1 text-center p-2";

  loginFrame.appendChild(emailDiv);
  emailDiv.className = "form-floating mb-3";
  emailDiv.appendChild(emailInput);
  emailInput.type = "text";
  emailInput.className = "form-control";
  emailInput.placeholder = "Email";
  emailDiv.appendChild(emailLabel);
  emailLabel.innerHTML = "Email";
  emailLabel.setAttribute("for", "emailInput");

  loginFrame.appendChild(pwDiv);
  pwDiv.className = "form-floating mb-3";
  pwDiv.appendChild(pwInput);
  pwInput.type = "password";
  pwInput.className = "form-control";
  pwInput.placeholder = "Clave";

  pwDiv.appendChild(pwLabel);
  pwLabel.innerHTML = "Clave";

  loginFrame.appendChild(aRegister);
  aRegister.innerHTML = "¿No estás registrado? Registrate acá";
  aRegister.className = "my-4";
  aRegister.href = "javascript:void(0);";
  aRegister.setAttribute("onClick", "move('loginFrame', createRegister())");
  loginFrame.appendChild(btnLogin);
  btnLogin.innerHTML = "Iniciar Sesión";
  btnLogin.className = "btn btn-primary";
  btnLogin.setAttribute("onClick", "loggedUser = login()");
}
//CREA UN DIV DE REGISTRO
function createRegister() {
  const registerFrame = createElement("registerFrame", "div");
  const title = createElement("title", "p");

  const nameDiv = createElement("nameDiv", "div");
  const nameInput = createElement("nameInput", "input");
  const nameLabel = createElement("nameLabel", "label");

  const surnameDiv = createElement("surnameDiv", "div");
  const surnameInput = createElement("surnameInput", "input");
  const surnameLabel = createElement("surnameLabel", "label");

  const ageDiv = createElement("ageDiv", "div");
  const ageInput = createElement("ageInput", "input");
  const ageLabel = createElement("ageLabel", "label");

  const emailDiv = createElement("emailDiv", "div");
  const emailInput = createElement("emailInput", "input");
  const emailLabel = createElement("emailLabel", "label");

  const pwDiv = createElement("pwDiv", "div");
  const pwInput = createElement("pwInput", "input");
  const pwLabel = createElement("pwLabel", "label");

  const pw2Div = createElement("pw2Div", "div");
  const pw2Input = createElement("pw2Input", "input");
  const pw2Label = createElement("pw2Label", "label");

  const btnBack = createElement("btnBack", "button");
  const btnRegister = createElement("btnRegister", "button");

  document.body.appendChild(registerFrame);
  registerFrame.className =
    "d-flex flex-column m-auto p-5 w-50 border position-absolute top-50 start-50 translate-middle bg-light";
  registerFrame.appendChild(title);
  title.innerHTML = "Registro";
  title.className = "fs-1 text-center p-2";

  registerFrame.appendChild(nameDiv);
  nameDiv.className = "form-floating mb-3";
  nameDiv.appendChild(nameInput);
  nameInput.type = "text";
  nameInput.className = "form-control";
  nameInput.placeholder = "Nombre";
  nameDiv.appendChild(nameLabel);
  nameLabel.innerHTML = "Nombre";
  nameLabel.setAttribute("for", "userInput");

  registerFrame.appendChild(surnameDiv);
  surnameDiv.className = "form-floating mb-3";
  surnameDiv.appendChild(surnameInput);
  surnameInput.type = "text";
  surnameInput.className = "form-control";
  surnameInput.placeholder = "Apellido";
  surnameDiv.appendChild(surnameLabel);
  surnameLabel.innerHTML = "Apellido";
  surnameLabel.setAttribute("for", "userInput");

  registerFrame.appendChild(ageDiv);
  ageDiv.className = "form-floating mb-3";
  ageDiv.appendChild(ageInput);
  ageInput.type = "text";
  ageInput.className = "form-control";
  ageInput.placeholder = "Edad";
  ageDiv.appendChild(ageLabel);
  ageLabel.innerHTML = "Edad";
  ageLabel.setAttribute("for", "userInput");

  registerFrame.appendChild(emailDiv);
  emailDiv.className = "form-floating mb-3";
  emailDiv.appendChild(emailInput);
  emailInput.type = "text";
  emailInput.className = "form-control";
  emailInput.placeholder = "Email";
  emailDiv.appendChild(emailLabel);
  emailLabel.innerHTML = "Email";
  emailLabel.setAttribute("for", "userInput");

  registerFrame.appendChild(pwDiv);
  pwDiv.className = "form-floating mb-3";
  pwDiv.appendChild(pwInput);
  pwInput.type = "password";
  pwInput.className = "form-control";
  pwInput.placeholder = "Contraseña";
  pwDiv.appendChild(pwLabel);
  pwLabel.innerHTML = "Contraseña";
  pwLabel.setAttribute("for", "userInput");

  registerFrame.appendChild(pw2Div);
  pw2Div.className = "form-floating mb-3";
  pw2Div.appendChild(pw2Input);
  pw2Input.type = "password";
  pw2Input.className = "form-control";
  pw2Input.placeholder = "Repite la contraseña";
  pw2Div.appendChild(pw2Label);
  pw2Label.innerHTML = "Repite la contraseña";
  pw2Label.setAttribute("for", "userInput");

  registerFrame.appendChild(btnBack);
  btnBack.innerHTML = "Regresar";
  btnBack.className = "btn btn-secondary my-2";
  btnBack.setAttribute("onClick", "move('registerFrame', createLogin())");

  registerFrame.appendChild(btnRegister);
  btnRegister.innerHTML = "Registrar";
  btnRegister.className = "btn btn-primary my-2";
  btnRegister.setAttribute("onClick", "register()");
}
//CREA DIV PARA LISTAR USUARIOS
function createListFrame() {
  const listFrame = createElement("listFrame", "div");
  const loggedUserdiv = createElement("loggedUserdiv", "div");
  const loggedUserInfo = createElement("loggedUserInfo", "p");
  const loggedUserBtn = createElement("loggedUserBtn", "button");
  const userListFrame = createElement("userListFrame", "div");

  document.body.appendChild(listFrame);
  listFrame.appendChild(loggedUserdiv);
  loggedUserdiv.className =
    "d-flex justify-content-end fs-3 text bg-black bg-gradient text-light";
  listFrame.appendChild(userListFrame);

  loggedUserdiv.appendChild(loggedUserInfo);
  loggedUserInfo.innerHTML =
    "Hola " + loggedUser.apellido + ", " + loggedUser.nombre + "";
  loggedUserInfo.className = "d-flex justify-content-end fs-3 text m-2";
  loggedUserdiv.appendChild(loggedUserBtn);
  loggedUserBtn.innerHTML = "Cerrar sesión";
  loggedUserBtn.className = "btn btn-danger m-2";
  loggedUserBtn.setAttribute("onClick", "logout()");
  fillListFrame();
}
//CERRAR SESIÓN
function logout() {
  localStorage.removeItem("user");
  move("listFrame", createLogin());
}
//LISTA LOS USUARIOS
function fillListFrame() {
  let listFrame = document.getElementById("userListFrame");
  const userContainer = document.createElement("div");
  userContainer.className = "container-fluid";
  userContainer.id = "userList";

  listFrame.appendChild(userContainer);

  listaUsuario.forEach((user) => {
    const userContainerRow = document.createElement("div");

    if (loggedUser.id == user.id) {
      userContainerRow.className =
        "row py-3 bg-secondary bg-gradient border border-light-subtle text-light";
    } else {
      userContainerRow.className =
        "row py-3 bg-dark bg-gradient border border-light-subtle text-light";
    }

    userContainer.appendChild(userContainerRow);

    const userContainerCol1 = document.createElement("div");
    userContainerCol1.className = "col-1";
    const userContainerCol2 = document.createElement("div");
    userContainerCol2.className = "col-10";
    const userContainerCol3 = document.createElement("div");
    userContainerCol3.className = "col-1";

    const userModify = document.createElement("i");
    userModify.className = "bi bi-pencil-square mx-2 cursor-pointer";
    userModify.id = user.id;
    userModify.setAttribute("onClick", "modifyUser(" + user.id + ")");
    userModify.setAttribute("type", "button");
    const userDelete = document.createElement("i");
    userDelete.className = "bi bi-trash-fill mx-2 cursor-pointer";
    userDelete.id = user.id;
    userDelete.setAttribute("onClick", "deleteUser(" + user.id + ")");
    userDelete.setAttribute("type", "button");

    userContainerRow.appendChild(userContainerCol1);
    userContainerRow.appendChild(userContainerCol2);
    userContainerRow.appendChild(userContainerCol3);
    userContainerCol3.appendChild(userModify);
    userContainerCol3.appendChild(userDelete);

    userContainerCol1.innerHTML = user.id;
    userContainerCol2.innerHTML = user.nombre + " " + user.apellido;
  });
}
//TOASTYFY DE ERROR CON TEXTO CUSTOM
function toastifyError(text) {
  Toastify({
    text: text,
    gravity: "bottom",
    duration: 3000,
    style: {
      background: "linear-gradient(to right, #FF8787, #DE4B4B)",
    },
  }).showToast();
}
//TOASTYFY DE ERROR CON TEXTO CUSTOM
function toastifyOk(text) {
  Toastify({
    text: text,
    gravity: "bottom",
    duration: 3000,
    style: {
      background: "linear-gradient(to right, #5AE970, #61D372)",
    },
  }).showToast();
}

async function startApp () {
  await fillList();

  if (localStorage.getItem("user") !== null) {
  loggedUser = JSON.parse(localStorage.getItem("user"));
  let existe = false;
  listaUsuario.forEach((usuario) => {
    if (usuario.id == loggedUser.id) {
      existe = true;
    }
  });
  if (existe == false) {
    let usuario = new Usuario(
      loggedUser.nombre,
      loggedUser.apellido,
      loggedUser.edad,
      loggedUser.email,
      loggedUser.password,
      listaUsuario
    );
    usuario.id = loggedUser.id;

    usuario.profilePicture =
      "https://static.wikia.nocookie.net/metalgear/images/e/e9/SnakeI15.png/revision/latest?cb=20160722234931&path-prefix=es";
    listaUsuario.push(usuario);
  }
  createListFrame();
} else {
  createLogin();
}
}
 
startApp();
