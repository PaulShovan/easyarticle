var firebaseStorage = function(){
    var config = {
    apiKey: 'AIzaSyCD6E_JMziZrfHhgF8NfUrZYCuqGl51yBw',
    databaseURL: 'https://easynotes-8f50d.firebaseio.com',
    storageBucket: 'easynotes-8f50d.appspot.com'
    };
    firebase.initializeApp(config);
    function GetData(callback){
        var uid = document.getElementById('auth-user-id').value;
        firebase.database().ref('demo/' + uid).once('value').then(function(snapshot) {
            var notes = [];
            snapshot.forEach(function(item) {
                var itemVal = item.val();
                itemVal.Id = item.getKey();
                notes.push(itemVal);
            });
            callback(notes);
        });
    }
    function EditData(data, uid){
        var contactsRef = firebase.database().ref('demo/' + uid);
        contactsRef.child(data.Id).update(data);
        return true;
    }
    function AddData(data){
        var uid = document.getElementById('auth-user-id').value;
        if(!uid){
            return false;
        }
        if(data.Id){
          return EditData(data, uid);
        }
        var contactsRef = firebase.database().ref('demo/' + uid);
        contactsRef.push(data);
        return true;
    }
    function DeleteData(data){
        var uid = document.getElementById('auth-user-id').value;
        var contactsRef = firebase.database().ref('demo/' + uid);
        contactsRef.child(data.Id).remove();
        return true;
    }
    var initApp = function() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      // [START_EXCLUDE]
      document.getElementById('login-button').textContent = 'Sign out';
      document.getElementById('auth-user').innerHTML = user.displayName;
      document.getElementById('auth-user-id').value = user.uid;
      document.getElementById('note-tab-li').className = "";
      document.getElementById('save').className = "";
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('login-button').textContent = 'Sign-in with Google';
      document.getElementById('auth-user').innerHTML = "";
      document.getElementById('auth-user-id').value = "";
      document.getElementById('editor-tab').click();
      document.getElementById('note-tab-li').className += "hide";
      document.getElementById('save').className += "hide";
      // [END_EXCLUDE]
    }
    document.getElementById('login-button').disabled = false;
  });

  // [END authstatelistener]
  document.getElementById('login-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  document.getElementById('login-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

    return{
        SaveNote: AddData,
        GetNotes: GetData,
        InitApp: initApp,
        DeleteData: DeleteData
    }
}()
window.onload = function() {
  firebaseStorage.InitApp();
};
