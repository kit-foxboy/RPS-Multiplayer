$(function () {
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAowIUNPenp2Xyc5LZj860wwzjvPZF6NMU",
        authDomain: "rps-online-d42fe.firebaseapp.com",
        databaseURL: "https://rps-online-d42fe.firebaseio.com",
        projectId: "rps-online-d42fe",
        storageBucket: "rps-online-d42fe.appspot.com",
        messagingSenderId: "559255222867"
    };
    firebase.initializeApp(config);

    //get database obj
    var database = firebase.database();

    //check for players directory
    database.ref('/players/player1').once('value', function(snapshot) {
        if(!snapshot.exists()) {
            database.ref('/players/player1').set(false);
        }
    });

    database.ref('/players/player2').once('value', function(snapshot) {
        if(!snapshot.exists()) {
            database.ref('/players/player2').set(false);
        }
    });

    //check for players
    database.ref('/players').on('value', function(snapshot) {
    
        showPlayers(snapshot.child('player1'), snapshot.child('player2'));
    });

    //handle join game button clicks
    $(document).on('click', '#player1 .join-btn', function(event) {
        
        var key = database.ref('/players/player1').push({
            status: 'standby',
            wins: 0,
            losses: 0
        }).key;

        localStorage.playerID = key;
    });
});


function showPlayers(player1, player2) {
    
    var player1Exists = (player1.val() !== false);
    var player2Exists = (player2.val() !== false);

    //display player1 area
    if (player1Exists) {
        displayPlayer('#player1', player1);
    } else {
        displayInactive('#player1');
    }

    //display player2 area
    if (player2Exists) {
        displayPlayer('#player2', player2);
    } else {
        displayInactive('#player2');
    }
}

function displayPlayer(playerID, player) {

    var localKey = localStorage.playerID;
    $(playerID).addClass(playerID.replace('#', ''));
    $(playerID).removeClass('inactive');

    switch(player.child(localKey).val().status) {

        case 'standby':
            $(playerID + ' .button-group').html('<button class="btn" disabled="disabled">Waiting for other player</button>');
            break;

        case 'ready':
            $(playerID + ' .button-group').html(
                '<button class="btn"><i class="far fa-hand-rock"></i>Rock</button>' +
                '<button class="btn"><i class="far fa-hand-paper"></i>Paper</button>' +
                '<button class="btn"><i class="far fa-hand-scissors"></i>Scissors</button>'
            );
            break;

        default:
            console.log('Invalid player status');
    }

}

function displayInactive(playerID) {

    $(playerID).removeClass('player1 player2');
    $(playerID + ' i').addClass('inactive fas fa-user');
    $(playerID + ' .button-group').html('<button class="btn join-btn">Join Game</button>');
}