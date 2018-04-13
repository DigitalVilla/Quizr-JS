var url = "/res/finalquiz.xml";
let id = 1;
let answers = [];
let QnA, validAnswr;
let indx = -1;
let chkBtn = $("#checkBtn");
let pop = $('.popBG');
let probar = $('.slider');

function proBar() { 
    probar.style.width = ((indx+1)/QnA.length*100)+"%";
}

function xhRequest() {
    var XHR = new XMLHttpRequest();
    //response Method 
    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4 && XHR.status == 200) {
            var data = XHR.responseXML;
            QnA = data.getElementsByTagName('question');
            indx = (++indx) >= QnA.length ? QnA.length - 1 : indx;
            printQuizr(QnA[indx].children);

            if (QnA.length-1 == indx) {
                validAnswr = data.getElementsByTagName('rightanswers')[0].innerHTML.split(",");
                chkBtn.classList.add("DONE");
                chkBtn.innerHTML ="DONE!";
            }
        }
    };
    XHR.open("Get", url);
    XHR.send(null);
}


function iforEach(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}


function nextQuestion() {
    xhRequest();
}


function printQuizr(question) {
    let Qs = [];
    proBar();
    iforEach(question, function (el, i) {
        Qs.push(el.innerHTML);
    });

    let div = document.createElement('div');
    div.setAttribute("class", "container");
    let html = ['<div id="Q' + Qs[0] + '"class="Qs">\
        <h3>' + Qs[1] + '</h3></div><div class="As">\
        <div id="a" class="answer"><span>' + Qs[2] + '</span></div>\
        <div id="b" class="answer"><span>' + Qs[3] + '</span></div>\
        <div id="c" class="answer"><span>' + Qs[4] + '</span></div>\
        <div id="d" class="answer"><span>' + Qs[5] + '</span></div>\
        </div>'].join('');
    div.innerHTML = html;
    let oldQ = $('.container');
    if (oldQ != null) oldQ.parentNode.removeChild(oldQ);
    document.body.insertBefore(div, document.body.children[1]);
}

document.addEventListener("click", function (e) {
    let Qs = $All('.answer');

    if (e.target.className == "answer" || e.target.localName == "span") {
        let ans = e.target.localName == "span" ? e.target.parentElement : e.target;
        iforEach(Qs, function (el) {
            el.classList.remove("selected");
        });
        ans.classList.add("selected");
    }
    if (e.target == chkBtn) {
        let answr = $All('.selected');
        console.log(!answr.length>0);
        if (!answr.length>0) {
            myPop (1,"Please Choose Your Answer!");
        } else {
            answers.push(answr[0].id);  
            console.log(answers);
            nextQuestion();
        }
    }

    if (e.target.className == "DONE") {
       markTest();
    }

    if (e.target == pop) {
        myPop(0,"");
    }

})

xhRequest();

function markTest() {
    let correct = 0;
    let total = validAnswr.length;
    for (let i = 0; i < total; i++)
        if (validAnswr[i] == answers[i])
            correct ++;
    myPop(1,"Answers: "+correct+"/"+total+ `<br>Your Grade is ${correct/total*100}%`);
}


function myPop (display,message) {
    pop.style.display = display == 1?"block":"none";
    pop.children[0].children[0].innerHTML=message;
}


function $(element) {
    return document.querySelector(element);
}

function $All(element) {
    return document.querySelectorAll(element);
}