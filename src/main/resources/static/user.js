$(async function () {
    await getUser()
})

async function getUser() {
    let user = $('#user tbody').empty()

    await userFetchService.getAuthUser()
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
                user.append(userFilling)
        })
}