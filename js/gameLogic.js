		
		//Word containers to populate each level
		var threeLetterWords = [];
		var fourLetterWords = [];
		var fiveLetterWords = [];
		var sixLetterWords = [];
		var sevenLetterWords = [];
		
		//Canvas object
		var ctx;
		
		//Foreground canvas object
		var ctxfg;
		
		//Tile position, letter
		var gx,gy,gl;
		
		//Game state
		var grid;
		
		//Game timer
		var timer;
		
		//Game score
		var globalScore;
		
		//Word counter
		var wordCount;
		
		//Line counter
		var lineCount;
		
		//Game level
		var level;

		//Level up flag
		var newLevelReached = false;
		
		//To see if local storage is available
		var localStorageOK;

		//Game over flag
		var isGameOver = false;
		
		window.onload = (function () {
			
			//Set main canvas
			c = document.getElementById("gCanvas");
			ctx = c.getContext("2d");
			
			//Set foreground canvas
			cfg = document.getElementById("foregroundCanvas");
			ctxfg = cfg.getContext("2d");

			//Check local storage
			if (typeof(Storage) !== "undefined") {
				localStorageOK = true;
			} else {
				localStorageOK = false;
			}
			
			startGame();
		
		});
		
		function startGame() {
			
			globalScore = 0;
			level = 1;
			wordCount = 0;

			//Set game state grid
			grid = new Array(20);
			for (i=0;i<20;i++) {
				grid[i] = new Array(15);
				for (j=0;j<15;j++) {
					grid[i][j] = 0;
				}
			}
			
			//Set score
			$('#scorePanelText').html(globalScore);
			
			//Set level
			$('#levelPanelText').html(level);
			
			//Set words
			$('#wordCountPanelText').html(wordCount);
			
			//Set best score
			if(localStorageOK) {
			
				if(localStorage.bestScore) {
					$('#bestScorePanelText').html(localStorage.bestScore);
				}
				else {
					localStorage.bestScore = globalScore;
				}
			}
			else
			{
				$('#bestScorePanelText').html('N/A');
			}
			
			loadWords();
			
			//Clear the main canvas
			ctx.clearRect(0,0,300,400);

			//Clear the FG canvas
			ctxfg.clearRect(0,0,300,400);
			$('#foregroundCanvas').css('background-color', '');
			
			newTile();
			clearInterval(timer);
			timer = setInterval(function(){gameStep()}, 1000);
		}
		
		//Use this to get the words we'll use for each level
		function loadWords() {
		
			//Refresh word lists
			threeLetterWords = [];
			for(i=0;i<8;i++)
			{
				var word = commonWords[Math.floor(Math.random()*commonWords.length)];
				
				if(threeLetterWords.indexOf(word) > -1)
				{
					i--;
				}
				else
				{
					threeLetterWords[i] = word;
				}
			}
			
			fourLetterWords = [];
			for(i=0;i<5;i++)
			{
				var word = common4Words[Math.floor(Math.random()*common4Words.length)];
				
				if(fourLetterWords.indexOf(word) > -1)
				{
					i--;
				}
				else
				{
					fourLetterWords[i] = word;
				}
			}
			
			fiveLetterWords = [];
			for(i=0;i<5;i++)
			{
				var word = common5Words[Math.floor(Math.random()*common5Words.length)];
				
				if(fiveLetterWords.indexOf(word) > -1)
				{
					i--;
				}
				else
				{
					fiveLetterWords[i] = word;
				}
			}
			
			sixLetterWords = [];
			for(i=0;i<5;i++)
			{
				var word = common6Words[Math.floor(Math.random()*common6Words.length)];
				
				if(sixLetterWords.indexOf(word) > -1)
				{
					i--;
				}
				else
				{
					sixLetterWords[i] = word;
				}
			}
			
			sevenLetterWords = [];
			for(i=0;i<5;i++)
			{
				var word = common7Words[Math.floor(Math.random()*common7Words.length)];
				
				if(sevenLetterWords.indexOf(word) > -1)
				{
					i--;
				}
				else
				{
					sevenLetterWords[i] = word;
				}
			}
			displayWords();
		}
		
		function displayWords(){
			
			//Fade out existing wells
			$('.well-sm').each(function() {
				if($(this).hasClass("hidden"))
				{
					//Do nothing?
				}
				else
				{
					$(this).addClass("hidden");
				}
			});
			
			if(level >=1 && level <= 20)
			{
				$('#g3Words').html(threeLetterWords.toString().replace(/,/g,", "));
				if ($('#g3Words').hasClass("hidden")) {
					$('#g3Words').removeClass('hidden');
					$('#g3Words').addClass('animated fadeInUp');
					setTimeout(function() { $('#g3Words').removeClass('animated fadeInUp'); }, 2000);
				}
			}
			if(level >=5 && level <= 30)
			{
				$('#g4Words').html(fourLetterWords.toString().replace(/,/g,", "));
				if ($('#g4Words').hasClass("hidden")) {
					$('#g4Words').removeClass('hidden');
					$('#g4Words').addClass('animated fadeInUp');
					setTimeout(function() { $('#g4Words').removeClass('animated fadeInUp'); }, 2000);
				}
			}
			if(level >=10)
			{	
				$('#g5Words').html(fiveLetterWords.toString().replace(/,/g,", "));
				if ($('#g5Words').hasClass("hidden")) {
					$('#g5Words').removeClass('hidden');
					$('#g5Words').addClass('animated fadeInUp');
					setTimeout(function() { $('#g5Words').removeClass('animated fadeInUp'); }, 2000);
				}
			}
			if(level >=15)
			{
				$('#g6Words').html(sixLetterWords.toString().replace(/,/g,", "));
				if ($('#g6Words').hasClass("hidden")) {
					$('#g6Words').removeClass('hidden');
					$('#g6Words').addClass('animated fadeInUp');
					setTimeout(function() { $('#g6Words').removeClass('animated fadeInUp'); }, 2000);
				}
			}
			if(level >=20)
			{		
				$('#g7Words').html(sevenLetterWords.toString().replace(/,/g,", "));
				if ($('#g7Words').hasClass("hidden")) {
					$('#g7Words').removeClass('hidden');
					$('#g7Words').addClass('animated fadeInUp');
					setTimeout(function() { $('#g7Words').removeClass('animated fadeInUp'); }, 2000);
				}
			}
		}
		
		function gameStep()
		{
			//Move the block down at regular intervals
			//Check for tile beneath
			if(isTileBeneath(gx,gy)) {
				//Stop block and generate new one at origin
				setTileDetails(gx,gy,gl);
				checkLines();
				newTile();
			}
			else {
				eraseTile(gx,gy);
				gy -=1;
			}
				
			//Rewrite current pos to grid
			setTileDetails(gx,gy,gl);
			
			//Draw whole grid
			drawGrid();
		}
		
		function checkForWords(lineString, lineNumber)
		{
			if(level >=1 && level <= 20)
			{
				for(o=0;o<threeLetterWords.length;o++)
				{
					if(lineString.indexOf(threeLetterWords[o]) != -1)
					{						
						//Update score/info display
						scoreUpdate(threeLetterWords[o], 3);
						
						//Update global word counter
						wordCount += 1;
						$('#wordCountPanelText').html(wordCount);

						//Check for level up
						checkLevelUp();
					}
				}
			}
			if(level >=5 && level <= 30)
			{
				for(o=0;o<fourLetterWords.length;o++)
				{
					if(lineString.indexOf(fourLetterWords[o]) != -1)
					{							
						//Update score/info display
						scoreUpdate(fourLetterWords[o], 3);
						
						//Update global word counter
						wordCount += 1;
						$('#wordCountPanelText').html(wordCount);

						//Check for level up
						checkLevelUp();
					}
				}
			}
			if(level >=10)
			{
				for(o=0;o<fiveLetterWords.length;o++)
				{
					if(lineString.indexOf(fiveLetterWords[o]) != -1)
					{
						//Update score/info display
						scoreUpdate(fiveLetterWords[o], 3);
						
						//Update global word counter
						wordCount += 1;
						$('#wordCountPanelText').html(wordCount);

						//Check for level up
						checkLevelUp();
					}
				}
			}
			if(level >=15)
			{
				for(o=0;o<sixLetterWords.length;o++)
				{
					if(lineString.indexOf(sixLetterWords[o]) != -1)
					{
						//Update score/info display
						scoreUpdate(sixLetterWords[o], 3);
						
						//Update global word counter
						wordCount += 1;
						$('#wordCountPanelText').html(wordCount);

						//Check for level up
						checkLevelUp();
					}
				}				
			}
			if(level >=20)
			{		
				for(o=0;o<sevenLetterWords.length;o++)
				{
					if(lineString.indexOf(sevenLetterWords[o]) != -1)
					{
						//Update score/info display
						scoreUpdate(sevenLetterWords[o], 3);
						
						//Update global word counter
						wordCount += 1;
						$('#wordCountPanelText').html(wordCount);

						//Check for level up
						checkLevelUp();
					}
				}				
			}
		}
		
		function checkLevelUp() {
			
			if(wordCount % 10 === 0) {
				newLevelReached = true;
			}
		}
		
				
		function levelUp() {
				
			level +=1;
			$('#levelPanelText').html(level);
			$('#levelPanelText').addClass('animated bounce');
			setTimeout(function() { $('#levelPanelText').removeClass('animated bounce'); }, 2000);
			
			//Level up bonus
			addScore((50*level));
		}
		
		function drawFoundWord(word, index, wordLength, lineNumber) {
			
			//Set game to pixel coords (tiles are 20x20pixels, canvas is 20 tiles high, 15 tiles wide)
			var pixelX = index*20;
			var pixelY = (19-lineNumber)*20;
			
			//Can we do something with the word and the foreground?
		}
		
		function scoreUpdate(word, wordLength) {
		
			switch (wordLength) {
				case 3:
					addScore((10*level), word);
					break;
				case 4:
					addScore((20*level), word);
					break;
				case 5:
					addScore((40*level), word);
					break;
				case 6:
					addScore((80*level), word);
					break;
				case 7:
					addScore((160*level), word);
					break;
				default:
			}
		}
		
		function addScore(scoreToAdd, word) {
			
			globalScore += scoreToAdd;
			$('#scorePanelText').html(globalScore);
			
			if(localStorageOK) {
				if(globalScore > Number(localStorage.bestScore))
				{
					localStorage.bestScore = globalScore;
					$('#bestScorePanelText').html(localStorage.bestScore);
				}
			}
		}
		
		function checkLines() {
			
			//For each row
			for(i=0; i<20;i++)
			{
				//Check columns
				var lineFull = true;
				for(j=0;j<15;j++)
				{
					if(grid[i][j] == 0)
					{
						lineFull = false;
					}
				}
				
				if(lineFull)
				{
					var lineString = "";
					//Build string of line letters
					for(n=0;n<15;n++)
					{
						lineString = lineString.concat(grid[i][n]);
					}
					
					//Score points for a line
					addScore(10*level);
					
					//Check for words in string
					checkForWords(lineString.toLowerCase(),i);
					
					//Remove the full line
					for(k=0;k<15;k++)
					{
						grid[i][k] = 0;
					}
					
					//Play animation?

					//Move all other lines down by one
					for(l=(i+1);l<20;l++)
					{
						for(m=0;m<15;m++)
						{
							if(grid[l][m] !=0)
							{
								grid[l-1][m] = grid[l][m];
								grid[l][m] = 0;
							}
						}
					}
					
					//Draw new grid
					drawGrid();

					if(newLevelReached)
					{
						//New level, get new words
						levelUp();
						loadWords();
						newLevelReached = false;
					}

					
					//We've definitely gained some score here, so animate the score well
					animateScorePanel();
				}
			}
			
		}
		
		function newTile() {
			
			if(isTileBeneath(7,20))
			{
				//Cannot spawn a new tile, it's game over
				gameOver();
			}

			var nLetter = randomLetter();
			//Generate tile at (7,19) - top middle
			drawTile(7,19,nLetter);
			setTileDetails(7,19,nLetter);
		}

		function gameOver()
		{
			isGameOver = true;

			timer = clearInterval(timer);

			ctxfg.font = "30px Arial";
			ctxfg.fillStyle = "black";
			ctxfg.fillText("Game Over!", 60, 50); 

			$('#foregroundCanvas').css('background-color', 'rgba(255, 255, 255, 0.7)');

			ctxfg.font = "20px Arial";
			ctxfg.fillStyle = "black";
			ctxfg.fillText("Press R to restart", 60, 150); 
		}
		
		function randomLetter() {
			
			var num = Math.floor((Math.random() * 99) + 1);
			
			if(num >= 1 && num <= 12) { return "E"; }
			else if (num >= 13 && num <= 21) { return "A"; }
			else if (num >= 22 && num <= 30) { return "I"; }
			else if (num >= 31 && num <= 39) { return "O"; }
			else if (num >= 40 && num <= 45) { return "N"; }
			else if (num >= 46 && num <= 51) { return "R"; }
			else if (num >= 52 && num <= 57) { return "T"; }
			else if (num >= 58 && num <= 61) { return "L"; }
			else if (num >= 62 && num <= 65) { return "S"; }
			else if (num >= 66 && num <= 69) { return "U"; }
			else if (num >= 70 && num <= 73) { return "D"; }
			else if (num >= 74 && num <= 76) { return "G"; }
			else if (num >= 77 && num <= 78) { return "B"; }
			else if (num >= 79 && num <= 80) { return "C"; }
			else if (num >= 81 && num <= 82) { return "M"; }
			else if (num >= 83 && num <= 84) { return "P"; }
			else if (num == 85) { return "K"; }
			else if (num == 86) { return "J"; }
			else if (num == 87) { return "X"; }
			else if (num == 88) { return "Q"; }
			else if (num == 89) { return "Z"; }
			else if (num >= 90 && num <= 91) { return "H"; }
			else if (num >= 92 && num <= 93) { return "F"; }
			else if (num >= 94 && num <= 95) { return "V"; }
			else if (num >= 96 && num <= 97) { return "W"; }
			else if (num >= 98 && num <= 99) { return "Y"; }
			else { return "E"; }
		}
		
		function drawGrid() {
		
			//Clear the canvas
			ctx.clearRect(0,0,300,400);
			
			//Loop through grid and draw tiles
			for(i = 0; i < 20; i++) {
				for(j = 0; j < 15; j++) {
					if (grid[i][j] != 0) {
						drawTile(j, i, grid[i][j]);
					}
				}
			}
		}
		
		function drawTile(x,y,letter) {
		
			//Set game to pixel coords (tiles are 20x20pixels, canvas is 20 tiles high, 15 tiles wide)
			pixelX = x*20;
			pixelY = (19-y)*20;
			
			//Set fill colour
			ctx.fillStyle="#FF0000";
			ctx.fillRect(pixelX, pixelY, 20, 20);
			
			//Set text
			ctx.fillStyle="#FFFFFF";
			ctx.fillText(letter, pixelX+6, pixelY+13);
			
		}
		
		function eraseTile(x,y) {
			
			setTileDetails(x,y,0);
		}
		
		function keyDown(e) {
			
			if(isGameOver)
			{
				//Get restart command
				if(e.keyCode == 82)
				{
					isGameOver = false;
					startGame();
				}
			}
			else
			{
				if(e.keyCode == 37) //left
				{
					if((gx > 0) && !isTileBeside(gx,gy,"L")) {
						eraseTile(gx,gy);
						gx -=1;
					}
				}
				else if (e.keyCode == 39) //right
				{
					if((gx < 14) && !isTileBeside(gx,gy,"R")) {
						eraseTile(gx,gy);
						gx +=1;
					}
				}
				else if (e.keyCode == 40) //down
				{
					//Check for tile beneath
					if(isTileBeneath(gx,gy)) {
						//Stop block and generate new one at origin
						setTileDetails(gx,gy,gl);
						checkLines();
						newTile();
					}
					else {
						eraseTile(gx,gy);
						gy -=1;
					}
				}

				//Rewrite current pos to grid
				setTileDetails(gx,gy,gl);
				
				//Draw whole grid
				drawGrid();
			}
		}
		
		function setTileDetails(x,y,letter) {
			if (letter == 0)
			{
				grid[y][x] = 0;
			}
			else
			{
				gx = x;
				gy = y;
				gl = letter;
				grid[y][x] = letter;
			}
		}
		
		function isTileBeside(x,y,d) {
		
			//Return true if there's a tile on the side we're trying to move
			if(d=="L") {
				if(grid[y][x-1] !=0) {
					return true;
				}
			}
			else if(d=="R") {
				if(grid[y][x+1] !=0) {
					return true;
				}
			}
		}
		
		function isTileBeneath(x,y) {
		
			//Return true if we're at the bottom of grid, or if there is already a tile there
			if(y-1 == -1) {
				return true;
			}
			else if(grid[y-1][x] != 0) {
				return true;
			}
			else {
				return false;
			}		
		}