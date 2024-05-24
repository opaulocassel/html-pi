const navBar = document.querySelector("before"),
    menuBtns = document.querySelectorAll(".menu-icon-before"),
    overlay = document.querySelector(".overlaySidebarBefore");
menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
        navBar.classList.toggle("open");
    });
});
overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
});