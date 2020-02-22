// some useful globals 
var gbArrQuizQueIndex    = 0;       // this global will be the controlling element of traversing the quiz object array 
var gbWrongAnswerCount   = 0;       // keep track of how mistakes were made 
var gbWrongOrRightText   = "Wrong"; // default text for this scoring indicator 
var gbWrongOrRightColor  = "red";   // default color for Wrong or Right message 
var gbRawTimer           = 0;       // dummy value for now for timer 
var gbPenaltyIncr        = 10;      // how much of a penalty gets assessed per wrong answer 
var gbPlayerScore        = 0;       // starting score; supposed to add seconds remaining and subtract a gbPenaltyIncr per wrong answer 
var gbPlayerInitials     = "AAA";   // default input initials 
var gbQuestionsRemaining = 20;      // needed for scorekeeping for questions NOT answered in time and thus a penalty 
var secondsLeft          = 300;     // starting timer value 


$(document).ready( function() {
		
		// we want to pass in the array without destroying it 
		function randomFourAnswerList( startFourAnswerList ) {
			
			// output array for randomized answers
			var newAnswerList = startFourAnswerList;
			
			// random number holder
			var rdmIndex = 0; // initialize just to be safe 
			
			// temp holder for answers in mid shuffle 
			var tmpAnswer;
			
			// generic iterator 
			var i = 0; 
			
			// need the ceiling of how large an answer array should be 
			var maxNumAnswers = 4; 
			
			// time to randomly pick questions using the Fisher-Yates Algorithm
			// see https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
			
			/*
			for(let i = array.length — 1; i > 0; i--){
				const j = Math.floor(Math.random() * i)
				const temp = array[i]
				array[i] = array[j]
				array[j] = temp
			}
			*/
			
			for ( i = maxNumAnswers - 1; i > 0; i -- ) {
				rdmIndex = Math.floor(Math.random() * i);
				tmpAnswer = newAnswerList[i];
				newAnswerList[i] = newAnswerList[rdmIndex];
				newAnswerList[rdmIndex] = tmpAnswer;
			}
				
			// output check to console 
			console.log ("Now doing a comparison of both arrays."); 
			for (i = 0; i < maxNumAnswers; i ++) {
					console.log ("Starting Array [" + i +"]: " + startFourAnswerList[i]);
					console.log ("Ending Array [" + i +"]: " + newAnswerList[i]);
			}
			
			return newAnswerList; 
			
		}
		
		function playerHighScore ( 
			pInitials, // initials of player 
			pScore // score of player 
		) { 
			// data members 
			this.pInitials = pInitials; 
			this.pScore    = pScore; 
		} 
		
		var arrQuizScores = new Array(); 
		
		var startScore = new playerHighScore ( 
			"QQQ", // pInitials 
			-50    // pScore 
		)
		
		arrQuizScores.push(startScore); 
		
		function storeHighScores (arrScore) { 
		
			// first sort the incoming array on pScore 
			arrScore.sort((a, b) => (a.pScore > b.pScore) ? 1 : -1); 
			
			localStorage.setItem("quizHighScores", JSON.stringify(arrScore)); 
		
		} 
		
		function getHighScores (arrScore) { 

			var fetchedData  = localStorage.getItem("quizHighScores"); 
			var arrNewScores = JSON.parse(fetchedData); 
			arrScore = arrNewScores; 

		} 
		
		function sortNewHighScores (arrScore, newScore) { 
		
			// first push the new score onto the list 
			arrScore.push(newScore); 
			
			// now sort the freshly increased array on pScore 
			arrScore.sort((a, b) => (a.pScore > b.pScore) ? 1 : -1); 
			
		}
		
		// my constructor method for quizQuestion object
		function quizQuestion ( 
			qTopic,     // quiz topic 
			qQuestion,  // quiz question 
			qArrPosAns, // array of possible answers 
			qAnswer,    // quiz short answer for buttons 
			qLongAnswer // long answer that explains why 
		) {
			// data members 
			
			this.qTopic      = qTopic;
			this.qQuestion   = qQuestion;
			this.qArrPosAns  = qArrPosAns;
			this.qAnswer     = qAnswer;
			this.qLongAnswer = qLongAnswer;
			
		}	
		
		var arrQuizQuestions = new Array(); 
		
		var tmpQ = new quizQuestion (
			"Keywords",																						// qTopic
			"Which one is NOT a Javascript keyword?", 														// qQuestion
			[ "true", "if", "function", "unsigned" ], 														// qArrPosAns
			"unsigned", 																					// qAnswer
			"'unsigned' is a data type modifier for several languages but is not needed for Javascript." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Keywords", 															// qTopic
			"Which one IS A KEYWORD in Javascript?", 								// qQuestion
			[ "which", "integer", "print", "null" ], 								// qArrPosAns
			"null", 																// qAnswer
			"'null' is the literal value of nothing for a variable in Javascript." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Variables", 																						// qTopic
			"Which of the following is NOT an official (i.e. built-in or pre-existing) Javascript data type?", 	// qQuestion
			[ "string", "boolean", "number", "record" ], 														// qArrPosAns
			"record", 																							// qAnswer
			"A 'record' is a general concept of databases, not a specific type of Javascript variable." 		// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Variables", 																																																// qTopic
			"Which of the following is the CLEAREST and CORRECT way to declare (set up) a value in Javascript? Presume that each is a formal line of code for first declaration.", 										// qQuestion
			[ "string t <- \"Forbidden\"", "i == 0", "double myPi = 3.1415927", "var minDrinkingAge = 21;" ], 																											// qArrPosAns
			"var minDrinkingAge = 21;", 																																												// qAnswer
			"To set up or declare a variable, a line must begin with 'var', have a variable name right after var, can optionally set it equal to a value using one equals sign, then end the line with a semicolon." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators:", 																																																				// qTopic
			"Given the variables named: numberAA, numberBB, stringAA, stringBB. And numberAA and numberBB are meant to contain numbers, while stringAA and stringBB contain strings, which of the following operations would fail?", 	// qQuestion
			[ "numberAA + numberBB", "numberAA - numberBB", "stringAA + stringBB", "stringAA - stringBB" ], 																															// qArrPosAns
			"stringAA - stringBB", 																																																		// qAnswer
			"Strings may be added together to concatenate them, but you cannot subtract one string from another and get a valid result." 																								// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators", 																									// qTopic
			"Which should be the value from the following expression: 4 + 5 * 6", 											// qQuestion
			[ "54", "56", "32", "34" ], 																					// qArrPosAns
			"34", 																											// qAnswer
			"Math order of operations: Multiply before adding, so 5*6 before adding 4 to that result, which equals 34." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators", 																																// qTopic
			"Which should be the value from the following expression: ( 6 + 3 ) * ( 7 / 3 )", 															// qQuestion
			[ "33", "15", "true", "21" ], 																												// qArrPosAns
			"21", 																																		// qAnswer
			"Math order of operations: Inside parentheses before outside multiplication, so it partially reduces to 9 * 7 / 3, which reduces to 21." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators", 													// qTopic
			"Which one is not a valid operation for Javascript?", 			// qQuestion
			[ "=", "==", "===", "====" ], 									// qArrPosAns
			"====", 														// qAnswer
			"Four equals signs have no computing function in Javascript." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																											// qTopic
			"The acronym DOM in Javascript stands for which one?", 																			// qQuestion
			[ "Document Origin Model", "Document Object Manual", "Domain Object Model", "Document Object Model" ], 							// qArrPosAns
			"Document Object Model", 																										// qAnswer
			"The Document Object Model came about in the early history of Javascript, to help browsers back then implement Javascript." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																																			// qTopic
			"What natural object is the DOM most commonly compared with?", 																									// qQuestion
			[ "cloud", "river", "mountain", "tree" ], 																														// qArrPosAns
			"tree", 																																						// qAnswer
			"A tree comparison is used because of how the different child elements can spawn and nest branches off the original point, most easily seen by indented code." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																																				// qTopic
			"When talking about relationships in the DOM, what real world relationships are they compared to normally?", 														// qQuestion
			[ "Boss-Employee", "Customer-ShopKeeper", "Teacher-Student", "Parent-Child-Sibling" ], 																				// qArrPosAns
			"Parent-Child-Sibling", 																																			// qAnswer
			"Items and objects in a document's hierarchy can be seen as being spawned or coming from an older or earlier item or object, just like a parent creating a child." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																				// qTopic
			"When creating objects, each data part may be a what?", 											// qQuestion
			[ "number", "string", "boolean", "any data type" ], 												// qArrPosAns
			"any data type", 																					// qAnswer
			"Objects can hold all sorts of valid data, including other objects that are previously defined." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		// below are questions from the homework sample, modified to fit my format 
		
		tmpQ = new quizQuestion (
			"Variables", 											// qTopic
			"Commonly used data types DO NOT include which?", 		// qQuestion
			[ "strings", "booleans", "alerts", "numbers" ], 		// qArrPosAns
			"alerts", 												// qAnswer
			"'alerts' are popup windows, not simple variables." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators", 																	// qTopic
			"The condition in an if/else statement is normally enclosed within which?", 	// qQuestion
			[ "quotes", "curly brackets", "parentheses", "square brackets" ], 				// qArrPosAns
			"parentheses", 																	// qAnswer
			"Logic and math operations are normally grouped in parentheses." 				// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Variables", 															// qTopic
			"Arrays in Javascript may be used to store which?", 					// qQuestion
			[ "numbers and strings", "other arrays", "booleans", "any of these" ], 	// qArrPosAns
			"any of these", 														// qAnswer
			"These are all the basic data types of Javascript." 					// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Variables", 																																						// qTopic
			"When being assigned to variables, string values must be enclosed within what?", 																					// qQuestion
			[ "commas", "curly brackets", "quotes", "parentheses" ], 																											// qArrPosAns
			"quotes", 																																							// qAnswer
			"Single or double quotes may be used to enclose words, phrases, sentences, or any other sequence of characters, as long as the same type is used at both ends." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																																// qTopic
			"A very useful tool used during development and debugging for printing content to the debugger is what?", 											// qQuestion
			[ "Javascript", "terminal/bash", "for loops", "console.log" ], 																						// qArrPosAns
			"console.log", 																																		// qAnswer
			"The console log displays messages, including error messages and various run time flags, in a web browser's debugging window or inspector window." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Operators", 																	// qTopic
			"Which of the following is NOT A METHOD that string variables easily use?", 	// qQuestion
			[ "substring", "split", "join", "random" ], 									// qArrPosAns
			"random", 																		// qAnswer
			"'random' is a Math object method to generate random numbers." 					// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"Keywords", 													// qTopic
			"Which of the following is NOT A TYPE of popup window?", 		// qQuestion
			[ "alert", "confirm", "prompt", "console" ], 					// qArrPosAns
			"console", 														// qAnswer
			"'console' is a part of the debugging tools of a web browser." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ);
		
		tmpQ = new quizQuestion (
			"General Knowledge", 																							// qTopic
			"Which of the following is NOT a part of a 'for' loop?", 														// qQuestion
			[ "a counter", "a condition", "a step or iteration", "a string" ], 												// qArrPosAns
			"a string", 																									// qAnswer
			"A string might be processed in a for loop but normally does not define how it starts or stops or its size." 	// qLongAnswer
		);
		
		arrQuizQuestions.push(tmpQ); 
		
		storeHighScores (arrQuizScores); // now that the application started, store this freshly made object array 
		
		function CreateTimerDiv() { 
		
			// attempting to add a timer div to the quiz 
			var divTimerHolder = $("<div>"); 
			var headingTimer   = $("<h2>"); 

			
			divTimerHolder.addClass("qTimerHolder"); 
			headingTimer.addClass("qTimer"); 
			
			// temporary data 
			headingTimer.text("Countdown Score: "); 


			$("#container").append(divTimerHolder); 
			$(".qTimerHolder").append(headingTimer); 

		} 
		
		function DestroyTimerDiv() { 

			$(".qTimerHolder").remove(); 
			
		} 
		
		function setTime() {
			var timerInterval = setInterval(function() {
				secondsLeft --;
				$(".qTimer").text("Countdown Score: " + secondsLeft); 
		
				if(secondsLeft === 0) {
					clearInterval(timerInterval); 
					
					// quiz timed out! so need to end quiz 
					DestroyQuestionPage(gbArrQuizQueIndex - 1); 
				}
		
			}, 1000);
		}
		
		function CreateStartPage() { 
		
			// create content for starting page title and paragraph directions 
			
			var titleContent = "Coding Quiz Challenge"; 
			var paraContent  = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score time by ten seconds. Starting time is fifteen seconds for every question. Questions NOT answered are also marked wrong and also assess a time penalty. Because final score is computed after all questions are answered or timer stops, it is possible to have a NEGATIVE score!!"; 
		
			// now create a start quiz button 
			
			var startBtn    = $("<button>"); 
			var startBtnLbl = "Start Quiz!"; 
		
			// now create divs for these items to live inside 
			
			var divStartTitle = $("<div>"); 
			var divStartPara  = $("<div>"); 
			var divStartBtn   = $("<div>"); 
			
			divStartTitle.addClass("qStartTitle"); 
			divStartPara.addClass("qStartPara"); 
			divStartBtn.addClass("qStartBtn"); 
			
			// add attributes to allow it to activate the right listener function 
			startBtn.addClass("startButton"); // sets up the on click hook 
			startBtn.text(startBtnLbl);
			
			// now start appending to the main container 
			$("#container").append(divStartTitle); 
			$("#container").append(divStartPara); 
			$("#container").append(divStartBtn); 
			
			$(".qStartTitle").append("<h1>" + titleContent + "</h1>"); 
			$(".qStartPara").append("<p>" + paraContent + "</p>"); 
			$(".qStartBtn").append(startBtn); 

		} 

		function DestroyStartPage() { 
			console.log ("Does DestroyStartPage() start??");
			$(".qStartTitle").remove(); 
			$(".qStartPara").remove(); 
			$(".qStartBtn").remove(); 
			
			// start the timer! 
			setTime(); 
			
		} 
		
		function CreateQuestionPage (qArr, qArrIndex) { // pass arrQuizQuestions as the first parameter 
		
			// questions array related data set up 
			
			var topicContent = qArr[qArrIndex].qTopic; 
			var quContent    = qArr[qArrIndex].qQuestion; 
			var ansContent   = qArr[qArrIndex].qAnswer; 
			var posAnsArr    = randomFourAnswerList(qArr[qArrIndex].qArrPosAns); 
			
			// append if the main div is named 'container', or use the main div's name 
			
			var divTopic = $("<div>"); // set up the topic's div 
			divTopic.addClass("qPageTopic"); 
			$("#container").append(divTopic); 
			$(".qPageTopic").append("<h2>" + topicContent + "</h2>"); 
			
			var divQuestion = $("<div>"); // set up the question's div 
			divQuestion.addClass("qPageQuestion"); 
			$("#container").append(divQuestion); 
			$(".qPageQuestion").append("<p>" + quContent + "</p>"); 
			
			// now setting up the four possible answer buttons 
			
			console.log("Before for-in loop to make possible answer buttons."); 
			
			for ( i in posAnsArr ) { 
			
				console.log("In for-in loop trying to make buttons. Doing #" + i + ".");
				
				var posQuBtn = $("<button>"); 
				var btnName  = "posAns_" + i; 
				
				posQuBtn.addClass("questionButton"); // sets up the on click hook 
				posQuBtn.addClass(btnName); 
				
				posQuBtn.attr("data-posAns", posAnsArr[i]); // sets up the possible vs correct answer comparison 
				posQuBtn.attr("data-corAns", ansContent); 
				
				posQuBtn.text(posAnsArr[i]); // display the possible answer as the button label 
				
				// now append this button to the question's div 
				$(".qPageQuestion").append(posQuBtn); 
				$(".qPageQuestion").append("<br>"); 
				
				console.log("Bottom of iteration #" + i + ".");
				
			} // this ends the four button question listing 
				
			console.log("After the for-in loop."); 
			
			for ( var i = 0; i < posAnsArr.length ; i ++) { 
			
				console.log("Answer #" + i + " - " + posAnsArr[i]);
			
			}
			
			// now add the bottom part only if on question # 2 or further along (i. e. NOT on the FIRST question) 
			
			if (qArrIndex > 0) { // should ONLY be in here if on question # 2 or further along, NOT FIRST QUESTION!! 
			
				// set up divs for previous answer results and long answer explanation 
				var divPrevAns     = $("<div>"); 
				var divPrevLongAns = $("<div>"); 
				
				var longAnsContent = qArr[qArrIndex - 1].qLongAnswer; 
				
				divPrevAns.addClass("qPagePrevAns"); // set up hooks for the previous answer quiz responses 
				divPrevLongAns.addClass("qPagePrevLongAns"); 
				
				$("#container").append(divPrevAns); 
				$("#container").append(divPrevLongAns); 
				
				$(".qPagePrevAns").append("<hr width=\"90%\">"); // now appending indicators of either right or wrong on the previous question 
				$(".qPagePrevAns").append("<p>" + gbWrongOrRightText + "</p>"); 
				$(".qPagePrevLongAns").append("<p>" + longAnsContent + "</p>"); 
		
			} 

			// decrement questions remaining because current question uses up question count 
			gbQuestionsRemaining --; 
		}
		
		function DestroyQuestionPage(qArrIndex) { 
		
			$(".qPageTopic").remove(); 
			$(".qPageQuestion").remove(); 
			
			if (qArrIndex > 0) { 
				$(".qPagePrevAns").remove(); 
				$(".qPagePrevLongAns").remove(); 
			}
		
		}
		
		function penalizePlayer() { 
			gbWrongAnswerCount ++; 
			secondsLeft -= gbPenaltyIncr; 
		} 
		
		function CreateFinishedQuizPage() { 
			
			// various texts and labels 
			
			var finTitleContent   = "All Done!"; 
			var finParaContent    = "Your final score: "; 
			var finGetInitLbl     = "Enter Initials: "; 
			var finAnsContent     = gbWrongOrRightText; 
			var finLongAnsContent = arrQuizQuestions[gbArrQuizQueIndex - 1].qLongAnswer; 
	
			// actual HTML elements 
			
			var divFinTitle     = $("<div>"); 
			var divFinPara      = $("<div>"); 
			var divFinGetInit   = $("<div>"); 
			var finGetInitInput = $("<input>"); 
			var finGetInitBtn   = $("<button>"); 
			var divFinAns       = $("<div>"); 
			var divFinLongAns   = $("<div>"); 
			
			/*
var gbWrongAnswerCount  = 0;       // keep track of how mistakes were made 
var gbRawTimer          = 0;       // dummy value for now for timer 
var gbPenaltyIncr       = 10;      // how much of a penalty gets assessed per wrong answer 
var gbPlayerScore       = 0;       // starting score; supposed to add seconds remaining and subtract a gbPenaltyIncr per wrong answer 
var gbPlayerInitials    = "AAA";   // default input initials 
			*/
			
			// first we don't need the timer anymore 
			DestroyTimerDiv();
			
			// now do computations of player's score 
			// need to somehow hook a timer value to this 
			
			//old computation 
			//gbPlayerScore = gbPlayerScore - ( gbWrongAnswerCount * gbPenaltyIncr ); 
			
			//new computation 
			gbPlayerScore = secondsLeft - ( gbQuestionsRemaining * gbPenaltyIncr ); 
			
			// now use this value as a score to add to the final score string down below 
			
			// assign classes so we have hooks for the divs 
			
			divFinTitle.addClass("qFinTitle"); 
			divFinPara.addClass("qFinPara"); 
			divFinGetInit.addClass("qFinGetInit"); 
			divFinAns.addClass("qFinAns"); 
			divFinLongAns.addClass("qFinLongAns"); 

			finGetInitInput.addClass("getInitialsInput"); // sets up for grabbing data 
			finGetInitInput.attr("size", "8"); 
			
			finGetInitBtn.addClass("getInitialsBtn"); // sets up the on click hook 
			finGetInitBtn.text("Submit"); 
			
			// now start appending to the main container 
			$("#container").append(divFinTitle); 
			$("#container").append(divFinPara); 
			$("#container").append(divFinGetInit); 
			$("#container").append(divFinAns); 
			$("#container").append(divFinLongAns); 

			$(".qFinTitle").append("<h1>" + finTitleContent + "</h1>"); 
			$(".qFinPara").append("<p>" + finParaContent + gbPlayerScore + "</p>"); 
			$(".qFinGetInit").append("<p>" + finGetInitLbl); 
			$(".qFinGetInit").append(finGetInitInput); 
			$(".qFinGetInit").append(finGetInitBtn); 
			$(".qFinGetInit").append("</p>"); 
			$(".qFinAns").append("<p>" + finAnsContent + "</p>"); 
			$(".qFinLongAns").append("<p>" + finLongAnsContent + "</p>"); 

		} 

		function DestroyFinishedQuizPage() { 
				
			$(".qFinTitle").remove(); 
			$(".qFinPara").remove(); 
			$(".qFinGetInit").remove(); 
			$(".qFinAns").remove(); 
			$(".qFinLongAns").remove(); 
			
		} 
		
		function CreateHighScoresPage() { 
		
			// only one fixed text label 
			var hsTitleContent   = "All Done!"; 
	
			// actual HTML elements 
			
			var divHSTitle        = $("<div>"); 
			var divHSList         = $("<div>"); 
			var divHSButtons      = $("<div>"); 
			var ordListHighScores = $("<ol>"); 
			
			// last two buttons 
			var hsRetakeQuizBtn  = $("<button>"); 
			var hsClearScoresBtn = $("<button>"); 
			
			// assign classes so we have hooks for the divs 
			
			divHSTitle.addClass("qHSTitle"); 
			divHSList.addClass("qHSList"); 
			divHSButtons.addClass("qHSButtons"); 
			ordListHighScores.addClass("qOrdListHS"); 
			
			hsRetakeQuizBtn.addClass("playAgainBtn"); // sets up the on click hook 
			hsRetakeQuizBtn.text("Retake Quiz!"); 
			
			hsClearScoresBtn.addClass("clearHighScoresBtn"); // sets up the on click hook 
			hsClearScoresBtn.text("Clear High Scores"); 

			// now start appending to the main container 
			$("#container").append(divHSTitle); 
			$("#container").append(divHSList); 
			$("#container").append(divHSButtons); 

			$(".qHSTitle").append("<h1>" + hsTitleContent + "</h1>"); 
			$(".qHSList").append(ordListHighScores); 
			
			for ( i in arrQuizScores ) { 
				var hsLineItem = arrQuizScores[i].pInitials + " : " + arrQuizScores[i].pScore; 
				$(".qOrdListHS").append("<li>" + hsLineItem + "</li>"); 
			} 
			
			$(".qHSButtons").append(hsRetakeQuizBtn); 
			$(".qHSButtons").append(hsClearScoresBtn); 

		} 
		
		function DestroyHighScoresPage() { 
		
			// before destroying save the list of high scores 
			storeHighScores (arrQuizScores); 
			
			// now destroy the high score related elements 
			$(".qHSTitle").remove(); 
			$(".qHSList").remove(); 
			$(".qHSButtons").remove(); 
			
		}
		
		// semi independent code blocks 
		/*
		$(".letter-button").on("click", function() {
		$(".startButton").on("click", function () { 
				console.log ("Start button pressed?? Should be??");
				DestroyStartPage(); 
				CreateQuestionPage(arrQuizQuestions, gbArrQuizQueIndex); 
			} 
		); 
		*/
		
		console.log ("Right before start button?");
		$(document).on("click", ".startButton", function(){
				console.log ("Start button pressed?? Should be??");
				DestroyStartPage(); 
				CreateTimerDiv(); 
				CreateQuestionPage(arrQuizQuestions, gbArrQuizQueIndex); 
			} 
		); 
		
		console.log ("After start button?");
		
		//$(".questionButton").on( "click", function () {  // did an answer response button get pressed? 
		$(document).on("click", ".questionButton", function(){ // did an answer response button get pressed? 

				var btnAns  = $(this).attr("data-posAns"); 
				var realAns = $(this).attr("data-corAns"); 
				
				if ( btnAns != realAns ) { // results from a wrong answer 
				
					gbWrongOrRightText  = "Wrong"; 
					gbWrongOrRightColor = "red"; 
					
					// score decrements as stated in the directions 
					penalizePlayer(); 
					
				} else { // results from a right answer
				
					gbWrongOrRightText  = "Right"; 
					gbWrongOrRightColor = "green"; 
					
					// score does NOT change 
					
				} 
				 
				/* 
				because a answer type button is pressed, either as a right or wrong answer, the global index count must 
				increase to advance to the next question 
				*/
				
				gbArrQuizQueIndex ++; 
				
				// now check to see if end of quiz has been reached 
				var maxIndex = (arrQuizQuestions.length) - 1; 
				
				DestroyQuestionPage(gbArrQuizQueIndex - 1); 
				
				// new page should be created 
				if ( gbArrQuizQueIndex <= maxIndex ) { 
					
					// now destroy current quiz question then invoke next quiz question 					
					CreateQuestionPage(arrQuizQuestions, gbArrQuizQueIndex); 
					
				} else { 
				
					// we have finished the quiz and need total results 
					CreateFinishedQuizPage(); 

				}

			} 
		); 

		// $(".getInitialsBtn").on( "click", function () { 
		$(document).on("click", ".getInitialsBtn", function() { // did an answer response button get pressed? 
			
				// first get any data in storage 
				getHighScores (arrQuizScores); 
			
				// now get the new data from the initials input screen 
				var newInitials = $( ".getInitialsInput" ).val(); 
				
				// player score is stored as a global so getting that value is simple 
				var newScore = new playerHighScore ( 
					newInitials, // pInitials 
					gbPlayerScore    // pScore 
				) 
				
				// now with the new data, add and sort the high scores array 
				sortNewHighScores (arrQuizScores, newScore); 
				
				// now we can store this new list of scores before we do anything else 
				storeHighScores (arrQuizScores); 
			
				// now destroy the finished quiz page then create the high scores list page 
				DestroyFinishedQuizPage(); 
				CreateHighScoresPage(); 
			} 
		); 

		//$(".playAgainBtn").on( "click", function () { 
		$(document).on("click", ".playAgainBtn", function() { 
				// reset the game and its appropriate globals 
				gbArrQuizQueIndex    = 0;       // this global will be the controlling element of traversing the quiz object array 
				gbWrongAnswerCount   = 0;       // keep track of how mistakes were made 
				gbWrongOrRightText   = "Wrong"; // default text for this scoring indicator 
				gbWrongOrRightColor  = "red";   // default color for Wrong or Right message 
				gbRawTimer           = 0;       // dummy value for now for timer 
				gbPenaltyIncr        = 10;      // how much of a penalty gets assessed per wrong answer 
				gbPlayerScore        = 0;       // starting score; supposed to add seconds remaining and subtract a gbPenaltyIncr per wrong answer 
				gbPlayerInitials     = "AAA";   // default input initials 
				gbQuestionsRemaining = 20;      // needed for scorekeeping for questions NOT answered in time and thus a penalty 
				secondsLeft          = 300;     // starting timer value 
				
				// get rid of the high scores page and start a new run through the question array 
				DestroyHighScoresPage(); 
				CreateTimerDiv(); 
				CreateQuestionPage(arrQuizQuestions, gbArrQuizQueIndex); 
			} 
		); 

		//$(".clearHighScoresBtn").on( "click", function () { 
		$(document).on("click", ".clearHighScoresBtn", function() { 
				// first clear the underlying data 
				while (arrQuizScores.length) {
					arrQuizScores.pop();
				} 
				
				// now store the empty list 
				storeHighScores (arrQuizScores); 
				
				// now erase the contents of the list of scores from the page visually 
				$(".qOrdListHS").remove(); 
				
				// and now add an empty ordered list 
				var ordListHighScores = $("<ol>"); 
				ordListHighScores.addClass("qOrdListHS"); 
				$(".qHSList").append(ordListHighScores); 
				
			} 
		); 
		
	// now start the application by invoking CreateStartPage() 
	
	CreateStartPage(); 

	} 
); // end of $(document).ready(function()