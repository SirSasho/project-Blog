const currentPage = window.location.pathname.replace("/", "").replace(".html", "")
if (localStorage.getItem("blogRegister") == "" || localStorage.getItem("blogRegister") == null) {
    localStorage.setItem("blogRegister", JSON.stringify([]))
}
const register = JSON.parse(localStorage.getItem("blogRegister"));
if (localStorage.getItem("blogPosts") == "" || localStorage.getItem("blogPosts") == null) {
    localStorage.setItem("blogPosts", JSON.stringify([]))
}
const blogPosts = JSON.parse(localStorage.getItem("blogPosts"));

if (currentPage == "login") {
    const submitReg = document.getElementById("login-submit");

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
            const titleValue = document.getElementById("title").value;
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
    const listPost = document.getElementById("list");
    if (window.location.search == "") {
        listPost.innerHTML = ""
        blogPosts.forEach(({ title, comments, date }) => {
            const d = new Date(date)
            listPost.innerHTML += `
            <li><a href="/index.html?title=${title}">
                <h2>${title}</h2>
                <h3>From: ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}</h3>
                <h4> Comment Number: ${comments.length}</h4>
            </a></li>`
        });
    } else {
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
            listPost.innerHTML = `<li>
                <h2>${title}</h2>
                <h2>${user}</h2>
                <h3>From: ${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}</h3>
                <h4>Post: ${post}</h4>
                <div> Comments: ${c}</div>
            </li>`
        } else {
            alert("No Post Found!")
        }
    }
}