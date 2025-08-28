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

    swButton.addEventListener('click', () => {
        swVotes++;
        localStorage.setItem('swVotes', swVotes);
        swCountSpan.textContent = swVotes;
    });

    lotrButton.addEventListener('click', () => {
        lotrVotes++;
        localStorage.setItem('lotrVotes', lotrVotes);
        lotrCountSpan.textContent = lotrVotes;
    });

    submitCommentBtn.addEventListener('click', () => {
        let commentText = commentInput.value.trim();

        if (commentText === '') {
            return;
        }

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

    function addComment(text, isAI = false) {
        comments.push({ text: text, isAI: isAI });
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
    }

    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.textContent = comment.text;

            // If the comment is from the AI, add a reply button
            if (comment.isAI) {
                const replyButton = document.createElement('button');
                replyButton.textContent = 'Reply';
                replyButton.className = 'reply-button';
                replyButton.onclick = () => {
                    const userReply = prompt("Reply to the AI:");
                    if (userReply) {
                        addComment("You: " + userReply);
                        setTimeout(() => {
                            const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                            addComment("AI: " + aiResponse, true);
                        }, 1500);
                    }
                };
                commentDiv.appendChild(replyButton);
            }
            commentsList.appendChild(commentDiv);
        });
    }
});
