document.addEventListener('DOMContentLoaded', () => {
    const swButton = document.getElementById('vote-star-wars');
    const lotrButton = document.getElementById('vote-lotr');
    const swCountSpan = document.getElementById('sw-count');
    const lotrCountSpan = document.getElementById('lotr-count');
    const commentInput = document.getElementById('comment-input');
    const submitCommentBtn = document.getElementById('submit-comment');
    const commentsList = document.getElementById('comments-list');

    // Load initial vote counts and comments from localStorage
    let swVotes = parseInt(localStorage.getItem('swVotes')) || 0;
    let lotrVotes = parseInt(localStorage.getItem('lotrVotes')) || 0;
    let comments = JSON.parse(localStorage.getItem('comments')) || [];

    swCountSpan.textContent = swVotes;
    lotrCountSpan.textContent = lotrVotes;
    renderComments();
    
    // Check for existing vote cookie and disable buttons if found
    checkVoteCookie();

    // Antagonistic "AI" responses
    const aiResponses = [
        "Your argument is specious and ill-informed.",
        "That's a weak defense for a walking movie.",
        "Your head must be up your ass if you believe that.",
        "The logic of your argument is as flimsy as a hobbit's resolve.",
        "You're not even supposed to be here today. Go home.",
        "Do you even know what you're talking about? Because I'm not seeing it.",
        "That's the stupidest thing I've heard all day. Next.",
        "You think that's a good point? Ha! That's adorable.",
        "Try again. That was pathetic.",
        "I've had better arguments with myself while asleep."
    ];

    // Function to add a comment to the list and localStorage
    function addComment(text, isAI = false) {
        comments.push({ text: text, isAI: isAI });
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments(); // Re-render comments
        checkVoteCookie(); // Re-check the cookie and disable the buttons
    }

    // Function to render all comments
    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach((comment) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.textContent = comment.text;

            // If the comment is from the AI, add a reply button
            if (comment.isAI) {
                const replyButton = document.createElement('button');
                replyButton.textContent = 'Reply';
                replyButton.className = 'reply-button';
                replyButton.onclick = () => {
                    // Create a dynamic reply box below the AI's comment
                    const existingReplyBox = document.querySelector('.reply-box');
                    if (existingReplyBox) {
                        existingReplyBox.remove();
                    }

                    const replyBox = document.createElement('div');
                    replyBox.className = 'reply-box';
                    
                    const replyInput = document.createElement('textarea');
                    replyInput.placeholder = "Reply to the AI's foolishness...";
                    
                    const replySubmit = document.createElement('button');
                    replySubmit.textContent = 'Send Reply';

                    replyBox.appendChild(replyInput);
                    replyBox.appendChild(replySubmit);
                    commentDiv.appendChild(replyBox);
                    replyInput.focus();

                    replySubmit.onclick = () => {
                        const userReply = replyInput.value.trim();
                        if (userReply) {
                            addComment("You: " + userReply);
                            replyBox.remove();
                            setTimeout(() => {
                                const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                                addComment("AI: " + aiResponse, true);
                            }, 1500);
                        }
                    };
                };
                commentDiv.appendChild(replyButton);
            }
            commentsList.appendChild(commentDiv);
        });
    }

    // New functions for cookie-based voting restriction
    function setVoteCookie() {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Cookie expires in 1 year
        let expires = "expires=" + d.toUTCString();
        document.cookie = "trilogy_vote=true;" + expires + ";path=/";
    }

    function checkVoteCookie() {
        let name = "trilogy_vote=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                // Cookie found, disable buttons
                swButton.disabled = true;
                lotrButton.disabled = true;
                return;
            }
        }
    }

    // Event listener for the main comment box
    submitCommentBtn.addEventListener('click', () => {
        let commentText = commentInput.value.trim();
        if (commentText === '') return;

        // Simple spam filter: checks for URLs
        if (commentText.includes('http://') || commentText.includes('https://') || commentText.includes('www.')) {
            alert("Spam detected. Comments with links are not allowed.");
            return;
        }

        // Add the user's comment
        addComment("You: " + commentText);
        commentInput.value = '';

        // Add a random AI response after a short delay
        setTimeout(() => {
            const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            addComment("AI: " + aiResponse, true); // True indicates it's an AI comment
        }, 1500);
    });

    // Modified vote button listeners to use the new cookie function
    swButton.addEventListener('click', () => {
        if (!swButton.disabled) {
            swVotes++;
            localStorage.setItem('swVotes', swVotes);
            swCountSpan.textContent = swVotes;
            setVoteCookie();
            swButton.disabled = true;
            lotrButton.disabled = true;
        }
    });

    lotrButton.addEventListener('click', () => {
        if (!lotrButton.disabled) {
            lotrVotes++;
            localStorage.setItem('lotrVotes', lotrVotes);
            lotrCountSpan.textContent = lotrVotes;
            setVoteCookie();
            swButton.disabled = true;
            lotrButton.disabled = true;
        }
    });
});
