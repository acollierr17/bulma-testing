function submitForm() {
    let name = document.getElementById('myName').value;
    let username = document.getElementById('myUsername').value;
    let email = document.getElementById('myEmail').value;
    let subject = document.getElementById('mySubject').selectedOptions[0].value;
    let message = document.getElementById('myMessage').value;

    const newMessage = {
        name: name,
        username: username,
        email: email,
        subject: subject,
        message: message
    };
    console.log(newMessage);
}

// load navbar, header, and footer html files
function includeHTML() {
    let z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName('*');
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute('include-html');
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) elmnt.innerHTML = this.responseText;
                    if (this.status === 404) elmnt.innerHTML = 'Page not found.';

                    elmnt.removeAttribute('include-html');
                    includeHTML();
                }
            }
            xhttp.open('GET', file, true);
            xhttp.send();
            return;
        }
    }
}

// Add mobile responsive for toggling the navbar
document.addEventListener('DOMContentLoaded', () => {

    function handleNavBar() {
        const $navBarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        if ($navBarBurgers.length > 0) {
            $navBarBurgers.forEach(el => {
                el.addEventListener('click', () => {
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
                });
            });
        }
    }

    // the reason I need to set a timeout is because the DOM isn't fully loaded
    // will probably find out a more efficient way of doing this(?)
    setTimeout(handleNavBar, 1000);
});