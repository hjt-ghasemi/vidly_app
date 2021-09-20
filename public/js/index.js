const USER_API = " https://api.github.com/users/";
const form = $("#form-user");
const input_user = $("#input-user");
const profile_card = $(".profile-card");

$(document).ready(function () {
  // form manipulation
  form.submit(async function (ev) {
    ev.preventDefault();
    const username = input_user.val();
    if (username === "") return;
    const res = await fetch(USER_API + username);
    const user = await res.json();
    fillProfile(user);
    input_user.val("");
  });

  // fill profile
  function fillProfile(user) {
    if (user.message === "Not Found") {
      profile_card.html("<h1 class='not-found'>Not Found User!</h1>");
      return;
    }
    profile_card.html(`<img
    class="avatar-github"
    loading="lazy"
    src="${user.avatar_url}"
    alt="${user.name}"
  />
  <div class="profile-content">
    <h2 class="username">${user.name || "Not Available!"}</h2>
    <small class="login">@${user.login}</small>
    <p class="bio">
      ${user.bio || "Not Available!"}
    </p>
    <ul class="details">
      <li>
        <i class="fa fa-eye fa-lg mr-2" aria-hidden="true"></i>
        <span id="followers">${user.followers}</span>
      </li>
      <li>
        <i class="fa fa-user-plus fa-lg mr-2" aria-hidden="true"></i>
        <span id="following">${user.following}</span>
      </li>
      <li>
        <i class="fa fa-suitcase fa-lg mr-2" aria-hidden="true"></i>
        <span id="repos">${user.public_repos}</span>
      </li>
    </ul>
  </div>`);
  }
});
