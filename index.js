import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

// 🧩 Firebase setup
const firebaseConfig = {
    databaseURL: "https://lead-tracker-351ab-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

// 🧠 DOM elements
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

// ✨ Render the leads list
function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        let url = leads[i]
        if (!/^https?:\/\//i.test(url)) {
            if (url.startsWith("www.")) {
                url = "https://" + url
            } else {
                url = "https://www." + url
            }
        }

        listItems += `
            <li>
                <a target="_blank" href="${url}">
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

// 🔄 Re-render when Firebase updates
onValue(referenceInDB, function(snapshot) {
    if (snapshot.exists()) {
        const leads = Object.values(snapshot.val())
        render(leads)
    } else {
        ulEl.innerHTML = ""
    }
})

// 🗑️ Delete all leads on double click
deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = ""
})

// 💾 Add new lead (with auto URL fix)
inputBtn.addEventListener("click", function() {
    let value = inputEl.value.trim()
    if (value === "") return

    // Normalize the URL
    if (!/^https?:\/\//i.test(value)) {
        if (value.startsWith("www.")) {
            value = "https://" + value
        } else {
            value = "https://www." + value
        }
    }

    // Basic URL validation
    try {
        new URL(value)
        push(referenceInDB, value)
        inputEl.value = ""
    } catch {
        alert("⚠️ Gurl, that doesn’t look like a valid URL!")
    }
})
