fetch('https://e4c5-12-87-110-98.ngrok-free.app/proxy', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text();
})
.then(data => {
    var iframe = document.getElementById("responseFrame");
    iframe.srcdoc = data;
})
.catch(error => {
    console.error('There was a problem with your fetch operation:', error);
});

