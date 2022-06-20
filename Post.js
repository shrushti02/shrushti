import React,{useEffect,useState} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db} from './firebase'
import firebase from 'firebase'

function Post ({postId,user,username,caption,imageUrl}) {
    const [comments,setComments]= useState([]);
    const [comment,setComment]= useState('');



    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
              setComments(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  comment: doc.data(),
                }))
              );
            });
        }
    
        return () => {
          unsubscribe();
        };
      }, [postId]);
    
      const postComment =(event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
      }

      const deleteComment = (id) => {
        db.collection("posts").doc(postId).collection("comments").doc(id).delete();
      };

    return (
        <div className="post">
            {/*Header -> avtar +username */}
            <div className="post__header">
            <Avatar 
                className="post__avatar" 
                alt={username}
                src="/static/avatar/1.jpg"
             />
            <h3>{username}</h3>

            </div>


            {/*image */}
            <img 
              className="post__image"
              src={imageUrl}
              alt=""
             />

            {/*username+ caption */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            
            <div className="post__comments">
        {comments.map(({ id, comment }) => (
          <div className="post__comment">
            {/* {comment.username === user?.displayName ? (
              <button
                className="post__deleteComment"
                onClick={() => deleteComment(id)}
              >
                X
              </button>
            ) : (
              <div></div>
            )} */}
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
        </div>
        ))}
      </div>

            {user && (<form className="post__commentBox">
                <input 
                  type="text"
                  className="post__input"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value) }
                />
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
            </form>)}

        </div>
    )
}

export default Post
