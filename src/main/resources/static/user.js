$(async function () {
    await getUser()
})

const userFetchServiceSimply = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAuthUser: async () => await fetch('api/user')
}

async function getUser() {
    let userTable = $('#user tbody').empty()

    await userFetchServiceSimply.getAuthUser()
        .then(res => res.json())
        .then(user => {
            let roles = ''
            user.authorities.forEach(r => roles += `${r.roleName} `)
            let userFilling = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${roles}</td>
                    </tr>`
            userTable.append(userFilling)
        })
}