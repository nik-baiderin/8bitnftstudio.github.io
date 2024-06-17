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

    let clickStartTime = null;
    let lastClickTime = null;
    let animationVisible = false;
    let CPS = 0;

    let counter = 0;
    let countPerClick = 1;
    let energyDrainPerClick = 1;
    let level = 0;
    let upgradePrice = 10;
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
    let restoreupgradePrice = 10;
    let upupgradePrice = 10;

    const UpDisplay = document.getElementById("up-display");
    const UpPriceDisplay = document.getElementById("up-price");
    const RestoreDisplay = document.getElementById("restore-display");
    const RestorePriceDisplay = document.getElementById("restore-price");

    updateLevelDisplay();
    updateUpgradePrice();
    updateRestoreDisplay();
    updateRestorePrice();
    updateUpDisplay();
    updateUpPrice();
    loadCount();

    const menuButton = document.getElementById("menu-button");
    const menuPopup = document.getElementById("menu-popup");
    const menuWithdraw = document.getElementById("menu-button-1")
    const menuExit = document.getElementById("menu-button-2")
    const closeMenuPopupButton = document.getElementById("close-menu-popup-button");
    const openPopupButton = document.getElementById('open-popup-button');
    let initialcounter = 0;
    const balance = document.getElementById("totalcount");

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    function getQuestions() {
        fetch('http://localhost:3000/questions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(qData => {
                if (!qData || qData.length === 0) {
                    throw new Error('No questions found in the response');
                }

                let randomQ = Math.floor(Math.random() * qData.length);
                const question = qData[randomQ];
                const questionText = question.questionText;
                const answers = question.answers;
                questionElement.textContent = questionText;

                // Display answers
                if (answers.length >= 2) {
                    answerButtons[0].textContent = answers[0].text;
                    answerButtons[1].textContent = answers[1].text;

                    // Event listener for first answer button
                    function handler1() {
                        handleAnswerClick(answers[0]);
                        answerButtons[0].removeEventListener('click', handler1);
                        answerButtons[1].removeEventListener('click', handler2);
                    }
                    answerButtons[0].addEventListener('click', handler1);

                    // Event listener for second answer button
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
    //////////////////////////////////////////////////////////////////////////////////////////////////////

        // Function to load initial count from db.json
        function loadCount() {
            fetch('http://localhost:3000/users/0')
                .then(response => response.json())
                .then(data => {
                    initialcounter = data.gamecount;
                    counter = data.gamecount;
                    counterElement.textContent = counter;
                    balance.textContent = "Общий баланс профиля: " + data.totalcount;
                })
                .catch(error => console.error('Error loading count:', error));
        }

        function reloadCount() {
            fetch('http://localhost:3000/users/0')
                .then(response => response.json())
                .then(data => {
                    initialcounter = data.gamecount;
                    reloadbalance = data.totalcount;
                    balance.textContent = "Общий баланс профиля: " + reloadbalance;
                })
                .catch(error => console.error('Error loading count:', error));
        }


        // Function to save count to db.json
        function saveCount() {
            fetch('http://localhost:3000/users/0', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gamecount: counter })
            })
                .then(response => response.json())
                .then(data => console.log('Count saved successfully:', data))
                .catch(error => console.error('Error saving count:', error));
        }

        function withdrawCount(counter) {
            // Fetch the current user data
            fetch('http://localhost:3000/users/0')
                .then(response => response.json())
                .then(userData => {
                    // Calculate new totalcount
                    const newTotalCount = userData.totalcount + counter;
                    // Update totalcount with the new value
                    return fetch('http://localhost:3000/users/0', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ totalcount: newTotalCount })
                    });
                })
                .then(response => response.json())
                .then(data => console.log('Total count updated successfully:', data))
                .catch(error => console.error('Error updating total count:', error));

        }

        // Save count when the page is closed or refreshed
        window.addEventListener('beforeunload', () => {
            saveCount();
        });

    
        //////////////////////////////////////////////////////////////////////////////////////////////////////

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

        // Выводит токены на баланс
        menuWithdraw.addEventListener("click", function () {
            counterElement.textContent = 0;
            withdrawCount(counter);
            counter = 0;
            saveCount();
            setTimeout(reloadCount, 550);
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

        let currentRestore = 1;

        setInterval(function () {
            if (progressBar.value < progressBar.max) {
                progressBar.value += currentRestore;
                sliderValueElement.textContent = progressBar.value;
            }
        }, 1000);

        upgradeButton.addEventListener("click", function () {
            if (counter >= upgradePrice && level < 5) {
                counter -= upgradePrice;
                countPerClick++;
                energyDrainPerClick++;
                level++;
                upgradePrice += 10;
                updateLevelDisplay();
                updateUpgradePrice();
                counterElement.textContent = counter;
                if (level === 5) {
                    upgradeButton.disabled = true;
                }
            }
        });


        upupgradeButton.addEventListener("click", function () {
            if (counter >= upupgradePrice && level < 5) {
                counter -= upupgradePrice;
                progressBar.max += 50;
                uplevel++;
                upupgradePrice += 10;
                updateUpDisplay();
                updateUpPrice();
                counterElement.textContent = counter;
                if (level === 5) {
                    upupgradeButton.disabled = true;
                }
            }
        });

        restoreupgradeButton.addEventListener("click", function () {
            if (counter >= restoreupgradePrice && level < 5) {
                counter -= restoreupgradePrice;
                currentRestore += 1;
                restorelevel++;
                restoreupgradePrice += 10;
                updateRestoreDisplay();
                updateRestorePrice();
                counterElement.textContent = counter;
                if (level === 5) {
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
            levelDisplay.textContent = "Уровень клика: " + (level + 1);
        }

        function updateUpgradePrice() {
            upgradePriceDisplay.textContent = "Стоимость улучшения: " + upgradePrice;
        }


        //////////////////////////////
        function updateRestoreDisplay() {
            RestoreDisplay.textContent = "Уровень Восстановления Энергии: " + (restorelevel + 1);
        }

        function updateRestorePrice() {
            RestorePriceDisplay.textContent = "Стоимость улучшения: " + restoreupgradePrice;
        }
        //////////////////////////////

        function updateUpDisplay() {
            UpDisplay.textContent = "Уровень Макс. Энергии: " + (uplevel + 1);
        }

        function updateUpPrice() {
            UpPriceDisplay.textContent = "Стоимость улучшения: " + upupgradePrice;
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