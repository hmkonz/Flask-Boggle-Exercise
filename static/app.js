$(document).ready(function () {
  $("form").on("submit", async function (event) {
    event.preventDefault();
    const word = $("#word").val();
    const response = await axios.post("/check-word", {
      params: { word: word },
    });
    console.log(response.data);
    $("p").append(response.data);
  });
});

let score = 0;
let foundWord = [];
// if result =='ok' (is valid), score += word.length foundWord=word.push(word)
