import initialPosts from "./initialPosts.json" assert { type: "json" }

const currentPage = window.location.pathname.replace("/", "").replace(".html", "")

if (localStorage.getItem("blogRegister") == "" || localStorage.getItem("blogRegister") == null) {
    localStorage.setItem("blogRegister", JSON.stringify([]))
}
const register = JSON.parse(localStorage.getItem("blogRegister"));

if (localStorage.getItem("blogPosts") == "" || localStorage.getItem("blogPosts") == null) {
    localStorage.setItem("blogPosts", JSON.stringify([]))
}
const blogPosts = JSON.parse(localStorage.getItem("blogPosts"));
if(!!!blogPosts.find(blogPost => blogPost.title === initialPosts[0].title)){
    initialPosts.forEach(initialPost => blogPosts.push(initialPost))
}

const blogLogin = JSON.parse(localStorage.getItem("blogLogin"));


function isLogged() {
    if (blogLogin) {
        return true;
    } else {
        return false;
    }
}

if (currentPage == "login") {
    const submitReg = document.getElementById("login-submit");
    const creatPost = document.getElementById("post");
    const logOut = document.querySelector(".logOut");

    submitReg.addEventListener("click", event => {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        if (email == "" || password == "") {
            alert("Empty Field!")
        } else {
            const userFromRegister = register.find(currentUser => currentUser.email == email)
            if (userFromRegister) {
                if (password == userFromRegister.password) {
                    localStorage.setItem("blogLogin", JSON.stringify({ email, password }));
                    alert("sucsessful login!");
                    location.href = `/index.html`;
                } else {
                    alert("Wrong Password")
                }
            } else {
                alert("User Does Not Exist")
            }
        }
    });
} else if (currentPage == "register") {
    const submitReg = document.getElementById("register-submit");
    submitReg.addEventListener("click", event => {
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;
        if (email !== "") {
            if (password !== "" && password === confirmPassword) {
                const existingUser = register.find((currentObj) => currentObj.email == email)
                if (existingUser) {
                    alert("User Exists Already")
                } else {
                    register.push({ email, password })
                    localStorage.setItem("blogRegister", JSON.stringify(register))
                    alert("Registered!")
                    location.href = `/index.html`;
                }
            } else {
                alert("Passwords dont match")
            }
        } else {
            alert("Empty email")
        }
    })
} else if (currentPage == "post") {
    const submit = document.getElementById("submit-post");
    submit.addEventListener("click", event => {
        const titleValue = document.getElementById("title-post").value;
        const postValue = document.getElementById("post").value;
        if(titleValue !== "" && postValue !== ""){
            const currentUser = JSON.parse(localStorage.getItem("blogLogin"));
            const postData = {
                title: titleValue,
                post: postValue,
                user: currentUser.email,
                date: Date.now(),
                comments: []
            }
            blogPosts.push(postData);
            localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
            location.href = `/index.html`;
        }else{
            alert("empty field")
        }            
    });
    
} else if (currentPage == "index") {
    const posts = document.querySelector(".div-post");
    const listPost = document.getElementById("list");
    const logOut = document.querySelector(".logOut");
    const creatPost = document.getElementById("creat-post");
    const logIn = document.getElementById("log-in");
    const singlePost = document.getElementById("single");


    logIn.addEventListener("click", event => {
        location.href = `/login.html`;
    });

    if (isLogged()) {
        logOut.removeAttribute("hidden");
        creatPost.removeAttribute("hidden");
        logOut.addEventListener("click", event => {
            localStorage.setItem("blogLogin", JSON.stringify(""));
            alert("Log out")
            location.href = `/index.html`;
        })
        creatPost.addEventListener("click", event => {
            location.href = `./post.html`
        })
    } else {
        logIn.removeAttribute("hidden")
    }
    
    if (window.location.search == "") {
        listPost.innerHTML = ""
        blogPosts.forEach(({ title, comments, date }) => {
            const d = new Date(date)
            listPost.innerHTML += `
                <div class= "post-element"><a id="post-elements" href="/index.html?title=${title}">
                    <h3>${title}</h3>
                    <p>From: ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}</p>
                    <p> Comment Number: ${comments.length}</p>
                </a></div>`
        });
    } else {
        document.getElementById("back-main").removeAttribute("hidden");
        const addComment = document.getElementById("add-comment");
        const commentValue = document.getElementById("value-comment");
        const submitComment = document.getElementById("submit-comment");
        if (isLogged()) {
            addComment.removeAttribute("hidden");
        }
        addComment.addEventListener("click", event => {
            commentValue.removeAttribute("hidden");
            submitComment.removeAttribute("hidden")

        })

        const searchTitle = window.location.search.replace("?title=", "")
        const searchPost = blogPosts.find(({ title }) => title == searchTitle)

        if (searchPost) {
            const { title, comments, date, user, post } = searchPost;

            function fillData() {
                const d = new Date(date)
                let c = comments.reduce((total, { cUser, cText, cDate }) => {
                    const cd = new Date(cDate)
                    return `${total}<div>
                            <p id= "comment-value">
                            ${cText} - 
                            ${cUser} 
                            ${cd.getDate()}/${(cd.getMonth()+1)}/${cd.getFullYear()}
                            </p>                            
                        </div>`
                }, "")
                if (c == "") {
                    c = "No Comments"
                }
                singlePost.innerHTML = `
                    <div class = "single-post">
                    <h1 id = "title-single-post">${title}</h1>
                    <p id = "value-single-post">${post.split("\n").join("<br>")}</p>  
                    </div>                
                    <div class = "comments-wrap">
                    <p id = "comm"> Comments:</p> ${c}
                    </div>
                `
            }
            fillData()
            submitComment.addEventListener("click", event => {
                if(commentValue.value !== ""){
                    comments.push({ cUser: JSON.parse(localStorage.getItem("blogLogin"))["email"], cText: commentValue.value, cDate: Date.now() })
                    fillData()
                    searchPost.comments = comments
                    localStorage.setItem("blogPosts", JSON.stringify(blogPosts))
                    commentValue.value = ""
                    commentValue.hidden = true
                    submitComment.hidden = true
                }else{
                    alert("empty comment")
                }                
            })
        } else {
            alert("No Post Found!")
        }
    }
}

