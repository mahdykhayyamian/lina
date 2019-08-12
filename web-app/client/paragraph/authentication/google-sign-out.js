function signOut() {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function() {
        console.log('User signed out.')
        window.location.href = '/paragraph/logout'
    })
}

function initAuth() {
    console.log('init auth')
    gapi.load('auth2', function() {
        gapi.auth2.init()
    })
}
