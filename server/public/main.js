function defaultStateInizialitation(){
    const inputFocus = document.querySelector("#passwordField")
    const focusToPassword = function(){
        inputFocus.focus()
    }
    window.onload(focusToPassword())
}
defaultStateInizialitation()