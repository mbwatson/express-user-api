for (let username of usernames) {
    axios.post('http://localhost:3030', {
        username: username,
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

