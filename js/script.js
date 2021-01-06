    var timeLeft = 30;
    var timerId;
    var isCheckGameover = false;

    console.log("hello");

    function onloadPutVariables(){
            loadUser();
            PutPlayers()
            drawBoard();
    }

    function setPlayerRound(){
       if(game.active == true){
       console.log(game.players[0]);
       console.log(game.players[1]);
       console.log(game.playerRound);
       console.log(game.players[game.playerRound]);
            if(game.players[game.playerRound] != null){
                document.getElementById("playerRound").innerHTML = 'Player round: '+ game.players[game.playerRound].name;
            }
       }
    }

    function PutPlayers(){
            putPlayer1();
            putPlayer2();
            putJoinButtonContainer();
            setPlayerRound();
    }

    function updateGameModel() {
        $.get("/game/model/id/"+id).done(function(fragment) { // get from controller
            game = fragment;
            putPlayer1();
            putPlayer2();
            putJoinButtonContainer();
        });
    }

    function putJoinButtonContainer(){
        var flag = false;

        if(game.players[0] != null){
            if(game.players[0].id == player.id){
                flag = true;
            }
        }
        if(game.players[1] != null){
            if(game.players[1].id == player.id){
                flag = true;
            }
        }

        if(flag){
           document.getElementById("joinButtonContainer").innerHTML = '';
        }
        else{
            document.getElementById("joinButtonContainer").innerHTML = '<button class="joinButton">Join the game</button>';
        }
    }

    function putPlayer1(){
        if(game.players[0] != null){
            document.getElementById("player1").innerHTML = game.players[0].name;
            document.getElementById("player1games").innerHTML = game.players[0].games;
            document.getElementById("player1wins").innerHTML = game.players[0].wins;
            document.getElementById("player1draws").innerHTML = game.players[0].draw;
            document.getElementById("player1lost").innerHTML = game.players[0].lost;
            if(game.players[0].id == player.id){
                document.getElementById("leaveGame1").innerHTML = '<button class="leaveButton">Leave the game</button>';
                document.getElementById("startGame1").innerHTML = '<button class="startButton">Start</button>';
                if(game.players[1] != null){
                    document.getElementById("kickPlayer2").innerHTML = '<button class="kickPlayer">Kick</button>';
                }
                else{
                    document.getElementById("kickPlayer2").innerHTML = '';
                }
                if(game.active == true){
                    document.getElementById("drawOffer1").innerHTML = '<button class="drawOffer">Offer draw</button>';
                }
                else{
                    document.getElementById("drawOffer1").innerHTML = '';
                }
            }
            else{
                document.getElementById("leaveGame1").innerHTML = '';
                document.getElementById("startGame1").innerHTML = '';
                document.getElementById("drawOffer1").innerHTML = '';
            }
        }
        else{
            document.getElementById("player1").innerHTML = "free";
            document.getElementById("player1games").innerHTML = "-";
            document.getElementById("player1wins").innerHTML = "-";
            document.getElementById("player1draws").innerHTML = "-";
            document.getElementById("player1lost").innerHTML = "-";
            document.getElementById("leaveGame1").innerHTML = '';
            document.getElementById("startGame1").innerHTML = '';
            document.getElementById("drawOffer1").innerHTML = '';
        }
    }

    function putPlayer2(){
        if(game.players[1] != null){
            document.getElementById("player2").innerHTML = game.players[1].name;
            document.getElementById("player2games").innerHTML = game.players[1].games;
            document.getElementById("player2wins").innerHTML = game.players[1].wins;
            document.getElementById("player2draws").innerHTML = game.players[1].draw;
            document.getElementById("player2lost").innerHTML = game.players[1].lost;
            if(game.players[1].id == player.id){
                document.getElementById("leaveGame2").innerHTML = '<button class="leaveButton">Leave the game</button>';
                if(game.active == true){
                    document.getElementById("drawOffer2").innerHTML = '<button class="drawOffer">Offer draw</button>';
                }
                else{
                    document.getElementById("drawOffer2").innerHTML = '';
                }
            }
            else{
                document.getElementById("leaveGame2").innerHTML = '';
                document.getElementById("drawOffer2").innerHTML = '';
            }
        }
        else{
            document.getElementById("player2").innerHTML = "free";
            document.getElementById("player2games").innerHTML = "-";
            document.getElementById("player2wins").innerHTML = "-";
            document.getElementById("player2draws").innerHTML = "-";
            document.getElementById("player2lost").innerHTML = "-";
            document.getElementById("leaveGame2").innerHTML = '';
            document.getElementById("drawOffer2").innerHTML = '';
        }
    }

    $("button.joinButton").live("click", function(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id,
           data: JSON.stringify(player),
           dataType: 'json',
           contentType: "application/json",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
    });

    $("button.leaveButton").live("click", function(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/leaveGame",
           data: JSON.stringify(player),
           dataType: 'json',
           contentType: "application/json",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
    });

    $("button.startButton").live("click", function(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/startGame",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
        isCheckGameover = true;
    });

    var stompClient = null;

    function connect() {
        var socket = new SockJS('/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/gameMessageReceiver/'+id, function (gameMessage) {
                game = JSON.parse(gameMessage.body);
                PutPlayers();
                drawBoard();
                startGame();
                checkGameOver();
            });
        });
    }

    function checkGameOver(){
        if(isCheckGameover == true){
            if(game.draw == true){
                console.log("remis!!!!!!!!!!!!!!!!!!!");
                clearTimeout(timerId);
                loadUser();
                isCheckGameover = false;
            }
            if(game.winner != null){
                console.log("winner!!!!!!!!!!!!!!!!!!! : " + game.winner.name);
                clearTimeout(timerId);
                loadUser();
                isCheckGameover = false;
            }
        }
    }

    function loadUser(){
        var myUser;
        $.ajax({
           type: "GET",
           url: "http://localhost:8090/player/reload/id/"+player.id,
           data: myUser,
           dataType: 'json',
           contentType: "application/json",
           success: function (data) {
               player = data;
               console.log("x???x");
               console.log(player);
           }
        });
        document.getElementById("userData").innerHTML += 'name='+player.name+" games="+player.games+" wins="+
        player.wins+" draws="+player.draw+" loses="+player.lost;
        document.getElementById("userData").innerHTML +=
        '<a class="logoutButton" href="/logout">"Logout</a>'
    }

    function sendIdToUpdateGameObject() {
        stompClient.send("/app/gameMessage/"+id, {}, id);
    }

    function drawBoard(){
        console.log("drawBoard");
        console.log(document.getElementById("board").innerHTML);
        var x, y;
        document.getElementById("board").innerHTML ="";
        for (y = 0; y < game.board.board.length; y++){
            document.getElementById("board").innerHTML += '<tr id="tr'+y+'">';
            for (x = 0; x < game.board.board.length; x++){
                if(game.board.board[x][y] == "EMPTY"){
                    document.getElementById("tr"+y).innerHTML += '<td class="light" id="'+x+':'+y+'" onclick="makeMove(this)"></td>';
                }
                else if(game.board.board[x][y] == "CROSS"){
                    console.log("cross: "+x+" - "+y);
                    document.getElementById("tr"+y).innerHTML += '<td class="cross" id="'+x+':'+y+'" ></td>';
                }
                else if(game.board.board[x][y] == "CIRCLE"){
                    console.log("circle: "+x+" - "+y);
                    document.getElementById("tr"+y).innerHTML += '<td class="circle" id="'+x+':'+y+'" ></td>';
                }
            }
            document.getElementById("board").innerHTML += '</tr>';
        }
    }

    function makeMove(clickedElement) {
       if(game.active == true && game.players[game.playerRound].id == player.id){
           console.log(clickedElement.id);
           var coord = clickedElement.id.split(":");
           var x = parseInt(coord[0]);
           var y = parseInt(coord[1]);

           var move = {
            "player" : player,
            "x" : x,
            "y" : y
           }
            console.log(move);
            $.ajax({
               type: "POST",
               url: "http://localhost:8090/game/id/"+id+"/move",
               data: JSON.stringify(move),
               dataType: 'json',
               contentType: "application/json",
               success: function () {
                   sendIdToUpdateGameObject();
                   timeLeft = 30;
                   clearTimeout(timerId);
                   timerId = setInterval(countdown, 1000);
               }
            });
        }
    }

    function startGame(){
        if(game.active == true){
            document.getElementById("leaveGame1").innerHTML = '';
            document.getElementById("leaveGame2").innerHTML = '';
            document.getElementById("startGame1").innerHTML = '';
            timeLeft = 30;
            clearTimeout(timerId);
            timerId = setInterval(countdown, 1000);
        }
    }

    function checkWinner(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/checkWinner",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
    }

    $("button.kickPlayer").live("click", function(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/kickPlayer",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
    });

    $("button.logout").live("click", function(){
            $.ajax({
               type: "GET",
               url: "http://localhost:8090/login?logout"
            });
        });

    function countdown() {
      if (timeLeft == -1) {
        clearTimeout(timerId);
        changePlayerRound();
      } else {
        document.getElementById('roundTimer').innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
      }
    }

    function changePlayerRound(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/changePlayerRound",
           success: function () {
               sendIdToUpdateGameObject();
               timeLeft = 30;
               clearTimeout(timerId);
               timerId = setInterval(countdown, 1000);
           }
        });
    }

    $("button.drawOffer").live("click", function(){
        $.ajax({
           type: "POST",
           url: "http://localhost:8090/game/id/"+id+"/drawOffer",
           data: JSON.stringify(player),
           dataType: 'json',
           contentType: "application/json",
           success: function () {
               sendIdToUpdateGameObject();
           }
        });
    });

    $("button.openGameButton").live("click", function(){
        var id = document.getElementById("gameIDinput").value;
        console.log("OKI");
        if(id != null && id != ""){
            $.ajax({
               type: "GET",
               url: "http://localhost:8090/game/id/"+id,
               success: function (data) {
                  window.location.href = "http://localhost:8090/game/id/"+id;
               }
            });
        }
    });