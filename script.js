// Love Letter Generator Function
function generateLetter() {
    let input = document.getElementById('input-text').value;
    let yourName = "Pasha"; // Fixed name
    let herName = "Delia"; // Fixed name
    let output = `Dear ${herName},<br><br>
    Today, I was reminded of how much you irritate me, but despite that, I can't imagine life without you being a constant pain in my ass. I love you, and that's as shocking to me as it is to you.<br><br>
    Yours sarcastically,<br>${yourName}.`;
    
    document.getElementById('letter-output').innerHTML = output;
    document.getElementById('letter-output').style.display = 'block';
}

// Copy to Clipboard Function
function copyToClipboard() {
    let output = document.getElementById('letter-output');
    if (output.innerHTML) {
        // Create a temporary textarea to copy the content
        let tempTextarea = document.createElement('textarea');
        tempTextarea.value = output.innerHTML;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea); // Remove temporary textarea

        // Show the notification
        let notification = document.getElementById('notification');
        notification.style.display = 'block';
        notification.style.opacity = '1'; // Make it visible
        notification.style.animation = 'bounce 0.5s'; // Add bounce animation

        // Hide notification after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0'; // Fade out
            setTimeout(() => {
                notification.style.display = 'none'; // Hide after fade out
            }, 500); // Match with CSS transition duration
        }, 2000); // Show for 2 seconds
    } else {
        console.error("No content to copy.");
    }
}

// Countdown Timer Function
// Countdown Timer Function
let countDownDate = new Date("Sep 12, 2025 00:00:00").getTime(); // Fixed countdown date

// Update the countdown every second
let countdownFunction = setInterval(function() {
    let now = new Date().getTime();
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the countdown
    const countdownElement = document.getElementById("countdown");
    countdownElement.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // Add fun animation on update
    countdownElement.style.animation = "countdownAnim 0.5s"; // Add animation class

    // Reset animation
    countdownElement.addEventListener('animationend', () => {
        countdownElement.style.animation = ''; // Reset the animation
    });

    if (distance < 0) {
        clearInterval(countdownFunction);
        countdownElement.innerHTML = "I'm coming to get you...";
    }
}, 1000);


// Reset Function
function resetForm() {
    document.getElementById('input-text').value = '';
    document.getElementById('letter-output').innerHTML = '';
    document.getElementById('letter-output').style.display = 'none';
    document.getElementById('charCount').innerText = 'Character count: 0'; // Reset character count
}

// Character Count Function
const inputText = document.getElementById('input-text');
const charCountDisplay = document.getElementById('charCount');

inputText.addEventListener('input', function() {
    charCountDisplay.innerText = `Character count: ${inputText.value.length}`;
});

particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: {
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
        },
    },
    interactivity: {
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
        },
        modes: {
            repulse: { distance: 100, duration: 1 },
            push: { particles_nb: 4 },
        },
    },
    retina_detect: true,
});



// Function to submit a song dedication
function submitSongDedication() {
    const songInput = document.getElementById('song-input').value;
    const artistInput = document.getElementById('artist-input').value;
    const dedicationInput = document.getElementById('dedication-input').value;
    const timestamp = new Date();

    // Store the song dedication in Firestore
    db.collection('songsded').add({
        song: songInput,
        artist: artistInput,
        dedication: dedicationInput,
        timestamp: timestamp
    }).then(() => {
        console.log('Song dedication added successfully!');
        loadSongDedications(); // Reload dedications after adding
    }).catch((error) => {
        console.error('Error adding song dedication: ', error);
    });

    // Clear input fields after submission
    document.getElementById('song-input').value = '';
    document.getElementById('artist-input').value = '';
    document.getElementById('dedication-input').value = '';
}

// Function to load song dedications from Firestore
function loadSongDedications() {
    const songOutput = document.getElementById('songs-output');
    songOutput.innerHTML = ''; // Clear previous dedications

    db.collection('songsded').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const songData = doc.data();
            const songDiv = document.createElement('div');
            songDiv.innerHTML = `<strong>${songData.song}</strong> by <em>${songData.artist}</em>: ${songData.dedication} <br><small>${songData.timestamp.toDate().toLocaleString()}</small>`;
            songOutput.appendChild(songDiv);
        });
    });
}


// Call loadDedications when the page loads
window.onload = loadDedications;

// Initialize Firestore
const db = firebase.firestore();

// Function to submit a note
function submitNote() {
    const noteInput = document.getElementById('note-input').value;
    const timestamp = new Date();

    // Store the note in Firestore
    db.collection('notes').add({
        note: noteInput,
        timestamp: timestamp
    }).then(() => {
        console.log('Note added successfully!');
        loadNotes(); // Reload notes after adding
    }).catch((error) => {
        console.error('Error adding note: ', error);
    });

    // Clear input after submission
    document.getElementById('note-input').value = '';
}

// Function to load notes from Firestore
function loadNotes() {
    const notesOutput = document.getElementById('notes-output');
    notesOutput.innerHTML = ''; // Clear previous notes

    db.collection('notes').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const noteData = doc.data();
            const noteDiv = document.createElement('div');
            noteDiv.innerHTML = `<strong>${noteData.timestamp.toDate().toLocaleString()}</strong>: ${noteData.note}`;
            notesOutput.appendChild(noteDiv);
        });
    });
}

// Load notes on page load
window.onload = function() {
    loadNotes();
    loadSongDedications();
};
