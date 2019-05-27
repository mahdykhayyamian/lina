import ajax from '@fdaciuk/ajax'

window.onload = function() {
    console.log("authenticating...");

    const goButton = document.getElementById("go-button");

    goButton.onclick = () => {
        console.log("inside login handler...");

        const userName = document.getElementById("userName").value;
        console.log(userName);

        const request = ajax({
            headers: {
                'content-type': 'application/json',
                'withCredentials': true
            },
            method: 'POST',
            url: '/whiteboard/api/authenticate',
            data: {
                userName
            }
        })

        request.then((response) => {
            console.log("got response")
            console.log(response);
            window.location.href = "/whiteboard"
        }).catch((error)=> {
            console.log(error);
        });
    };
}
