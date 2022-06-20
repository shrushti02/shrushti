import  react , {useState,useEffect} from 'react'
import './App.css';
import Post from './Post';
import {auth, db} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'


// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes =useStyles()
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user,setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
      }
      else{
        //user has logged out...
        setUser(null);
      }

    })
    return () => {
      //perform clean up actions 
      unsubscribe();
    }
  }, [user,username])

   
    // useEFFECT- runs a peice of code on condition
    useEffect(()=>{
        //this is place where code runs
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
        //every time new post is added
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      })
    },[])

      const signUp = (event) =>{
        event.preventDefault();
        auth
        .createUserWithEmailAndPassword(email,password)
        .then((authUser) => {
          return authUser.user.updateProfile( {
            displayName: username,
          })
        })
        .catch((error) => alert(error.message));
        setOpen(false);
      }

      const signIn =(event) => {
        event.preventDefault();
        
        auth
        .signInWithEmailAndPassword(email,password)
        .catch((error) => alert(error.message))

        setOpenSignIn(false);


      }


  return (
    <div className="App">
      
      


      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
         <center>
            <img
            className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" 
            alt=""/>
          </center>
          
          <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
            </form>
     
    </div>
       
      </Modal>


      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
         <center>
            <img
            className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" 
            alt=""/>
          </center>
          
          
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
            </form>
     
    </div>
       
      </Modal>

      {/*header */}
      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        {user ? (
         <Button onClick={ () => auth.signOut()}>Logout</Button>
       ): (
         <div className="app_loginContainer">
           <Button onClick={() =>setOpenSignIn(true)}>Sign In</Button>
           <Button onClick={() =>setOpen(true)}>Sign Up</Button> 
         </div>
       )}
      </div>
       

      {/* <h1>aks</h1> */}
      <div className="app__posts">
      <div className="app__postLeft">
      {
        posts.map(({id, post}) =>(
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
      </div>

      

      <div className="app_postsRight">
        <InstagramEmbed
      url='https://www.instagram/p/B_uf9dmAGPw/'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
      />
</div>
</div>
      {/*posts */}

      
      
{user?.displayName ?(
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to Login to upload</h3>
      )}
      

    </div>
  );
}

export default App;
