//endpoint
var endpointConst = "http://localhost:8090/"

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', endpointConst+"projectData", true)

request.onload = function () {
  // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    data.forEach((proj) => {
    // Log each movie's title
      console.log(proj.title)
    })
}

// Send request
request.send()
