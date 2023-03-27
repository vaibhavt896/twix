import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';



document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.delete){
    handleDeleteClick(e.target.dataset.delete)
}

})
function handleDeleteClick(tweetId){
    const tweetIndex = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })
    
    if(tweetIndex !== -1){
        tweetsData.splice(tweetIndex, 1)
                localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

        render()
    }
}

 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
        localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    const repliesDiv = document.getElementById(`replies-${replyId}`)
    const replyInput = repliesDiv.querySelector('.reply-input')
    const replyBtn = repliesDiv.querySelector('.reply-btn')

    // Show/hide reply input field and button
    replyInput.classList.toggle('hidden')
    replyBtn.classList.toggle('hidden')

    // Add event listener to submit button
    replyBtn.addEventListener('click', function(){
        const tweet = tweetsData.filter(function(tweet){
            return tweet.uuid === replyId
        })[0]
// Create new object for reply
        const newReply = {
           handle: `@Vaibhav`,
            profilePic: `images/vaibhav.png`,
            likes: 0,
            retweets: 0,
            tweetText: replyInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }

        // Add new reply object to replies array of tweet
        tweet.replies.unshift(newReply)

        // Hide input field and button
        replyInput.classList.toggle('hidden')
        replyBtn.classList.toggle('hidden')
 // Clear input field
        replyInput.value = ''
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

        // Update feed with new reply
        render()
    })
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Vaibhav`,
            profilePic: `images/vaibhav.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
            
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
    <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
 
</span>
            </div> 
            <div class="hidden" id="replies-${tweet.uuid}">
    ${repliesHtml}
    <div class="reply-container">
        <input type="text" class="reply-input hidden" placeholder="Reply...">
        <button id="reply"class="reply-btn hidden">Reply</button>
    </div>
</div>  
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
    
   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

localStorage.setItem('tweetsData', JSON.stringify(tweetsData));

