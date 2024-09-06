
const btns = document.querySelectorAll(".reveal")
const interactiveCopy = document.querySelectorAll(".interactive_copy")
const inputs = document.querySelectorAll("form input")
const inputsNotOptional = document.querySelectorAll("form input:not(.optional)")
const submitBtn = document.querySelector("button[type='submit']")
const loginBtn = document.querySelector("button[type='submit'].login_button")
const register = document.getElementById("register")
const login = document.getElementById("login")
const logout = document.getElementById("logout")
const session_saved = document.getElementById("session_saved")
const create_password = document.getElementById("create_password")
const dashboard = document.getElementById("dashboard")
const cautionElement = document.querySelector(".validation_msg")
const result = document.getElementById("result")
const searchBtn = document.getElementById("search")
const errorMessages = {
    invalidLoginDetails :"Password or username is wrong",
    lockedAccount:"Account is locked, please contact administrator",
}
function defaultStateInizialitation(){
    const inputFocus = document.querySelector("#password")
    const focusToPassword = function(){
        inputFocus.focus()
    }
    window.onload(focusToPassword())

}
async function initialize(){
    let currentUser = await checkSession()
    const setSession = function(){
        const request = fetch()
    }
    async function setUser(){
        const usernameEl = document.getElementById("current_user")
        usernameEl.innerText = currentUser.username
    }
    setUser()
}
async function checkSession (){
    const session = localStorage.getItem("session")

    const parsedSession = JSON.parse(session)

    const authenticate = async function(token){
        try{
            const uri = "http://localhost:3330/login/checkUser"
            const response = await fetch(uri,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    token:token,
                })

            })
            return response.json()
        }catch(err){
            throw new Error(err)
        }
    }

        try{
            let cookie = document.cookie.split(";")[0].split("=")[1]
            let response = await authenticate(cookie)
            return  response
        }catch{
            try{
                let cookie = document.cookie.split(";")[1].split("=")[1]
                let response = await authenticate(cookie)
                return  response
            }catch(error){
                throw new Error(error)
            }
        }
    
}

interactiveCopy.forEach((el)=>{
    el.addEventListener("click",()=>{
        if(el.classList.contains("copied")){
            return
        }
        const copy_msg = document.createElement("span")
        copy_msg.classList.add("copied_msg")
        copy_msg.innerText ="copied"
        el.appendChild(copy_msg)
        el.classList.add("copied")
        
    })
})

document.addEventListener("click",(e)=>{
         if(e.target.parentElement.matches(".reveal")){
            
            let input = e.target.parentElement.previousElementSibling
            
            if(e.target.tagName == "BUTTON"){
                input = e.target.previousElementSibling
            }if(e.target.tagName == "I"){
                e.target.parentElement.previousElementSibling
            }
            
            
            if(input.type === "text"){
                input.setAttribute("type","password")
                
                
            }else{
                input.setAttribute("type","text")
                
            }
         }
            
        })   
    

    
    
function validateRegisterPassword(){
    const parent = document.querySelector(".password_box")
    const password = document.querySelector("#new-password")
    const passwordConfirmation = document.querySelector("#new-password-confirmation")
    const helpMessage = document.querySelector(".help_msg.confirm_password")
    const PASSWORD_ELEMENTS =  [password,passwordConfirmation,helpMessage]
    
    const handleAdd = function(className){
        PASSWORD_ELEMENTS.forEach((el)=>{
            el.classList.add(`${className}`)
        })
    }
    const handleRemove = function(className){
        PASSWORD_ELEMENTS.forEach((el)=>{
            el.classList.remove(`${className}`)
        })
    }
    
function errorHandling(input, inputComparison){
        const baseMsg = "Confirm new password"
        const passwordMatch = input === inputComparison
        const regexHelper = {
            blankSpaces: /\s\s/,
        }
        if(input.length === 1 && inputComparison.length === 1){
            helpMessage.innerText = "Password must have at least 2 digits"
            
        } else{
            if(input.length < 1 && inputComparison.length < 1){
                helpMessage.innerText = baseMsg
                handleRemove("match")
                handleRemove("mismatch")
                
            }else{
                if(regexHelper.blankSpaces.test(input) && regexHelper.blankSpaces.test(inputComparison) ){
                    helpMessage.innerText = "Password cannot be blank spaces"
                    handleRemove("match")
                    handleAdd("mismatch")
                }else{
                    if(!passwordMatch){
                        helpMessage.innerText = "Passwords must match!"
                    }
                    if(passwordMatch){
                        helpMessage.innerText = "Password matches"
                    }
                    if(input !== inputComparison){
                        handleRemove("match")
                        handleAdd("mismatch")
                        
                    }
                    if(input === inputComparison){
                        handleRemove("mismatch")
                        handleAdd("match")
                    }
                }
                
            }
            
            
        }
        
        
        
        
    }
    parent.addEventListener("input",()=>{
        errorHandling(password.value,passwordConfirmation.value)
    })
}
function formIsValid(){
    
    for(let i = 0 ; i < inputsNotOptional.length ; i++){
        if(inputsNotOptional[i].classList.contains("mismatch") || inputsNotOptional[i].value.length < 1){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false
        }
    }
    return true
}

function validateLogin(element,getUsername = undefined){
let validateListener = loginToSession
element.addEventListener("click",()=>{
    validateListener(element,validateListener,document.getElementById("password").value,getUsername)
}) 

}


async function attemptLogin(username,password){
    const uri = "http://localhost:3330/login"
    try {
        const response = fetch(uri,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body :JSON.stringify(
                {
                    username:username,
                    password:password
                })
            }).then(async (data)=>{
                return data
            })
            
            return response
        } catch (error) {
            throw new Error(error)
        }
}
function loginToSession(el,validateListener,getPassword,getUsername = undefined){
    let loginValidationSuccesful;
    const username = getUsername ? getUsername : document.getElementById("username").value
    const password = getPassword
    let parsedData;
    const sanitizeUsername = ()=>{
        return username
    }
    const sanitizePassword = ()=>{
        return password
    }
        if(formIsValid()){
            checkLoadingState(loginValidationSuccesful,el,validateListener,"Login","Loading...")
            attemptLogin(sanitizeUsername(),sanitizePassword()).then(async (data)=>
                {
                parsedData = await data.json()
                loginValidationSuccesful = parsedData
            }
        ).then(()=>{
            checkLoadingState(loginValidationSuccesful,el,validateListener,"Login","Loading...")
            if(loginValidationSuccesful === false){
                cautionElement.classList.remove("hidden")
                cautionElement.innerText = errorMessages.invalidLoginDetails
            }else{
                document.cookie = `tokenEarly=${parsedData.tokenEarly} ;max-age=${60*60*3}`
                document.cookie = `tokenLate=${parsedData.tokenLate} ;max-age=${60*60*72}`
                localStorage.setItem("session",JSON.stringify(parsedData))
                reRouteUser("/dashboard.html")
                
            }
            loginValidationSuccesful = undefined
        })
    }else{
        return
    
    }
    return loginValidationSuccesful

}

function reRouteUser(path){
    window.location.href = path
}
function checkLoadingState(response,el,fn,initialMsg,pendingState){

    if(response === undefined){
        el.innerText = pendingState
        el.removeEventListener("click",fn)
    }else{
        el.innerText = initialMsg
        window.scrollTo({ top: 0, behavior: 'smooth' });
        el.addEventListener("click",fn)
    }
    
}
async function attemptRegisterUser(username,password){
    const uri = "http://localhost:3330/register/submit"
    await fetch(uri,{
        method:"POST",
        body:JSON.stringify({
            username:username,
            password:password,

        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    

}
function validateRegisterUser(){
    let registerSuccesfully = undefined

    let validateListener =  function(){
        const username = document.getElementById("username").value
        const password = document.getElementById("new-password-confirmation").value
        if(formIsValid()){

            checkLoadingState(registerSuccesfully,submitBtn,validateListener,"Register","Loading...")
            try {
                attemptRegisterUser(username,password).then(async (data)=>
                {
                    loginToSession(submitBtn,loginToSession,password)                    
                })
            } catch (error) {
                registerSuccesfully = false
                checkLoadingState(registerSuccesfully,submitBtn,validateListener,"Register","Loading...")
            }
        }else{
            return
        }
    }
submitBtn.addEventListener("click",validateListener)
}
async function attemptCreatePassword(){

    try{
        const currentUser = await checkSession()
        const payload = {
            username:currentUser.username,
            title:document.getElementById("title").value,
            source:document.getElementById("source").value,
            userId: document.getElementById("user").value,
            category:document.getElementById("category").value,
            password:document.getElementById("new-password-confirmation").value,
            description:document.getElementById("description").value,
            specialChar: document.getElementById("allowed_chr").value ? document.getElementById("allowed_chr").value : null,
            creationDate :document.getElementById("creation").value ? document.getElementById("creation").value : null,
            expiryDate : document.getElementById("expiry").value ? document.getElementById("expiry").value : null,
        }
        const uri = "http://localhost:3330/user-passwords"
        const response = fetch(uri,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(payload)
        })
        return response
    }catch(error){
        return Error()
    }

}
async function validateCreatePassword(){
    let validateListener = async function(){
        let createdPassword = undefined
        if(formIsValid()){
            checkLoadingState(createdPassword,submitBtn,validateListener,"Submit","Creating...")
            cautionElement.classList.add("hidden")
            try{
                
                await attemptCreatePassword().then((data)=>{
                    if(data.ok){
                        reRouteUser("/password-created")
                        return
                    }else{
                        createdPassword = false
                        checkLoadingState(createdPassword,submitBtn,validateListener,"Submit","Creating...")
                        cautionElement.innerText = "Could not create password"
                        cautionElement.classList.remove("hidden")
                        
                    }
                })
            }catch(err){

                return
            }
        }else{
            return
        }
    }
    submitBtn.addEventListener("click",validateListener)

}
async function searchPasswords(userInput,session){
    try {
        const URI = "http://localhost:3330/search-password"
        const request = await fetch(URI,{
            method:"POST",
            body:JSON.stringify(
                {search:userInput,
                  username:session,
                }
            ),
            headers:{
                "Content-Type":"application/json"
            }
        })
         return request.json()
    } catch (error) {
        throw new Error(error)
    }
}
async function displaySearchedPasswords(passwordArry){
    result.innerHTML = ""
for(let i =0;i < passwordArry.length; i++){
    const PASSWORD_CARD_ELEMENT = `<li class="consulted_passwords_card">
    <h3 class="interactive_copy">${passwordArry[i].title}</h3>
    <div class="main_details">
        <div class="displayed">
        <input class="password" readonly value="${passwordArry[i].password}" type="password"">
        <button class="reveal"><i class="fa-solid fa-eye"></i></button></div>
        <ul class="key_details">
            <li><b class="interactive_copy"><span class="copied_msg">copied</span>Source:</b>${passwordArry[i].source}</li>
            <li><b class="interactive_copy">User ID:</b>${passwordArry[i].userId}</li>
            <li><b class="interactive_copy">Category:</b> ${passwordArry[i].category}</li>
        </ul>
        <ul class="extra_details">
            <li><b>Description:</b>
            <p> ${passwordArry[i].description} </p></li>
        </ul>
</div>
</li>`
    result.innerHTML += PASSWORD_CARD_ELEMENT
}
}
if(register){
    validateRegisterPassword()
    validateRegisterUser()
    submitBtn.addEventListener("click",(e)=>{
        if(formIsValid()){
            cautionElement.classList.add("hidden")
        }else{
            cautionElement.classList.remove("hidden")
        }
        e.preventDefault()
        
    })
}
if(login){
    validateLogin(loginBtn)
    submitBtn.addEventListener("click",(e)=>{
        if(formIsValid()){
            cautionElement.classList.add("hidden")
        }else{
            cautionElement.classList.remove("hidden")
        }
        e.preventDefault()
        
    })
}

if(session_saved){
    logout.addEventListener("click",removeCookies)
    const getUsername = async ()=>{
      const username = await checkSession()
      validateLogin(loginBtn,username.username)
    }
    getUsername()

    initialize()
    submitBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        if(formIsValid()){
            cautionElement.classList.add("hidden")
        }else{
            cautionElement.classList.remove("hidden")
        }
        
        
    })
}
if(dashboard){
    initialize()
    logout.addEventListener("click",removeCookies)
    searchBtn.addEventListener("click",async (e)=>{
        let session = await checkSession()
        displaySearchedPasswords(await searchPasswords(document.getElementById("main_search_bar").value,session.username))
    })

}
if(create_password){
    validateRegisterPassword()
    validateCreatePassword()
    submitBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        if(formIsValid()){
            cautionElement.classList.add("hidden")
        }else{
            cautionElement.classList.remove("hidden")
        }
        
        
    })

}

function removeCookies(){
    document.cookie = "tokenLate=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path="
    document.cookie = "tokenEarly=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path="

}