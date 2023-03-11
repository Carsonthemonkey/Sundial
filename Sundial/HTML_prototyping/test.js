document.addEventListener("DOMContentLoaded", domLoadedHandler)
function domLoadedHandler(){
    const infoBox = document.querySelector(".info-box-container")
    const timeReplaceElements = document.querySelectorAll(".time-replace")
    for (const element of timeReplaceElements) {
        element.addEventListener("mouseover", showInfoBox)
        element.addEventListener("mouseout", hideInfoBox)
    }

    function showInfoBox(event) {
        // transform the info box to above the element
        const element = event.target
        const elementRect = element.getBoundingClientRect()
        const infoBoxRect = infoBox.getBoundingClientRect()
        const infoBoxTop = elementRect.top - 5 - infoBoxRect.height;
        const infoBoxLeft = elementRect.left + elementRect.width / 2 - infoBoxRect.width / 2
        infoBox.style.top = infoBoxTop + "px"
        infoBox.style.left = infoBoxLeft + "px"

        infoBox.style.transform = "translate(0%, 0%)"
        infoBox.style.visibility = "visible"
        infoBox.style.opacity = "1"
    }

    function hideInfoBox(event) {
        infoBox.style.transform = "translate(0, 30%)"
        infoBox.style.visibility = "hidden"
        infoBox.style.opacity = "0"
    }
}