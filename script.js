let container = document.getElementById("flex-container");
let comments = document.getElementById("modal-comments");
let commentId = document.getElementById("comment-id");
let divContainer;
let div;
let nickname;
let likes;
let dislike;
let commentButton;
let timestamp = 0;
let httpRequest;
let nbMessages = 0;

function getResponse() {
    let message;
    let author;
    let nbLikes;
    let dislikeText;
    let commentButtonText;
    // console.log(nbMessages);

    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const response = JSON.parse(httpRequest.response);
            timestamp = response.ts;
            
            for (i = 0; i < response.messages.length; i++) {
                // console.log(response.messages[i])
                nbMessages ++;

                divContainer = document.createElement("div");
                divContainer.setAttribute("class", "d-flex flex-row-reverse")

                div = document.createElement("div")
                div.setAttribute("class", "touit col-4 p-3");

                text = document.createElement("p");
                text.setAttribute("class", "touit-text text-break");
                message = document.createTextNode(response.messages[i].message);
                text.appendChild(message);

                nickname = document.createElement("p");
                nickname.setAttribute("class", "nickname text-break");
                author = document.createTextNode(response.messages[i].name);
                nickname.appendChild(author);

                likes = document.createElement("button");
                likes.setAttribute("class", "btn btn-primary likes m-2");
                likes.setAttribute("id", response.messages[i].id);
                nbLikes = document.createTextNode("Likes " + response.messages[i].likes);
                likes.appendChild(nbLikes);

                likes.addEventListener('click', ev => {
                    ev.preventDefault();
                    giveLike(ev.target.id);
                })

                dislike = document.createElement("button");
                dislike.setAttribute("class", "btn btn-secondary dislike m-2");
                dislike.setAttribute("value", response.messages[i].id);
                dislikeText = document.createTextNode("J'aime pas");
                dislike.appendChild(dislikeText);

                dislike.addEventListener('click', ev => {
                    ev.preventDefault();
                    giveDislike(ev.target.value);
                    // setTimeout(() => {
                    //     getMessage(ev.target.value)
                    // }, 200);
                })

                commentButton = document.createElement("button");
                commentButton.setAttribute("class", "btn btn-outline-secondary comment m-2");
                commentButton.setAttribute("value", response.messages[i].id);
                commentButton.setAttribute("data-bs-toggle", "modal");
                commentButton.setAttribute("data-bs-target", "#modal");
                commentButtonText = document.createTextNode("Commentaires");
                commentButton.appendChild(commentButtonText);

                commentButton.addEventListener('click', ev => {
                    ev.preventDefault();
                    getComments(ev.target.value);
                    commentId.textContent = ev.target.value
                })

                if ((nbMessages - 1) % 3 === 0) {
                    container.appendChild(divContainer).appendChild(div).append(text, nickname, likes, dislike, commentButton);
                } else {
                    let truc = document.querySelector(".d-flex.flex-row-reverse:last-child")
                    truc.appendChild(div).append(text, nickname, likes, dislike, commentButton);
                }
            }

        } else {
            alert('Il y a eu un problème avec la requête.');
        }
    }
}

function getMessages() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('Abandon :( Impossible de créer une instance de XMLHTTP');
      return false;
    }
    console.log('messages')

    httpRequest.onreadystatechange = getResponse;
    httpRequest.open('GET', 'http://touiteur.cefim-formation.org/list?ts=' + timestamp, true);
    httpRequest.send();
}

getMessages();
window.setInterval(getMessages, 5000);

function sendMessage() {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
            alert('Abandon :( Impossible de créer une instance de XMLHTTP');
            return false;
        }
    
    message = document.getElementById("message").value;
    nickname = document.getElementById("nickname").value;
    console.log('truc', message, nickname)

    httpRequest.open('POST', 'http://touiteur.cefim-formation.org/send', true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.send('name=' + encodeURIComponent(nickname) + '&message=' + encodeURIComponent(message) )
}
        
let touitButton = document.getElementById("touit-btn");

touitButton.addEventListener("click", sendMessage);
        
function getMessage(id) {
    httpRequest = new XMLHttpRequest();
    
    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance de XMLHTTP');
        return false;
    }
    
    httpRequest.onreadystatechange = getSpecificResponse;
    httpRequest.open('GET', 'http://touiteur.cefim-formation.org/get?id=' + id, true);
    httpRequest.send();
}

function getSpecificResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const response = JSON.parse(httpRequest.response);
            console.log(response.data.id);
            document.getElementById(response.data.id + "").textContent = "Likes " + response.data.likes;
        } else {
            alert('Il y a eu un problème avec la requête.');
        }
    }
}

let trendingRequest;

function getTrending() {
    trendingRequest = new XMLHttpRequest();
    if (!trendingRequest) {
            alert('Abandon :( Impossible de créer une instance de XMLHTTP');
            return false;
        }
                
    trendingRequest.onreadystatechange = getTrendingResponse;
    trendingRequest.open('GET', 'http://touiteur.cefim-formation.org/trending', true);
    trendingRequest.send();
}

function getTrendingResponse() {
    let a = [];
    if (trendingRequest.readyState === XMLHttpRequest.DONE) {
        if (trendingRequest.status === 200) {
            const response = JSON.parse(trendingRequest.response);
            
            let sortable = Object.entries(response).sort((a,b) => b[1] - a[1]);
            document.getElementById("body-trending").textContent = "";
            sortable.map(a => {
                if (a[1] > 50) {
                    document.getElementById("body-trending").textContent += "\" " + a[0] + " \"" + " a été écrit " + a[1] + " fois\n"
                }
            })
            
        } else {
            alert('Il y a eu un problème avec la requête.');
        }
    }
}

document.getElementById("btn-trending").addEventListener("click", getTrending);

let influencersRequest;

function getInfluencers() {
    influencersRequest = new XMLHttpRequest();
    if (!influencersRequest) {
        alert('Abandon :( Impossible de créer une instance de XMLHTTP');
        return false;
    }
    
    influencersRequest.onreadystatechange = getInfluencersResponse;
    influencersRequest.open('GET', 'http://touiteur.cefim-formation.org/influencers?count=10', true);
    influencersRequest.send();
}

function getInfluencersResponse() {
    if (influencersRequest.readyState === XMLHttpRequest.DONE) {
        if (influencersRequest.status === 200) {
            const response = JSON.parse(influencersRequest.response);

            // let sortable = Object.entries(response.influencers).map(a => console.log(a[0] ,a[1].comments + a[1].messages));
            let sortable = Object.entries(response.influencers).sort((a, b) => (b[1].comments + b[1].messages) -(a[1].comments + a[1].messages));
            console.log(sortable)

            document.getElementById("body-influencers").textContent = "";
            sortable.map(a => {
                document.getElementById("body-influencers").textContent += a[0] + " a écrit " + a[1].messages + " messages et " + a[1].comments + " commentaires\n";
            })
            
        } else {
            alert('Il y a eu un problème avec la requête.');
        }
    }
}

document.getElementById("btn-influencers").addEventListener("click", getInfluencers);

let likeRequest;

function giveLike(id) {

    likeRequest = new XMLHttpRequest();
    if (!likeRequest) {
      alert('Abandon : Impossible de créer une instance de XMLHTTP');
      return false;
    }
    
    likeRequest.open('PUT', 'http://touiteur.cefim-formation.org/likes/send', true);
    likeRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    likeRequest.send('message_id=' + encodeURIComponent(id));
    likeRequest.onreadystatechange = function() {getMessage(id)}
}

let dislikeRequest;

function giveDislike(id) {
    console.log(id)
    dislikeRequest = new XMLHttpRequest();
    if (!dislikeRequest) {
      alert('Abandon : Impossible de créer une instance de XMLHTTP');
      return false;
    }
    
    dislikeRequest.open('DELETE', 'http://touiteur.cefim-formation.org/likes/remove', true);
    dislikeRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    dislikeRequest.send('message_id=' + encodeURIComponent(id));
    dislikeRequest.onreadystatechange = function() {getMessage(id)}
}

function getTopTouits(count) {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Abandon : Impossible de créer une instance de XMLHTTP');
      return false;
    }
    
    httpRequest.onreadystatechange = getTopResponse;
    httpRequest.open('GET', 'http://touiteur.cefim-formation.org/likes/top?count=' + count, true);
    httpRequest.send();
}

function getTopResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const response = JSON.parse(httpRequest.response);
            console.log(response)
        }
    } else {
        console.log("non");
    }
}

let commentHttpRequest;

function getComments(id) {
    commentHttpRequest = new XMLHttpRequest();

    if (!commentHttpRequest) {
      alert('Abandon : Impossible de créer une instance de XMLHTTP');
      return false;
    }

    commentHttpRequest.onreadystatechange = getResponseComments;
    commentHttpRequest.open('GET', 'http://touiteur.cefim-formation.org/comments/list?message_id=' + id, true);
    commentHttpRequest.send();
}

function getResponseComments() {

    if (commentHttpRequest.readyState === XMLHttpRequest.DONE) {
        if (commentHttpRequest.status === 200) {
            const response = JSON.parse(commentHttpRequest.response);
            if (response.comments.length != 0) {
                comments.textContent = "";
                response.comments.map(c => comments.textContent += c.name + " a commenté : " + c.comment + "\n")
            } else {
                comments.textContent = "Aucun commentaire"
            }
        }
    }
}

let addCommentRequest;

function addComment() {
    addCommentRequest = new XMLHttpRequest();

    let name = document.getElementById("comment-nickname").value;
    let comment = document.getElementById("comment").value;
    let id = document.getElementById("comment-id").textContent;

    if (!comment || !name ) {
        return console.log("rien")
    }

    if (!addCommentRequest) {
      alert('Abandon : Impossible de créer une instance de XMLHTTP');
      return false;
    }

    addCommentRequest.open('POST', 'http://touiteur.cefim-formation.org/comments/send', true);
    addCommentRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    addCommentRequest.send('message_id=' + encodeURIComponent(id) + "&name=" + encodeURIComponent(name) + "&comment=" + encodeURIComponent(comment));
    addCommentRequest.onreadystatechange = function() {getComments(id)};
}

let commentNickname = document.getElementById("comment-nickname");
let commentText = document.getElementById("comment");
let addCommentButton = document.getElementById("send-comment");

let commentInput = document.getElementById("input-form-comment");
let nicknameInput = document.getElementById("input-form-nickname");

document.getElementById("send-comment").addEventListener("click", function() {
    let name = document.getElementById("comment-nickname").value;
    let comment = document.getElementById("comment").value;

    if (!comment || !name ) {

        let alert1 = document.createElement("div");
        alert1.setAttribute("class", "alert-message");
        let alert1Message = document.createTextNode("Veuillez remplir ce champ.");
        alert1.appendChild(alert1Message);

        let alert2 = document.createElement("div");
        alert2.setAttribute("class", "alert-message");
        let alert2Message = document.createTextNode("Veuillez remplir ce champ.");
        alert2.appendChild(alert2Message)

        console.log(nicknameInput.childNodes, 'comment-input');

        if (commentText.value === "" && commentInput.childNodes.length === 5) {
            commentInput.appendChild(alert1);
        } 
        if (commentNickname.value === "" && nicknameInput.childNodes.length === 5) {
            nicknameInput.appendChild(alert2);
        } 
    } else {
        addComment();
    }
});

document.getElementById("add-comment").addEventListener("click", function() {
    console.log("pouet")
    if (commentInput.childNodes.length > 5) {
        commentInput.removeChild(commentInput.lastChild);
    }
    if (nicknameInput.childNodes.length > 5) {
        nicknameInput.removeChild(nicknameInput.lastChild);
    }
})

commentNickname.addEventListener("input", ev => {
    if (ev.target.value != "" && commentText.value != "") {
        addCommentButton.setAttribute("href", "modal");
        addCommentButton.setAttribute("data-bs-toggle", "modal");
        addCommentButton.setAttribute("data-bs-dismiss", "modal");
    } else {
        addCommentButton.removeAttribute("href");
        addCommentButton.removeAttribute("data-bs-toggle");
        addCommentButton.removeAttribute("data-bs-dismiss");
    }
})

commentText.addEventListener("input", ev => {
    if (ev.target.value != "" && commentNickname.value != "") {
        addCommentButton.setAttribute("href", "#modal");
        addCommentButton.setAttribute("data-bs-toggle", "modal");
        addCommentButton.setAttribute("data-bs-dismiss", "modal");
    } else {
        addCommentButton.removeAttribute("href");
        addCommentButton.removeAttribute("data-bs-toggle");
        addCommentButton.removeAttribute("data-bs-dismiss");
    }
})