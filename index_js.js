  document.addEventListener("DOMContentLoaded", function () {
    const numImages = 1;
    const container = document.querySelector(".container");
    let fallingImage;
    let CPScheck = true;

    const questionElement = document.getElementById('questionBox');
    const answerButtons = [
        document.getElementById('answer1'),
        document.getElementById('answer2')
    ];
      let currentRestore = 1;
    let clickStartTime = null;
    let lastClickTime = null;
    let animationVisible = false; 
    let CPS = 0;
    let counter = 0;
    let countPerClick = 1;
    let energyDrainPerClick = 1;
    let level = 0;
    let popupCooldown = false;
    const counterElement = document.getElementById("counter");
    const clickCircle = document.getElementById("click-circle");
    const progressBar = document.querySelector("progress");
    const sliderValueElement = document.getElementById("slider-value");
    const upgradeButton = document.getElementById("upgrade-button");
    const upupgradeButton = document.getElementById("upgrade-button-2");
    const restoreupgradeButton = document.getElementById("upgrade-button-1");
    const levelDisplay = document.getElementById("level-display");
    const upgradePriceDisplay = document.getElementById("upgrade-price");
    const popup = document.getElementById("popup");
    let restorelevel = 0;
    let uplevel = 0;
    let upgradePrice = 10;
    let restoreupgradePrice = 10;
    let upupgradePrice = 10;
    const UpDisplay = document.getElementById("up-display");
    const UpPriceDisplay = document.getElementById("up-price");
    const RestoreDisplay = document.getElementById("restore-display");
    const RestorePriceDisplay = document.getElementById("restore-price");
    const closeOnboarding = document.getElementById("close-onboarding");
    const onboarding = document.getElementById("onboarding");
    let haveskin1 = false;
    let haveskin2 = false;
    let haveskin3 = false;
      let haveskin4 = false;
      let loadenergy = 0;
      let currentDate = new Date().toLocaleDateString('en-CA');
      let currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      let serverDate = new Date().toLocaleDateString('en-CA');
      let serverTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      const menuButton = document.getElementById("menu-button");
      const menuPopup = document.getElementById("menu-popup");
      const menuWithdraw = document.getElementById("menu-button-1")
      const menuExit = document.getElementById("menu-button-2")
      const closeMenuPopupButton = document.getElementById("close-menu-popup-button");
      const openPopupButton = document.getElementById('open-popup-button');
      let initialcounter = 0;
      const balance = document.getElementById("totalcount");
      let finalenergy = 0;
      
      loadCount();
      setTimeout(checkUpgrade, 450);
      setTimeout(checkEnergy, 550);
    

   

    window.onload = function () {
        window.resizeTo(420, 900);
    }


      window.Telegram.WebApp.expand();

    ////////////////////////////////////////////////////////////////////////////////////////////////////// СЕКЦИЯ ВОПРОСОВ
      function getQuestions() {
          fetch('http://80.78.243.93:8000/api/question')
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              })
              .then(qData => {
                  const questions = qData.questions ? qData.questions : qData;

                  if (!questions || questions.length === 0) {
                      throw new Error('No questions found in the response');
                  }

                  let randomQ = Math.floor(Math.random() * questions.length);
                  const question = questions[randomQ];
                  const questionText = question.questionText;
                  const answers = question.answers;
                  questionElement.textContent = questionText;

                  if (answers.length >= 2) {
                      answerButtons[0].textContent = answers[0].text;
                      answerButtons[1].textContent = answers[1].text;

                      function handler1() {
                          handleAnswerClick(answers[0]);
                          answerButtons[0].removeEventListener('click', handler1);
                          answerButtons[1].removeEventListener('click', handler2);
                      }
                      answerButtons[0].addEventListener('click', handler1);

                      function handler2() {
                          handleAnswerClick(answers[1]);
                          answerButtons[0].removeEventListener('click', handler1);
                          answerButtons[1].removeEventListener('click', handler2);
                      }
                      answerButtons[1].addEventListener('click', handler2);

                  } else {
                      throw new Error('Not enough answers provided for the question');
                  }
              })
              .catch(error => {
                  console.error('Error fetching or processing questions:', error);
              });
      }


    function handleAnswerClick(answer) {
        if (answer.isCorrect) {
            counter += 15;
            counterElement.textContent = counter;
            togglePopup(false);
        } else {
            console.log('Incorrect answer.');
            togglePopup(false);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////// СЕКЦИЯ JSON

    function loadCount() {
        fetch('https://gptkids.online/clicker-backend/api/user/370179203')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data.users) || data.users.length === 0) {
                    throw new Error('Invalid response structure or empty users array');
                }

                let userData = data.users[0]; 
                initialcounter = userData.gamecount;
                counter = userData.gamecount;
                counterElement.textContent = counter;
                balance.textContent = "Общий баланс профиля: " + userData.totalcount;
                level = userData.clickup;
                restorelevel = userData.recoveryup;
                uplevel = userData.energyup;
                haveskin1 = userData.skin1;
                haveskin2 = userData.skin2;
                haveskin3 = userData.skin3;
                haveskin4 = userData.skin4;
                currentDate = userData.date;
                currentTime = userData.time;
                serverData = userData.serverdate;
                serverTime = userData.servertime;
                loadenergy = userData.endenergy;
                progressBar.value = loadenergy;

                if (haveskin1) {
                    document.getElementById('price-1').textContent = "Куплено!";
                }
                if (haveskin2) {
                    document.getElementById('price-2').textContent = "Куплено!";
                }
                if (haveskin3) {
                    document.getElementById('price-3').textContent = "Куплено!";
                }
                if (haveskin4) {
                    document.getElementById('price-4').textContent = "Куплено!";
                }
            })
            .catch(error => console.error('Error loading count:', error));
    }

      /*  function reloadCount() {
            fetch('http://80.78.243.93:8000/api/user/update')
                .then(response => response.json())
                .then(data => {
                    initialcounter = data.gamecount;
                    reloadbalance = data.totalcount;
                    balance.textContent = "Общий баланс профиля: " + reloadbalance;
                })
                .catch(error => console.error('Error loading count:', error));
     }
     */
      function checkEnergy () {
          
          // Parse the times
          const [currentHours, currentMinutes, currentSeconds] = currentTime.split(':').map(Number);
          const [serverHours, serverMinutes, serverSeconds] = serverTime.split(':').map(Number);

          // Convert times to seconds
          const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
          const serverTotalSeconds = serverHours * 3600 + serverMinutes * 60 + serverSeconds;
          // Check if dates are equal
          if (serverDate == currentDate) {
              const timeDifference = Math.abs(serverTotalSeconds - currentTotalSeconds);
              const sixSecondIntervals = Math.floor(timeDifference / 6);
              progressBar.value += currentRestore * sixSecondIntervals;
              progressBar.value += finalenergy;
              if (progressBar.value > progressBar.max) {
                  progressBar.value = progressBar.max;
              }
              sliderValueElement.textContent = progressBar.value;
          }
      }


      function saveCount() {
          finalenergy = progressBar.value;
          fetch('https://gptkids.online/clicker-backend/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users: [{
                    id: "370179203",
                    pricing: "free",
                    totalcount: initialcounter,
                    gamecount: counter,
                    clickup: level,
                    recoveryup: restorelevel,
                    energyup: uplevel,
                    skin1: haveskin1,
                    skin2: haveskin2,
                    skin3: haveskin3,
                    skin4: haveskin4,
                    servertime: serverTime,
                    serverdate: serverDate,
                    endenergy : finalenergy

                }]
            })
        })
            .then(response => response.json())
            .then(data => console.log('Count saved success fully:', data))
            .catch(error => console.error('Error saving count:', error));
    }


      function withdrawCount(counter) {
          const currentClick = counter;
          fetch('https://gptkids.online/clicker-backend/api/tokenizer/update', {
              method: "PATCH",
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: "370179203", totalcount: currentClick })
          })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok ' + response.statusText);
                  }
                  return response.json();
              })
              .then(data => {
                  console.log('Success:', data);
              })
              .catch((error) => {
                  console.error('Error:', error);
              });
      }
     

    function checkUpgrade() {
        for (let p = 0; p < level; p++) {
            upgradePrice = ((1 + (p * p)) * 10) * (p*2+1);
            countPerClick++;
            energyDrainPerClick++;
        }
        for (let n = 0; n < restorelevel; n++) {
            restoreupgradePrice = ((1 + (n*n)) * 10) * (n*2+1);
            currentRestore += 1;
            
        }
        for (let m = 0; m < uplevel; m++) {
            upupgradePrice = ((1 + (m*m)) * 10) * (m*2+1);
            progressBar.max += 50;
        }
        sliderValueElement.textContent = progressBar.value;
        updateLevelDisplay();
        updateUpgradePrice();
        updateRestoreDisplay();
        updateRestorePrice();
        updateUpDisplay();
        updateUpPrice();
    }

      
        window.addEventListener('beforeunload', () => {
            saveCount();
        });
    
        ////////////////////////////////////////////////////////////////////////////////////////////////////// ОСТАЛЬНЫЕ СКРИПТЫ

        setInterval(function () {
            if (CPS > 6) {
                CPS = 6;
                CPSCheck = true;
            }

        }, 100);

        setInterval(function () {
            saveCount(0);
        }, 10000);

        setInterval(function () {
            if (CPS < 4 && CPS >= 0) {
                CPSCheck = false;
                lastClickTime = null;
                clickStartTime = null;
                CPS--;
            }

        }, 350);

        setInterval(function () {
            if (CPS > 0) {
                CPS--;
            }
        }, 300);

        if (!container.querySelector(".falling-image")) {

            for (let i = 0; i < numImages; i++) {
                const image = document.createElement("img");
                image.classList.add("falling-image");
                container.appendChild(image);
                fallingImage = image;
            }
        }
        fallingImage.style.display = 'none';

        menuButton.addEventListener("click", function () {
            toggleMenuPopup(true);
        });

        menuWithdraw.addEventListener("click", function () {
            counterElement.textContent = 0;
            withdrawCount(counter);
            counter = 0;
            saveCount();
            setTimeout(loadCount, 550);
        });

        closeMenuPopupButton.addEventListener("click", function () {
            toggleMenuPopup(false);
        });

        menuExit.addEventListener("click", function () {
            window.close()
        })

        function toggleMenuPopup(show) {
            if (show) {
                menuPopup.style.bottom = "0";
                document.body.classList.add("menu-popup-active");
            } else {
                menuPopup.style.bottom = "-100%";
                document.body.classList.remove("menu-popup-active");
            }
        }

        const upgradeMenuButton = document.getElementById("upgrade-popup-button");
        const upgradePopup = document.getElementById("upgrade-popup");
        const closeUpgradePopupButton = document.getElementById("close-upgrade-popup-button");

        upgradeMenuButton.addEventListener("click", function () {
            toggleUpgradePopup(true);
        });

        closeUpgradePopupButton.addEventListener("click", function () {
            toggleUpgradePopup(false);
        });

        function toggleUpgradePopup(show) {
            if (show) {
                upgradePopup.style.bottom = "0";
                document.body.classList.add("upgrade-popup-active");
            } else {
                upgradePopup.style.bottom = "-100%";
                document.body.classList.remove("upgrade-popup-active");
            }
        }

        const skinButton = document.getElementById("skin-button");
        const skinPopup = document.getElementById("skin-popup");
        const closeSkinPopupButton = document.getElementById("close-skin-popup-button");


        document.getElementById("skin-button-1").addEventListener("click", function () {
            handlePurchase(1, "images/click1.png");
        });

        document.getElementById("skin-button-2").addEventListener("click", function () {
            handlePurchase(2, "images/click2.png");
        });

        document.getElementById("skin-button-3").addEventListener("click", function () {
            handlePurchase(3, "images/click3.png");
        });

        document.getElementById("skin-button-4").addEventListener("click", function () {
            handlePurchase(4, "images/click4.png");
        });

    function handlePurchase(buttonId, imageUrl) {

        const priceSpan = document.getElementById(`price-${buttonId}`);
        if (priceSpan.textContent === "100") {
            if (counter >= 100) {
                priceSpan.textContent = "Куплено!";
                counter -= 100;
                counterElement.textContent = counter;
                clickCircle.src = imageUrl;
                debugger
                switch (buttonId) {
                    case 1:
                        haveskin1 = true;
                        break;
                    case 2:
                        haveskin2 = true;
                        break;
                    case 3:
                        haveskin3 = true;
                        break;
                    case 4:
                        haveskin4 = true;
                        break;
                    default:
                        break;
                }

            }
        } else {
            clickCircle.src = imageUrl;
        }
    }


        skinButton.addEventListener("click", function () {
            toggleSkinPopup(true);
        });

        closeSkinPopupButton.addEventListener("click", function () {
            toggleSkinPopup(false);
        });

        function toggleSkinPopup(show) {
            if (show) {
                skinPopup.style.bottom = "0";
                document.body.classList.add("skin-popup-active");
            } else {
                skinPopup.style.bottom = "-100%";
                document.body.classList.remove("skin-popup-active");
            }
        }


        openPopupButton.addEventListener("click", function () {
            if (!popupCooldown) {
                togglePopup(true);
                popupCooldown = true;
                openPopupButton.style.visibility = "hidden";
                setTimeout(function () {
                    popupCooldown = false;
                }, 5000);
            }
            getQuestions();
        });

        clickCircle.addEventListener("mousedown", function () {
            clickCircle.classList.add("active");
        });

        clickCircle.addEventListener("mouseup", function () {
            setTimeout(function () {
                clickCircle.classList.remove("active");
            }, 100);
        });

        clickCircle.addEventListener("click", function () {

            const randomSoundIndex = Math.floor(Math.random() * 2) + 1;
            const soundFile = `sounds/tap${randomSoundIndex}.mp3`;
            const audio = new Audio(soundFile);
            audio.play();
            CPS++;

            if (progressBar.value > 0) {
                let pointsToAdd = Math.min(progressBar.value, countPerClick);
                counter += pointsToAdd;
                counterElement.textContent = counter;
                progressBar.value -= energyDrainPerClick;
                sliderValueElement.textContent = progressBar.value;
            }


            const currentTime = Date.now();
            if (!clickStartTime) {
                clickStartTime = currentTime;
            }
            lastClickTime = currentTime;

            if (currentTime - clickStartTime >= 7000 && CPSCheck == true) {
                showFallingImage();
            }

        });



        setInterval(function () {
            if (progressBar.value < progressBar.max) {
                progressBar.value += currentRestore;
                sliderValueElement.textContent = progressBar.value;
            }
        }, 6000);

    closeOnboarding.addEventListener("click", () => {
        onboarding.style.bottom = "-100%";
        onboarding.style.top = "-100%";
    });

        upgradeButton.addEventListener("click", function () {
            if (counter >= upgradePrice && level < 5) {
                counter -= upgradePrice;
                countPerClick++;
                energyDrainPerClick++;
                level++;
                upgradePrice = ((1 + ((level - 1) * (level - 1))) * 10) * (1+ level*2);
                updateLevelDisplay();
                updateUpgradePrice();
                counterElement.textContent = counter;
                if (level === 5) {
                    upgradeButton.disabled = true;
                }
            }
        });

        upupgradeButton.addEventListener("click", function () {
            if (counter >= upupgradePrice && uplevel < 5) {
                counter -= upupgradePrice;
                progressBar.max += 50;
                uplevel++;
                upupgradePrice = ((1 + ((uplevel - 1) * (uplevel - 1))) * 10) * (uplevel*2 +1);
                updateUpDisplay();
                updateUpPrice();
                counterElement.textContent = counter;
                if (uplevel === 5) {
                    upupgradeButton.disabled = true;
                }
            }
        });

        restoreupgradeButton.addEventListener("click", function () {
            if (counter >= restoreupgradePrice && restorelevel < 5) {
                counter -= restoreupgradePrice;
                currentRestore += 1;
                restorelevel++;
                restoreupgradePrice = ((1 + ((restorelevel - 1) * (restorelevel - 1))) * 10) * (restorelevel*2 +1);
                updateRestoreDisplay();
                updateRestorePrice();
                counterElement.textContent = counter;
                if (restorelevel === 5) {
                    restoreupgradeButton.disabled = true;
                }
            }
        });


        function togglePopup(show) {
            if (show) {
                popup.style.bottom = "0";
            } else {
                popup.style.bottom = "-100%";
            }
        }

        function updateLevelDisplay() {
            levelDisplay.textContent = "Уровень клика: " + (level);
            if (level == 5) {
                levelDisplay.textContent = "Уровень клика: Макс. Уровень";
            }
        }

        function updateUpgradePrice() {
            upgradePriceDisplay.textContent = "Стоимость улучшения: " + upgradePrice;
            if (level == 5) {
                upgradePriceDisplay.textContent = "Улучшение Недоступно";
            }
        }


        //////////////////////////////
        function updateRestoreDisplay() {
            RestoreDisplay.textContent = "Уровень Восстановления: " + (restorelevel);
            if (restorelevel == 5) {
                RestoreDisplay.textContent = "Уровень Восстановления: Макс. Уровень";
            }
        }

        function updateRestorePrice() {
            RestorePriceDisplay.textContent = "Стоимость улучшения: " + restoreupgradePrice;
            if (restorelevel == 5) {
                RestorePriceDisplay.textContent = "Улучшение Недоступно";
            }
        }
        //////////////////////////////

        function updateUpDisplay() {
            UpDisplay.textContent = "Уровень Макс. Энергии: " + (uplevel);
            if (uplevel == 5) {
                UpDisplay.textContent = "Уровень Макс. Энергии: Макс. Уровень";
            }
        }

        function updateUpPrice() {
            UpPriceDisplay.textContent = "Стоимость улучшения: " + upupgradePrice;
            if (uplevel == 5) {
                UpPriceDisplay.textContent = "Улучшение Недоступно";
            }
        }

        function toggleButtonVisibility() {
            if (!popupCooldown) {
                if (openPopupButton.style.visibility === "visible") {
                    openPopupButton.style.visibility = "hidden";
                    setTimeout(toggleButtonVisibility, 20000);
                } else {
                    openPopupButton.style.visibility = "visible";
                    setTimeout(toggleButtonVisibility, 5000);
                }
            } else {
                setTimeout(toggleButtonVisibility, 1000);
            }
        }

        function clickEffect(e) {
            var d = document.createElement("div");
            d.className = "clickEffect";
            d.style.top = e.clientY - 7.5 + "px";
            d.style.left = e.clientX - 7.5 + "px";
            document.body.appendChild(d);
            d.addEventListener('animationend', function () {
                d.parentElement.removeChild(d);
            });
        }

        document.addEventListener('click', clickEffect);

        toggleButtonVisibility();


        function showFallingImage() {
            if (!animationVisible) {
                fallingImage.style.display = 'block';
                animationVisible = true;
                monitorClicks();
            }
        }


        function hideFallingImage() {
            fallingImage.style.display = 'none';
            animationVisible = false;
        }

        function monitorClicks() {
            const interval = setInterval(function () {
                if (animationVisible && Date.now() - lastClickTime > 3000) {
                    hideFallingImage();
                    clearInterval(interval);
                    clickStartTime = null;
                }
            }, 1000);
        }


    });