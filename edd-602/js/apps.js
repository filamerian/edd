// ==========================================
// EdD 602 Website
// app.js
// ==========================================

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({
                behavior:"smooth"
            });

    });

});

// Navbar Shadow

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", ()=>{

    if(window.scrollY > 50){

        navbar.classList.add("shadow");

    }else{

        navbar.classList.remove("shadow");

    }

});

// Active Navigation

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll(".nav-link");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const sectionTop=section.offsetTop-120;

if(pageYOffset>=sectionTop){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});// JavaScript Document