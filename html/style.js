$(document).ready(function(){
    // Check if a theme is saved in localStorage and apply it
    var savedTheme = localStorage.getItem('theme');
    if(savedTheme){
        $("html").attr("data-theme", savedTheme);
        updateThemeIcon();
    }

    $(".theme_icon").on('click', function(){
        // Toggle the flip animation
        $(".theme_icon").toggleClass("flip");

        // Toggle theme between light and dark
        var currentTheme = $("html").attr("data-theme");
        var newTheme = (currentTheme === "dark") ? "light" : "dark";
        $("html").attr("data-theme", newTheme);

        // Save the new theme preference in localStorage
        localStorage.setItem('theme', newTheme);

        // Update the icon to reflect the change
        updateThemeIcon();
    });

    // Rest of your code...
});

    // Function to update the theme icon based on the current theme
    function updateThemeIcon() {
        let current_theme = $("html").attr("data-theme");
        if(current_theme === "dark"){
            $(".theme_icon").removeClass("fa-moon").addClass("fa-sun");
        } else {
            $(".theme_icon").removeClass("fa-sun").addClass("fa-moon");
        }
    }


// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        let target = document.querySelector(this.getAttribute('href'));
        let navHeight = document.querySelector('.navigation').offsetHeight; // Get the dynamic height of the nav bar

        window.scroll({
            top: target.offsetTop - navHeight, // Offset the top by the height of the nav bar
            left: 0,
            behavior: 'smooth'
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        let target = document.querySelector(this.getAttribute('href'));
        let navHeight = document.querySelector('.navigation').offsetHeight; // Get the dynamic height of the nav bar

        window.scroll({
            top: target.offsetTop - navHeight, // Offset the top by the height of the nav bar
            left: 0,
            behavior: 'smooth'
        });
    });
});

  document.addEventListener("scroll", function() {
    var scrollPosition = window.pageYOffset;
    var maxScrollValue = window.innerHeight; // Maximum scroll value for the full effect
    var scrollFraction = scrollPosition / maxScrollValue;

    var image = document.getElementById('fullScreenImage');

    // Adjust these factors to control the rate of fade and movement
    var fadeOutRate = 1; // Increase for faster fade out
    var moveUpRate = 50; // Increase for faster movement up

    // Set opacity and transform based on scroll
    image.style.opacity = Math.max(1 - fadeOutRate * scrollFraction, 0);
    image.style.transform = 'translateY(-' + scrollFraction * moveUpRate + 'px)';

    // Reset style when scrolled back to top
    if (scrollPosition === 0) {
        image.style.opacity = 1;
        image.style.transform = 'translateY(0px)';
    }
});
const sentences = [
    "I'm Ahmed Hugais.",
    "I love coding and building cool stuff.",
    "Check out my projects below."
  ];
  let currentSentence = 0;
  let currentCharacter = 0;
  let html = '';
  const speedForward = 90; // Typing speed in milliseconds
  const speedWait = 1700; // Wait time before starting to type next sentence
  
  function typeWriter() {
    if (currentCharacter < sentences[currentSentence].length) {
      html += sentences[currentSentence].charAt(currentCharacter);
      document.getElementById('sentence').innerHTML = html;
      currentCharacter++;
      setTimeout(typeWriter, speedForward);
    } else {
      setTimeout(erase, speedWait);
    }
  }
  
  function erase() {
    if (currentCharacter > 0) {
      html = html.substring(0, html.length - 1);
      document.getElementById('sentence').innerHTML = html;
      currentCharacter--;
      setTimeout(erase, speedForward / 2);
    } else {
      currentSentence++;
      if (currentSentence >= sentences.length) currentSentence = 0;
      html = ''; // Reset the html content
      setTimeout(typeWriter, speedForward);
    }
  }
  
  // Start the typewriter effect
  typeWriter();
  
  document.addEventListener('DOMContentLoaded', (event) => {
    const backToTopButton = document.getElementById('back-to-top');
  
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 20) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const courseSlide = document.querySelector('#class-course'); // Ensure it's targeting the right class
    let isDown = false;
    let startX;
    let scrollLeft;

    courseSlide.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - courseSlide.offsetLeft;
        scrollLeft = courseSlide.scrollLeft;
    });

    courseSlide.addEventListener('mouseleave', () => {
        isDown = false;
    });

    courseSlide.addEventListener('mouseup', () => {
        isDown = false;
    });

    courseSlide.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - courseSlide.offsetLeft;
        const walk = (x - startX) * 3; // Scroll-fast
        courseSlide.scrollLeft = scrollLeft - walk;
    });
});
document.addEventListener('DOMContentLoaded', (event) => {
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light'); // Set your default theme here
    }
});


// Check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode'); 

const enableDarkMode = () => {
  // Add the class to the body
  document.body.classList.add('darkmode');
  // Update darkMode in localStorage
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  // Remove the class from the body
  document.body.classList.remove('darkmode');
  // Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);
}
 
// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
  enableDarkMode();
}

// When someone clicks the button
themeIcon.addEventListener('click', () => {
  // get their darkMode setting
  darkMode = localStorage.getItem('darkMode'); 
  
  // if it not current enabled, enable it
  if (darkMode !== 'enabled') {
    enableDarkMode();
  // if it has been enabled, turn it off  
  } else {  
    disableDarkMode(); 
  }
});
