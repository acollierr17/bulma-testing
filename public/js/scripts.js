// Simplify clearing of forms
function clearForm(form) {
    form.reset();
}

// Add mobile responsive for toggling the navbar
document.addEventListener('DOMContentLoaded', handleNavBarEvent);

function handleNavBarEvent() {
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
}

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

// Send an embed in a guild text channel
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

// Edit an existing emebed in a guild text channel
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

// Submit a new contact form
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

let toggleBtn = document.getElementById('toggleSubmission');
toggleBtn.addEventListener('click', toggleSubmission);

// Toggle the message submission form
function toggleSubmission() {

    let form = document.getElementById('newMessageForm');
    if (form.style.display === 'none') return form.style.display = 'block';
    else form.style.display = 'none';
}

// Submit a new message to the message board.
let newMessage = document.getElementById('newMessageForm');
newMessage.addEventListener('submit', createMessage);

async function createMessage(e) {

    e.preventDefault();

    let data = new FormData(newMessage);
    data = {
        message: data.get('newMessage')
    };

    if (data.message.length <= 0) return messageValidation();

    await fetch('/messages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    clearForm(newMessage);
    toggleSubmission();
    reloadBoard();
}

// Delete a message from the message board.
let messages = document.getElementById('messagesList');
messages.addEventListener('click', deleteMessage);

function deleteMessage(e) {

    if (e.target.textContent === 'Delete' && confirm('Are you sure?')) {
        let id = getMessageID(e);
        let message = e.target.parentElement.parentElement.parentElement;

        fetch(`/messages/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(messages.removeChild(message))
        .catch(console.error);
    }
}
// Edit a message on the message board
messages.addEventListener('click', editMessage, false);
messages.addEventListener('submit', (e) => e.preventDefault(), false);

function editMessage(e) {

    if (e.target.textContent === 'Edit') {

        let id = getMessageID(e);

        let editModal = document.getElementById('editModal');
        editModal.className += ' is-active';

        let editModalCard = document.querySelector('.modal-card');
        editModalCard.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete')) {
                return editModal.classList.remove('is-active');
            }
        }, false);

        let footer = editModalCard.lastElementChild.children;
        Array.from(footer).forEach(f => {

            if (f.textContent === 'Cancel') {
                return f.addEventListener('click', () => {
                    editModal.classList.remove('is-active');
                }, false);
            }

            if (f.textContent === 'Confirm edit') {
                f.addEventListener('click', () => {
                    let newMessageEdit = document.getElementById('editMessageForm');
                    newMessageEdit.addEventListener('submit', editMessageAPI, false);
                    editModal.classList.remove('is-active');
                }, false);
            }
        });

        // Submit message edit to API
        // this functions works really weird
            // a) fetch method must be wrapped in anonymous async function to work
            // b) must load script again inside this function instead of the reloadBoard
                // function
        // need to further look into this in general
        async function editMessageAPI(e) {

            e.preventDefault();

            let newMessageEdit = document.getElementById('editMessageForm');
            let data = new FormData(newMessageEdit);
            data = {
                message: data.get('message')
            };

            // implement same validation specific to edit form
            // if (data.message.length <= 0) return messageValidation();

            (async () => {
                await fetch(`/messages/${id}/edit`, {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })();

            reloadBoard();
            include('/public/js/scripts.js');
        }
    }
}

// Toggle the edit modal
function toggleModal() {

    let form = document.getElementById('editModal');
    if (form.style.display === 'none') form.style.display = 'block';
    else form.style.display = 'none';
}

// Reload the messages board
function reloadBoard() {
    let xhr = new XMLHttpRequest();

    xhr.onload = async () => {
        if (xhr.status === 200) document.body.innerHTML = xhr.responseText;
    };

    xhr.open('GET', '/messages', true);
    include('/public/js/scripts.js');
    handleNavBarEvent();
    xhr.send(null);
}

// Include the scripts.js file for updating message board
function include(scriptURL) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', scriptURL);
    xhr.onreadystatechange = () => {
        if ((xhr.status === 200) && (xhr.readyState === 4)) eval(xhr.responseText);
    };
    xhr.send();
}

// Get the id of a message card
function getMessageID(e) {
    let message = e.target.parentElement.parentElement.parentElement;
    let id = message.id.split('-');
    return id = id[1];
}

// Display error message under submission box if message is empty (for client side validation)
let errorDiv = document.getElementById('emptyMessage');
let textArea = document.getElementsByName('newMessage');

function messageValidation() {
    textArea[0].classList.add('is-danger');
    return errorDiv.style.display = 'block';
}
