document.addEventListener("DOMContentLoaded", function () {
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
    const levelDisplay = document.getElementById("level-display");
    const upgradePriceDisplay = document.getElementById("upgrade-price");
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup-button");
    const openPopupButton = document.getElementById("open-popup-button");

    updateLevelDisplay();
    updateUpgradePrice();

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
        }, 100);  // Allow time for the click event to complete
    });

    clickCircle.addEventListener("click", function () {
        if (progressBar.value > 0) {
            let pointsToAdd = Math.min(progressBar.value, countPerClick);
            counter += pointsToAdd;
            counterElement.textContent = counter;
            progressBar.value -= energyDrainPerClick;
            sliderValueElement.textContent = progressBar.value;
        }
    });

    setInterval(function () {
        if (progressBar.value < 100) {
            progressBar.value++;
            sliderValueElement.textContent = progressBar.value;
        }
    }, 500);

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
        levelDisplay.textContent = "Level: " + (level + 1);
    }

    function updateUpgradePrice() {
        upgradePriceDisplay.textContent = "Upgrade Price: " + upgradePrice;
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

    toggleButtonVisibility();
});