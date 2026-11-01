"use strict";

// Homework 2: loeme postituste andmed JSON-ist ja loome HTML-i JavaScriptiga.
const postsContainer = document.querySelector("#posts-container");

// Loob ühe postituse. Pildid on JSON-is failiteedena (tekstina).
function createPost(post) {
  const article = document.createElement("article");
  article.className = "post";

  const header = document.createElement("header");
  const avatar = document.createElement("img");
  avatar.className = "mini-avatar";
  avatar.src = "images/avatar.jpg";
  avatar.alt = "User avatar";

  const author = document.createElement("strong");
  author.className = "post-author";
  author.textContent = post.author;

  const time = document.createElement("time");
  time.dateTime = post.createdAt;
  // Lisame T00:00:00Z, et kuupäev ei nihkuks ajavööndi tõttu.
  time.textContent = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
  }).format(new Date(post.createdAt + "T00:00:00Z"));
  header.append(avatar, author, time);
  article.appendChild(header);

  if (post.image) {
    const photo = document.createElement("img");
    photo.className = "post-photo";
    photo.src = post.image;
    photo.alt = post.imageAlt || "Post photo";
    article.appendChild(photo);
  }

  const text = document.createElement("p");
  // textContent lisab teksti turvaliselt, mitte HTML-koodina.
  text.textContent = post.text;
  article.appendChild(text);

  const likeButton = document.createElement("button");
  likeButton.className = "like-button";
  likeButton.type = "button";
  likeButton.textContent = "♡ Like";
  likeButton.setAttribute("aria-label", "Like this post");
  likeButton.setAttribute("aria-pressed", "false");
  likeButton.addEventListener("click", () => {
    const liked = likeButton.getAttribute("aria-pressed") === "true";
    likeButton.setAttribute("aria-pressed", String(!liked));
    likeButton.textContent = liked ? "♡ Like" : "♥ Liked";
  });
  article.appendChild(likeButton);
  return article;
}

// Võtab kõik postitused JSON-failist ja kuvab need lehel.
async function loadPosts() {
  if (!postsContainer) return;

  try {
    // TASK 4: Online-allikas. Testimiseks eemalda järgmise rea eest //
    // ja kommenteeri ajutiselt allolev kohalik fetch välja.
    // See avalik URL töötab pärast GitHub Pagesi kasutuselevõttu.
    // const response = await fetch("https://JanTristan0.github.io/WADhomework2/posts.json");

    // TASK 5: Kasutame nüüd projekti sees olevat kohalikku JSON-faili.
    const response = await fetch("./posts.json");

    if (!response.ok) {
      throw new Error("JSON-faili laadimine ebaõnnestus: " + response.status);
    }
    const posts = await response.json();
    if (!Array.isArray(posts)) {
      throw new Error("posts.json peab sisaldama postituste massiivi.");
    }

    const fragment = document.createDocumentFragment();
    posts.forEach(post => fragment.appendChild(createPost(post)));
    postsContainer.replaceChildren(fragment);
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.textContent = "Posts could not be loaded. Check posts.json and GitHub Pages.";
    postsContainer.replaceChildren(message);
  }
}

// Profiilipildile vajutades näitame või peidame kasutaja menüü.
const profileToggle = document.querySelector("#profile-toggle");
const profileMenu = document.querySelector("#profile-menu");

function closeProfileMenu() {
  if (!profileMenu || !profileToggle) return;
  profileMenu.hidden = true;
  profileToggle.setAttribute("aria-expanded", "false");
}

if (profileToggle && profileMenu) {
  profileToggle.addEventListener("click", (event) => {
    event.preventDefault(); // Ei lähe login.html lehele, vaid avab menüü.
    const willOpen = profileMenu.hidden;
    profileMenu.hidden = !willOpen;
    profileToggle.setAttribute("aria-expanded", String(willOpen));
  });

  // Klikk väljaspool menüüd sulgeb selle.
  document.addEventListener("click", (event) => {
    if (!profileToggle.contains(event.target) && !profileMenu.contains(event.target)) {
      closeProfileMenu();
    }
  });

  // Escape-klahv sulgeb samuti menüü.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !profileMenu.hidden) {
      closeProfileMenu();
      profileToggle.focus();
    }
  });
}

loadPosts();
