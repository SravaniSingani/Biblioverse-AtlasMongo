document.addEventListener('DOMContentLoaded',function(){
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    let mainNav = document.querySelector('#main-navigation ul');

    hamburgerMenu.addEventListener('click', function(){
        console.log("Menu Clicked");
        mainNav.classList.toggle('active');
    });
});