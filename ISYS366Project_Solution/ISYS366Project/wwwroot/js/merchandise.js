var deleteModal = document.getElementById("deleteMerchandiseModal");
var reactivateModal = document.getElementById("reactivateMerchandiseModal");
var newMerchandiseModal = document.getElementById("newMerchandiseModal");

var spanNewClose = document.getElementById("closeIndicatorNew");

spanNewClose.onclick = function () {
    newMerchandiseModal.style.display = "none";
}

var spanReactivateClose = document.getElementById("closeIndicatorReactivate");

spanReactivateClose.onclick = function () {
    reactivateModal.style.display = "none";
}

var spanDelete = document.getElementById("closeIndicatorDelete");

spanDelete.onclick = function () {
    deleteModal.style.display = "none";
}

/* Copied from w3schools https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal */
var modal = document.getElementById("editMerchandiseModal");
var span = document.getElementById("closeIndicator");

span.onclick = function () {
    modal.style.display = "none";
}
/* End Copy */