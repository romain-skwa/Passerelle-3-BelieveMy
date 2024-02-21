export  function AffichageTweet(props){
    return (
        <>
            <div className="tweetFrame">
                <h3>{props.title}</h3>
                <article className="contentTweet">{props.contentTweet}</article>
                <div className="authorTweet">Tweet écrit par {props.authorTweet}</div>
            </div>
        </>
    );
}