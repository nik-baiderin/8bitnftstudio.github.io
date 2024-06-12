document.addEventListener("DOMContentLoaded", function () {
    const numImages = 1; 
    const container = document.querySelector(".container");
    let fallingImage;
    let CPScheck = true;

    setInterval(function () {
        if (CPS > 6) {
            CPS = 6;
            CPSCheck = true;
        }
        
    }, 100);

    setInterval(function () {
        if (CPS < 4 && CPS >= 0) {
            CPSCheck = false;
            lastClickTime = null;
            clickStartTime = null;
            CPS--;
        }
        
    }, 350);


    if (!container.querySelector(".falling-image")) {
        
        for (let i = 0; i < numImages; i++) {
            const image = document.createElement("img");
            image.classList.add("falling-image");
            container.appendChild(image);
            fallingImage = image; 
        }
    }
    fallingImage.style.display = 'none';

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
    const closePopupButton = document.getElementById("close-popup-button");
    const openPopupButton = document.getElementById("open-popup-button");
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

    const menuButton = document.getElementById("menu-button");
    const menuPopup = document.getElementById("menu-popup");
    const menuWithdraw = document.getElementById("menu-button-1")
    const menuExit = document.getElementById("menu-button-2")
    const closeMenuPopupButton = document.getElementById("close-menu-popup-button");

    menuButton.addEventListener("click", function () {
        toggleMenuPopup(true);
    });
    // Выводит токены на баланс (Пока что только обнуляет счетчик)
    menuWithdraw.addEventListener("click", function () { 
        counterElement.textContent = 0;
        counter = 0;
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

    document.getElementById("add-points-button").addEventListener("click", function () {
        counter += 10;
        counterElement.textContent = counter;
        togglePopup(false);
    });

    openPopupButton.addEventListener("click", function () {
        if (!popupCooldown) {
            togglePopup(true);
            popupCooldown = true;
            openPopupButton.style.visibility = "hidden";
            setTimeout(function () {
                popupCooldown = false;
            }, 20000);
        }
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



    closePopupButton.addEventListener("click", function () {
        togglePopup(false);
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