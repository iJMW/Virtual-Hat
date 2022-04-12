/* Copied from w3schools https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal */
var modal = document.getElementById("editMerchandiseModal");
var spanSect = document.getElementById("closeIndicator");

spanSect.onclick = function () {
    modal.style.display = "none";
}