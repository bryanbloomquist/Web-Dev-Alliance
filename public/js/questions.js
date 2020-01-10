//will use localstorage to get user, for now going to set user
$(document).ready(function() {
  if (
    localStorage.getItem("username") === "null" ||
    localStorage.getItem("username" === null)
  ) {
    alert("Please login");
    window.location.href = "/";
  }
  const user = localStorage.getItem("username");
  const userName = user.charAt(0).toUpperCase() + user.slice(1);
  //based on the current user, we need to load in the users stats as our starting values for the game
  $.ajax({
    method: "GET",
    url: "/api/users/" + user
  }).then(function(result) {
    let question = result.currentQuestionId;
    let score = result.currentScore;
    let stress = result.currentStress;

    //make displays correct
    $("#stress-display").html(stress);
    $("#grade-display").html(score);
    $("#user-name").html(userName);

    // STRESS GAUGE
    const opts = {
      lines: 12, // The number of lines to draw
      angle: 0, // The length of each line
      lineWidth: 0.4, // The line thickness
      pointer: {
        length: 0.59, // The radius of the inner circle
        strokeWidth: 0.035, // The rotation offset
        color: "#cfcfcf" // Fill color
      },
      limitMax: "false", // If true, the pointer will not go past the end of the gauge
      generateGradient: true,
      staticZones: [
        { strokeStyle: "#30B32D", min: -50, max: -1 }, // Green
        { strokeStyle: "#FFDD00", min: -1, max: 30 }, // Yellow
        { strokeStyle: "#F03E3E", min: 30, max: 50 } // Red
      ]
    };
    const target = document.getElementById("canvas-preview"); // your canvas element
    const gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 50; // set max gauge value
    gauge.setMinValue(-10);
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(stress); // set actual value

    // necessary for modal fade to function and protect impropper input (clicking outside of the modal, hitting a button on the keyboard, etc)
    const mfb =
      "class='answer btn' data-toggle='modal' data-target='#questionModal' data-backdrop='static' data-keyboard='false'";

    const divContainer = x => {
      return `<div style="width:100%;height:0;padding-bottom:${x}%;position:relative;">`;
    };

    function question1() {
      loseConditions();
      $(".currentQuestion").html(`
        <h4 class='question'>It's the first day of class. You're a little nervous. Some funny cat videos might help you relax.</h4>
        <button id='youtube' ${mfb}></button>  Relax on YouTube <br />
        <button id='vsc' ${mfb}></button>  Pay attention to class <br />
      `);
      $(".answer").click(function() {
        const userChoice = this.id;
        if (userChoice === "youtube") {
          $(".questionMsg").html("That cat was adorable");
          $("#questionFlavor").html(`
            ${divContainer(100)}<img src='images/giphy/1a-positive-kitty.gif' class='gif' alt='kitty gif'></div>
          `);
          score -= 5;
          stress -= 5;
          $("#grade").val(score);
          gauge.set(stress);
        } else {
          $(".questionMsg").html("Wow, that was a lot of information!");
          $("#questionFlavor").html(`
            ${divContainer(71)}<img src='images/giphy/1b-lotta-code.gif' class='gif' alt='lotta code gif'></div>
          `);
          score += 10;
          stress += 10;
          $("#grade").val(score);
          gauge.set(stress);
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        findQuestion();
      });
    }

    function question2() {
      loseConditions();
      $(".currentQuestion").html(`
        <h4 class='question'>A blizzard has descended on the land. Do you brave the elements or try to learn remotely?</h4>
        <button id='A' ${mfb}>It is just a little snow!</button><br/>
        <button id='B' ${mfb}>Better safe than sorry.</button><br />
        <button id='C' ${mfb}>"Do you want to build a snowman?"</button>
      `);
      $(".answer").click(function() {
        const userChoice = this.id;
        let outcome;
        switch (userChoice) {
          case "A":
            outcome = Math.floor(Math.random() * 2);
            if (outcome === 0) {
              $(".questionMsg").html(
                "The snow was too deep. You didn't make it to class."
              );
              $("#questionFlavor").html(`
                ${divContainer(54)}<img src='images/giphy/2a-bill-murray.gif' class='gif' alt='bill murray gif'></div>
              `);
              score -= 5;
              stress += 15;
              $("#grade").val(score);
              gauge.set(stress);
            } else {
              $(".questionMsg").html(
                "Through sheer ingenuity, you made it to class."
              );
              $("#questionFlavor").html(`
                ${divContainer(56)}<img src='images/giphy/2b-road-skiing.gif' class='gif' alt='road skiing gif'></div>
              `);
              score += 15;
              stress -= 5;
              $("#grade").val(score);
              gauge.set(stress);
            }
            break;
          case "B":
            outcome = Math.floor(Math.random() * 4);
            if (outcome === 0) {
              $(".questionMsg").html(
                "Just as class begins, your internet goes out."
              );
              $("#questionFlavor").html(`
                ${divContainer(52)}<img src='images/giphy/2c-confused.gif' class='gif' alt='confused gif'></div>
              `);
              score -= 5;
              stress += 10;
              $("#grade").val(score);
              gauge.set(stress);
            } else {
              $(".questionMsg").html("You were able to connect remotely.");
              $("#questionFlavor").html(`
                ${divContainer(100)}<img src='images/giphy/2d-noob-website.gif' class='gif' alt='etch-a-sketch gif'></div>
              `);
              score += 5;
              stress -= 5;
              $("#grade").val(score);
              gauge.set(stress);
            }
            break;
          case "C":
            $(".questionMsg").html("Nice snowman... man.");
            $("#questionFlavor").html(`
              ${divContainer(178)}<img src='images/giphy/2e-snowman.gif' class='gif' alt='snowman gif'></div>
            `);
            score -= 15;
            stress -= 15;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          default:
            return;
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        findQuestion();
      });
    }

    function question3() {
      loseConditions();
      $(".currentQuestion").html(`
        <h4 class='question'>First group project week! How do you handle it?</h4>
        <button id="A" ${mfb}>I'll do it all myself. I want it done right.</button><br />
        <button id="B" ${mfb}>Divide the work evenly. Many hands make light work.</button><br />
        <button id="C" ${mfb}>My group is pretty smart. They've got this.</button>
      `);
      $(".answer").click(function() {
        const userChoice = this.id;
        let outcome;
        switch (userChoice) {
          case "A":
            outcome = Math.floor(Math.random() * 4);
            if (outcome === 0) {
              $(".questionMsg").html(
                "It was, surprisingly, a smashing success!"
              );
              $("#questionFlavor").html(`
                ${divContainer(56)}<img src="images/giphy/3a-code-monkey.gif" class="gif" alt="coding monkey gif"></div>
              `);
              score += 20;
              stress += 20;
              $("#grade").val(score);
              gauge.set(stress);
            } else {
              $(".questionMsg").html("It was an abject failure.");
              $("#questionFlavor").html(`
                ${divContainer(75)}<img src="images/giphy/3b-failure.gif" class="gif" alt="failure gif"></div>
              `);
              score -= 10;
              stress += 20;
              $("#grade").val(score);
              gauge.set(stress);
            }
            break;
          case "B":
            outcome = Math.floor(Math.random() * 4);
            if (outcome === 0) {
              $(".questionMsg").html(
                "Try as you might, your app simply didn't work. Good effort."
              );
              $("#questionFlavor").html(`
                ${divContainer(100)}<img src="images/giphy/3c-reality.gif" class="gif" alt="planned vs reality gif"></div>
              `);
              score += 5;
              stress += 10;
              $("#grade").val(score);
              gauge.set(stress);
            } else {
              $(".questionMsg").html(
                "Your project was a success. Everyone contributed, dividing the work."
              );
              $("#questionFlavor").html(`
                ${divContainer(73)}<img src="images/giphy/3d-teamwork.gif" class="gif" alt="yay teamwork gif"></div>
              `);
              score += 10;
              stress += 5;
              $("#grade").val(score);
              gauge.set(stress);
            }
            break;
          case "C":
            outcome = Math.floor(Math.random() * 4);
            if (outcome === 0) {
              $(".questionMsg").html(
                "Somehow you skated by and got an A despite contributing virtually nothing."
              );
              $("#questionFlavor").html(`
                ${divContainer(56)}<img src="images/giphy/3e-office-space.gif" class="gif" alt="office space gif"></div>
              `);
              score += 10;
              stress -= 15;
              $("#grade").val(score);
              gauge.set(stress);
            } else {
              $(".questionMsg").html(
                "Your group caught on to your laziness and your name was left off of the final product."
              );
              $("#questionFlavor").html(`
                ${divContainer(75)}<img src="images/giphy/3f-looney-toons.gif" class="gif" alt="looney toons gif"></div>
              `);
              score -= 20;
              stress -= 5;
              $("#grade").val(score);
              gauge.set(stress);
            }
            break;
          default:
            return;
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        findQuestion();
      });
    }

    function question4() {
      loseConditions();
      $(".currentQuestion").html(`
        <h4 class="question">You recieve a cold-call from a recruiter!</h4>
        <button id="A"${mfb}>I call them back immediately and introduce myself.</button><br />
        <button id="B" ${mfb}>I'll send an email. That should be good enough.</button><br />
        <button id="C" ${mfb}>Ignore it. I'm not ready.
      `);
      $(".answer").click(function() {
        const userChoice = this.id;
        switch (userChoice) {
          case "A":
            $(".questionMsg").html(
              "They asked some difficult questions, but in the end you got your name out there."
            );
            $("#questionFlavor").html(`
              ${divContainer(56)}<img src="images/giphy/4a-southpark.gif" class="gif" alt="soutpark gif"></div>
            `);
            score += 10;
            stress += 10;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "B":
            $(".questionMsg").html(
              "You recieve a form letter thanking you for your inquery."
            );
            $("#questionFlavor").html(`
              ${divContainer(75)}<img src="images/giphy/4b-spongebob.gif" class="gif" alt="spongebob gif"></div>
            `);
            score += 5;
            stress += 5;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "C":
            $(".questionMsg").html("Maybe next time");
            $("#questionFlavor").html(`
              ${divContainer(100)}<img src="images/giphy/4c-hangup.gif" class="gif" alt="phone hangup gif"></div>
            `);
            score -= 5;
            stress -= 5;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          default:
            return;
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        findQuestion();
      });
    }

    function question5() {
      loseConditions();
      $(".currentQuestion").html(`
        <h4 class="question">Find the bug.</h4>
        <img src="images/debug.png" align="middle" usemap="#image-map">'
        <map name="image-map"><area id="meta" alt="Bug?" coords="70,54,250,77" shape="rect"><area id="no-end" alt="Bug?" coords="341,186,381,211" shape="rect"><area id="span" alt="Bug?" coords="102,207,175,230" shape="rect"><area id="source" alt="Bug?" coords="139,285,365,309" shape="rect"><area id="img" alt="Bug?" coords="449,279,498,311" shape="rect"></map>'
      `);
      $("#img").click(function() {
        $("#questionModal").modal("show");
        $(".questionMsg").html("You found the bug!");
        $("#questionFlavor").html(`
          ${divContainer(89)}<img src="images/giphy/5a-chris-farley.gif" class="gif" alt="chris farley gif"></div>
        `);
        score += 10;
        stress -= 5;
        $("#grade").val(score);
        gauge.set(stress);
        question++;
      });
      $("#meta").click(function() {
        $("#questionModal").modal("show");
        $(".questionMsg").html("WRONG!");
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/5b-hells-kitchen.gif" class="gif" alt="hells kitchen gif"></div>
        `);
        score -= 5;
        stress -= 5;
        $("#grade").val(score);
        gauge.set(stress);
        question++;
      });
      $("#no-end").click(function() {
        $("#questionModal").modal("show");
        $(".questionMsg").html("WRONG!");
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/5b-hells-kitchen.gif" class="gif" alt="hells kitchen gif"></div>
        `);
        score -= 5;
        stress -= 5;
        $("#grade").val(score);
        gauge.set(stress);
        question++;
      });
      $("#span").click(function() {
        $("#questionModal").modal("show");
        $(".questionMsg").html("WRONG!");
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/5b-hells-kitchen.gif" class="gif" alt="hells kitchen gif"></div>
        `);
        score -= 5;
        stress -= 5;
        $("#grade").val(score);
        gauge.set(stress);
        question++;
      });
      $("#source").click(function() {
        $("#questionModal").modal("show");
        $(".questionMsg").html("WRONG!");
        $("#questionFlavor").html(`
          ${divContainer(56)}<img src="images/giphy/5b-hells-kitchen.gif" class="gif" alt="hells kitchen gif"></div>
        `);
        score -= 5;
        stress -= 5;
        $("#grade").val(score);
        gauge.set(stress);
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        findQuestion();
      });
    }

    function question6() {
      loseConditions();
      $(".currentQuestion").html('<h4 class="question">You have dysentery.');
      $(".currentQuestion").append(
        '<button id="A" class="answer btn" data-toggle="modal" data-target="#questionModal" data-backdrop="static" data-keyboard="false">I&apos;ll go to the doctor, even though it means missing class'
      );
      $(".currentQuestion").append(
        '<br><button id="B" class="answer btn" data-toggle="modal" data-target="#questionModal" data-backdrop="static" data-keyboard="false">Tough it out and go to class. I can&apos;t miss a day'
      );
      $(".currentQuestion").append(
        '<br><button id="C" class="answer btn" data-toggle="modal" data-target="#questionModal" data-backdrop="static" data-keyboard="false">Ignore it and go for a journey somewhere in the pacific northwest'
      );
      $(".answer").click(function() {
        var userChoice = this.id;
        console.log(userChoice);
        switch (userChoice) {
          case "A":
            console.log("You only missed 1 class and you're right as rain");
            $(".questionMsg").html(
              "You only missed 1 class and you're right as rain."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:69%;position:relative;"><iframe src="https://giphy.com/embed/3o7TKKxsoUjRiUUeas"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/hulu-parks-and-recreation-nbc-3o7TKKxsoUjRiUUeas"></a>'
            );
            score -= 5;
            stress -= 10;
            $("#grade").val(score);
            gauge.set(stress);
            console.log(score);
            console.log(stress);
            $("#questionModalNext").click(function() {
              saveScore();
              findQuestion();
            });
            break;
          case "B":
            var outcome = Math.floor(Math.random() * 2);
            if (outcome === 0) {
              console.log(
                "You over-exerted yourself and had to be hospitalized, missing 3 classes"
              );
              $(".questionMsg").html(
                "You over-exerted yourself and had to be hospitalized, missing 3 classes."
              );
              $("#questionFlavor").html(
                '<div style="width:100%;height:0;padding-bottom:50%;position:relative;"><iframe src="https://giphy.com/embed/PADZOft6ursY"' +
                  gliphyEmbed +
                  '"https://giphy.com/gifs/funny-omfg-PADZOft6ursY"></a>'
              );
              score -= 10;
              stress += 15;
              $("#grade").val(score);
              gauge.set(stress);
              console.log(score);
              console.log(stress);
              $("#questionModalNext").click(function() {
                saveScore();
                findQuestion();
              });
            } else {
              console.log(
                "You managed to stay hydrated and made it through class."
              );
              $(".questionMsg").html(
                "You managed to stay hydrated and made it through class."
              );
              $("#questionFlavor").html(
                '<div style="width:100%;height:0;padding-bottom:67%;position:relative;"><iframe src="https://giphy.com/embed/Djk9ilQA2jjOg"' +
                  gliphyEmbed +
                  '"https://giphy.com/gifs/Djk9ilQA2jjOg"></a>'
              );
              score += 10;
              stress += 5;
              $("#grade").val(score);
              gauge.set(stress);
              console.log(score);
              console.log(stress);
              $("#questionModalNext").click(function() {
                saveScore();
                findQuestion();
              });
            }
            break;
          case "C":
            $(".questionMsg").html("You have died of dysentery.");
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/3oz8xBKJFKAXB6JAm4"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/oregon-wagon-trail-3oz8xBKJFKAXB6JAm4"></a><'
            );
            console.log("You have died of dysentery");
            score = -1;
            stress = -1;
            $("#grade").val(score);
            gauge.set(stress);
            $("#questionModalNext").click(function() {
              finalscore();
            });
        }
        question++;
      });
    }

    function question7() {
      loseConditions();
      $(".currentQuestion").html(
        '<h4 class="question">It&apos;s spring break. How do you spend your free time?'
      );
      $(".currentQuestion").append(
        '<button id="A"' + mfb + "Teach myself PHP and C# on the side!"
      );
      $(".currentQuestion").append(
        '<br><button id="B"' +
          mfb +
          "Get caught up with class material and polish my portfolio."
      );
      $(".currentQuestion").append(
        '<br><button id="C"' + mfb + "Daytona Beach here I come!"
      );
      $(".answer").click(function() {
        var userChoice = this.id;
        console.log(userChoice);
        switch (userChoice) {
          case "A":
            console.log("You are a coding ninja.");
            $(".questionMsg").html("You are a coding ninja.");
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/ukMiDlCmdv2og"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/life-programmer-ukMiDlCmdv2og"></a>'
            );
            score += 15;
            stress += 15;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "B":
            console.log("Everything is looking pretty polished now.");
            $(".questionMsg").html(
              "Everything is looking pretty polished now."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/l2SpNQjFsQqH5kFva"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/middle-school-movie-janitor-middle-school-movie-l2SpNQjFsQqH5kFva"></a>'
            );
            score += 5;
            stress += 5;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "C":
            console.log(
              "Well that certainly was fun. You'll be picking sand out of your belly button for weeks."
            );
            $(".questionMsg").html(
              "Well that certainly was fun. You'll be picking sand out of your belly button for weeks."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/43ZlfLDPwxJLi"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/fail-beach-lmao-43ZlfLDPwxJLi"></a>'
            );
            score -= 10;
            stress -= 15;
            $("#grade").val(score);
            gauge.set(stress);
            break;
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        question8();
      });
    }

    function question8() {
      loseConditions();
      $(".currentQuestion").html(
        '<h4 class="question">It&apos;s time for your final project!'
      );
      $(".currentQuestion").append(
        '<button id="A"' +
          mfb +
          "This is my moment! I quit my job, send the kids to boarding school; this is my life now!"
      );
      $(".currentQuestion").append(
        '<br><button id="B"' +
          mfb +
          "This is just another assignment. I got this."
      );
      $(".currentQuestion").append(
        '<br><button id="C"' + mfb + "I&apos;m burnt-out. I need a break."
      );
      $(".answer").click(function() {
        var userChoice = this.id;
        console.log(userChoice);
        switch (userChoice) {
          case "A":
            console.log(
              "You worked your butt off, but your final project is a masterpiece"
            );
            $(".questionMsg").html(
              "You worked your butt off, but your final project is a masterpiece."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:76%;position:relative;"><iframe src="https://giphy.com/embed/xT5LMSleuVuCe24KLC"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/season-7-the-simpsons-7x7-xT5LMSleuVuCe24KLC"></a>'
            );
            score += 20;
            stress += 20;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "B":
            console.log(
              "Your final project functions and looks pretty good. Good work."
            );
            $(".questionMsg").html(
              "Your final project functions and looks pretty good. Good work."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/QRB6F0x3ptYHu"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/day-work-home-QRB6F0x3ptYHu"></a>'
            );
            score += 10;
            stress += 10;
            $("#grade").val(score);
            gauge.set(stress);
            break;
          case "C":
            console.log(
              "You recieve a zero for this assignment, lowering your final grade."
            );
            $(".questionMsg").html(
              "You recieve a zero for this assignment, lowering your final grade."
            );
            $("#questionFlavor").html(
              '<div style="width:100%;height:0;padding-bottom:75%;position:relative;"><iframe src="https://giphy.com/embed/8EmeieJAGjvUI"' +
                gliphyEmbed +
                '"https://giphy.com/gifs/work-homer-simpson-8EmeieJAGjvUI"></a>'
            );
            score -= 5;
            stress -= 5;
            $("#grade").val(score);
            gauge.set(stress);
            break;
        }
        question++;
      });
      $("#questionModalNext").click(function() {
        saveScore();
        finalscore();
      });
    }

    function finalscore() {
      // saveScoreFinal();
      window.location.href = "/scoreboard";
    }

    //this function will update the database with the score after each question, as well as the current question the user is on
    function saveScore() {
      //update the stress and grade
      $("#stress-display").html(stress);
      $("#grade-display").html(score);

      var data = {
        currentScore: score,
        currentStress: stress,
        currentQuestionId: question
      };
      console.log(data);
      $.ajax({
        method: "PUT",
        url: "/api/users/" + user,
        data: data
      }).then(function(result) {
        console.log(result);
      });
    }

    function loseConditions() {
      if (score <= 0 || stress >= 50) {
        window.location.href = "/scoreboard";
      }
    }
    //switch will determine where the player starts the game
    function findQuestion() {
      switch (question) {
        case 2:
          question2();
          break;
        case 3:
          question3();
          break;
        case 4:
          question4();
          break;
        case 5:
          question5();
          break;
        case 6:
          question6();
          break;
        case 7:
          question7();
          break;
        default:
          question1();
      }
    }
    findQuestion();
  });
});
