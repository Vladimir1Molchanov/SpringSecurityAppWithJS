$(async function () {
    await getUserData()
    await getTableWithUsers()
    await getDefaultModal()
    await addNewUser()
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch('api/admin/users'),
    findAllRoles: async () => await fetch('api/admin/roles'),
    findOneUser: async (id) => await fetch(`api/admin/${id}`),
    getAuthUser: async () => await fetch('api/admin/authUser'),
    addNewUser: async (user) => await fetch('api/admin', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(Object.fromEntries((new FormData(user)).entries()))
    }),
    updateUser: async (user, id) => await fetch(`api/admin/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/admin/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody')
    table.empty()

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let roles = ''
                user.authorities.forEach(r => roles += `${r.roleName} `)
                let tableFilling = `$(
                    <tr id="userString${user.id}">
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${roles}</td>     
                        <td>
                            <button type="button" data-userId="${user.id}" data-action="edit" class="btn btn-primary"
                            data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                        </td>
                        <td>
                            <button type="button" data-userId="${user.id}" data-action="delete" class="btn btn-danger"
                            data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                        </td>
                    </tr>)`
                table.append(tableFilling)
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal')

        let targetButton = $(event.target)
        let buttonUserId = targetButton.attr('data-userId')
        let buttonAction = targetButton.attr('data-action')

        defaultModal.attr('data-userId', buttonUserId)
        defaultModal.attr('data-action', buttonAction)
        defaultModal.modal('show')
    })
}

async function getUserData() {
    let userDataWithRoles = $('#userData').empty()
    let user = await userFetchService.getAuthUser().then(res => res.json())
    let userData = `${user.firstName} with roles: `
    user.authorities.forEach(r => userData += `${r.roleName} `)
    userDataWithRoles.append(userData)
}


// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target)
        let userId = thisModal.attr('data-userId')
        let action = thisModal.attr('data-action')
        switch (action) {
            case 'edit':
                editUser(thisModal, userId)
                break
            case 'delete':
                deleteUser(thisModal, userId)
                break
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target)
        thisModal.find('.modal-title').html('')
        thisModal.find('.modal-body').html('')
        thisModal.find('.modal-footer').html('')
    })
}

// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    modal.find('.modal-title').html('Edit user')

    let editButton = `<button type="button" class="btn btn-primary" id="editButton">Edit</button>`
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton)
    modal.find('.modal-footer').append(closeButton)

    let userRoles = ''
    await userFetchService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            let first = 1
            roles.forEach(r => {
                    if (first !== 1) {
                        userRoles += `<option value="${r.roleName}">${r.roleName}</option>`
                    } else if (first === 1) {
                        first = 0
                        userRoles += `<option selected value="${r.roleName}">${r.roleName}</option>`
                    }
                }
            )
        })

    let user = await userFetchService.findOneUser(id).then(res => res.json())
    let bodyForm = `
            <form class="form-group" id="editUser">
                <b>ID</b>
                <input class="form-control" type="text" id="id" name="id" value="${user.id}" disabled><br>
                <b>First Name</b>
                <input class="form-control" type="text" id="firstName" value="${user.firstName}"><br>
                <b>Last Name</b>
                <input class="form-control" type="text" id="lastName" value="${user.lastName}"><br>
                <b>Age</b>
                <input class="form-control" type="number" id="age" value="${user.age}"><br>
                <b>Password</b>
                <input class="form-control" type="text" id="password"><br>
                <br>
                <b>Role</b>
                <select class="custom-select" size="2"
                        multiple="multiple"
                        id="roles"
                        name="roles">
                    ${userRoles} 
                </select>
            </form>`
    modal.find('.modal-body').append(bodyForm)


    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim()
        let firstName = modal.find("#firstName").val().trim()
        let lastName = modal.find("#lastName").val().trim()
        let age = modal.find("#age").val().trim()
        let password = modal.find("#password").val().trim()
        let rawRoles = modal.find("#roles").val()
        let dataRoles = []
        await userFetchService.findAllRoles()
            .then(res => res.json())
            .then(roles => {
                roles.forEach(dbr =>
                    rawRoles.forEach(r => {
                        if (dbr.roleName === r) {
                            dataRoles.push({
                                id: dbr.id,
                                roleName: dbr.roleName
                            })
                        }
                    })
                )
            })
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            password: password,
            roles: dataRoles
        }
        const response = await userFetchService.updateUser(data, id)

        if (response.ok) {
            let updatedUserData = `
            <td>${id}</td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${age}</td>
            <td>${rawRoles}</td>
            <td>
                <button type="button" data-userId="${id}" data-action="edit" class="btn btn-primary"
                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
            </td>
            <td>
                <button type="button" data-userId="${id}" data-action="delete" class="btn btn-danger"
                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
            </td>
            `
            $(`#userString${user.id}`).empty().append(updatedUserData)
            modal.modal('hide')
        } else {
            let body = await response.json()
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times</span>
                            </button>
                        </div>`
            modal.find('.modal-body').prepend(alert)
        }
    })
}

async function deleteUser(modal, id) {
    modal.find('.modal-title').html('Delete user')

    let deleteButton = `<button type="button" class="btn btn-danger" id="deleteButton">Delete</button>`
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton)
    modal.find('.modal-footer').append(closeButton)

    let userRoles = ''
    await userFetchService.findAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(r => {
                    userRoles += `<option value="${r.roleName}">${r.roleName}</option>`
                }
            )
        })

    let user = await userFetchService.findOneUser(id).then(res => res.json())
    let bodyForm = `
            <form class="form-group" id="deleteUser">
                <b>ID</b>
                <input class="form-control" type="text" value="${user.id}" disabled><br>
                <b>First Name</b>
                <input class="form-control" type="text" value="${user.firstName}" readonly><br>
                <b>Last Name</b>
                <input class="form-control" type="text" value="${user.lastName}" readonly><br>
                <b>Age</b>
                <input class="form-control" type="text" value="${user.age}" readonly><br>
                <b>Role</b>
                <select class="custom-select" size="2" readonly="readonly">
                    ${userRoles} 
                </select>
            </form>`
    modal.find('.modal-body').append(bodyForm)


    $("#deleteButton").on('click', async () => {
        const response = await userFetchService.deleteUser(id)

        if (response.ok) {
            $(`#userString${user.id}`).remove()
            modal.modal('hide')
        } else {
            let body = await response.json()
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times</span>
                            </button>
                        </div>`
            modal.find('.modal-body').prepend(alert)
        }
    })
}

async function addNewUser() {
    document.getElementById('createForm').addEventListener('submit', e => {
        e.preventDefault()
        userFetchService.addNewUser(e.target)
    })
}

// async function addNewUser() {
//     $('#addNewUserButton').click(async () => {
//         let addUserForm = $('#defaultSomeForm')
//         let login = addUserForm.find('#AddNewUserLogin').val().trim()
//         let password = addUserForm.find('#AddNewUserPassword').val().trim()
//         let age = addUserForm.find('#AddNewUserAge').val().trim()
//         let data = {
//             login: login,
//             password: password,
//             age: age
//         }
//         const response = await userFetchService.addNewUser(data)
//         if (response.ok) {
//             getTableWithUsers()
//             addUserForm.find('#AddNewUserLogin').val('')
//             addUserForm.find('#AddNewUserPassword').val('')
//             addUserForm.find('#AddNewUserAge').val('')
//         } else {
//             let body = await response.json()
//             let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
//                             ${body.info}
//                             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                                 <span aria-hidden="true">&times</span>
//                             </button>
//                         </div>`
//             addUserForm.prepend(alert)
//         }
//     })
// }