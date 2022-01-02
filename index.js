const currentPage = window.location.pathname.replace("/", "").replace(".html", "")

if (localStorage.getItem("blogRegister") == "" || localStorage.getItem("blogRegister") == null) {
    localStorage.setItem("blogRegister", JSON.stringify([]))
}
const register = JSON.parse(localStorage.getItem("blogRegister"));

if (localStorage.getItem("blogPosts") == "" || localStorage.getItem("blogPosts") == null) {
    localStorage.setItem("blogPosts", JSON.stringify([]))
}
const blogPosts = JSON.parse(localStorage.getItem("blogPosts"));
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
                    // email, e syshtoto kato email: email, 
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
        if (password !== "" && password === confirmPassword) {
            if (email == "") {
                alert("Empty email")
            } else {
                const existingUser = register.find((currentObj) => currentObj.email == email)
                if (existingUser) {
                    alert("User Exists Already")
                } else {
                    register.push({ email, password })
                    localStorage.setItem("blogRegister", JSON.stringify(register))
                    console.log(register)
                    alert("Registered!")
                    location.href = `/index.html`;
                }
            }
        } else {
            alert("Passwords dont match")
        }
    })
} else if (currentPage == "post") {
    if (false) {

    } else {
        const submit = document.getElementById("submit-post");
        submit.addEventListener("click", event => {
            const titleValue = document.getElementById("title-post").value;
            const postValue = document.getElementById("post").value;
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
            // to do : proveri za unikalni zaglaviq
            location.href = `/index.html`;
        });
    }
} else if (currentPage == "index") {
    const posts = document.querySelector(".div-post");
    const listPost = document.getElementById("list");
    const logOut = document.querySelector(".logOut");
    const creatPost = document.getElementById("creat-post");
    const logIn = document.getElementById("log-in");

    logIn.addEventListener("click", event => {
        location.href = `/login.html`;
    });

    if (window.location.search == "") {
        listPost.innerHTML = ""
        blogPosts.forEach(({ title, comments, date }) => {
            const d = new Date(date)
            listPost.innerHTML += `
                <li><a href="/index.html?title=${title}">
                    <h3>${title}</h3>
                    <p>From: ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}</p>
                    <p> Comment Number: ${comments.length}</p>
                </a></li>`
        });
    } else {
        document.getElementById("back-main").removeAttribute("hidden");

        const searchTitle = window.location.search.replace("?title=", "")
        const searchPost = blogPosts.find(({ title }) => title == searchTitle)

        if (searchTitle) {
            const { title, comments, date, user, post } = searchPost;
            const d = new Date(date)
            let c = comments.reduce((total, { cUser, cText, cDate }) => {
                const cd = new Date(cDate)
                return `${total}<div>
                        <h2>${cUser}</h2>
                        <h3>${cd.getDate()}/${(cd.getMonth()+1)}/${cd.getFullYear()}</h3>
                        <h4>${cText}</h4>
                    </div>`
            }, "")
            if (c == "") {
                c = "No Comments"
            }
            listPost.innerHTML = `
                    <h2>${title}</h2>
                    <h2>${user}</h2>
                    <h3>From: ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}</h3>
                    <h4>Post: ${post}</h4>
                    <div> Comments: ${c}</div>
                `

        } else {
            alert("No Post Found!")
        }
    }

    if (isLogged()) {
        logOut.removeAttribute("hidden");
        creatPost.removeAttribute("hidden");
        logOut.addEventListener("click", event => {
            localStorage.setItem("blogLogin", JSON.stringify(""));
            alert("click")
            location.href = `/index.html`;
        })
        console.log(isLogged())
    } else {
        logIn.removeAttribute("hidden")
    }
}
