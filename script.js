// Replace these values with your Supabase API URL and anon key
const supabaseUrl = 'https://mfmnnyfpzvhclfamikqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mbW5ueWZwenZoY2xmYW1pa3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMjY4OTcsImV4cCI6MjA0MzYwMjg5N30.NgwkA1D1BAdKfe7UGI9LFudETiKG08bVsgmqZ9kEGUo';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

// Add Event Listener for Song Dedication Submission
document.getElementById('submit-btn').addEventListener('click', async () => {
    const songInput = document.getElementById('song-input').value;
    const artistInput = document.getElementById('artist-input').value;
    const dedicationInput = document.getElementById('dedication-input').value;

    if (!songInput || !artistInput || !dedicationInput) {
        alert('Please fill in all fields.');
        return;
    }

    // Insert the song dedication into the Supabase database
    const { data, error } = await supabase
        .from('songsded')
        .insert([
            { song: songInput, artist: artistInput, dedication: dedicationInput, created_at: new Date() }
        ]);

    if (error) {
        console.error('Error adding song dedication:', error);
    } else {
        console.log('Song dedication added successfully!', data);
        loadSongDedications(); // Reload the list after successful submission
    }

    // Clear the input fields after submission
    document.getElementById('song-input').value = '';
    document.getElementById('artist-input').value = '';
    document.getElementById('dedication-input').value = '';
});

// Function to Load Song Dedications
async function loadSongDedications() {
    const { data: dedications, error } = await supabase
        .from('songsded')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching song dedications:', error);
        return;
    }

    // Populate the dedications list
    const dedicationsList = document.getElementById('dedications-list');
    dedicationsList.innerHTML = ''; // Clear the list

    dedications.forEach(dedication => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${dedication.song}</strong> by <em>${dedication.artist}</em>: ${dedication.dedication}`;
        dedicationsList.appendChild(listItem);
    });
}

// Load the dedications on page load
document.addEventListener('DOMContentLoaded', loadSongDedications);
