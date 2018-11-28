function clearForm(form) {
    form.reset();
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
    setTimeout(handleNavBar, 100);
});

// used to select tabs on /profile
function openTab(evt, tabName) {
    let i, x, tabLinks;

    x = document.querySelectorAll('.content-tab');
    for (i = 0; i < x.length; i++) x[i].style.display = "none";

    tabLinks = document.querySelectorAll('.tab');
    for (i = 0; i < x.length; i++) tabLinks[i].className = tabLinks[i].className.replace(' is-active', '');

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += ' is-active';
}

// handle message sending to discord channels
// find out why line 64 errors if not in the async function I created starting at
// at next line
(async () => {
    let newDCMessage = document.getElementById('sendMessageForm');
    if (!newDCMessage) return;
    newDCMessage.addEventListener('submit', (e) => {

        e.preventDefault();

        let data = new FormData(newDCMessage);
        data = {
            channel: data.get('channel'),
            message: data.get('message')
        };

        (async () => {
            await fetch('/newmessage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })();

        clearForm(newDCMessage);
    }, false);
})();

(async () => {
    let newDCEmbed = document.getElementById('sendEmbedForm');
    if (!newDCEmbed) return;
    newDCEmbed.addEventListener('submit', (e) => {

        e.preventDefault();

        let data = new FormData(newDCEmbed);
        data = {
            channel: data.get('channel'),
            message: data.get('message'),
            embed: true
        };

        (async () => {
            await fetch('/newmessage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })();

        clearForm(newDCEmbed);
    }, false);
})();

(async () => {
    let newDCEmbedEdit = document.getElementById('editEmbed');
    if (!newDCEmbedEdit) return;
    newDCEmbedEdit.addEventListener('submit', (e) => {

        e.preventDefault();

        let data = new FormData(newDCEmbedEdit);
        data = {
            channel: data.get('channel'),
            message: data.get('message'),
            id: data.get('id'),
            embed: true,
            edit: true
        };

        (async () => {
            await fetch('/newmessage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })();

        clearForm(newDCEmbedEdit);
    }, false);
})();

(async () => {
    let newContactMessage = document.getElementById('contactForm');
    if (!newContactMessage) return;
    newContactMessage.addEventListener('submit', (e) => {
        e.preventDefault();

        let data = new FormData(newContactMessage);
        data = {
            name: data.get('name'),
            username: data.get('username'),
            email: data.get('email'),
            subject: data.get('subject'),
            message: data.get('message')
        };

        (async () => {
            await fetch('/newcontact', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })();

        clearForm(newContactMessage);
        alert('Your message has been sent. Thanks!');
    });


})();