document.getElementById("submitBtn").addEventListener("click", async () => {
  const imageInput = document.getElementById("imageInput").files[0];
  const feelingInput = document.getElementById("feelingInput").value;
  const moodInput = document.getElementById("moodInput").value;

  const formData = new FormData();
  formData.append("image", imageInput);
  formData.append("Feeling", feelingInput);
  formData.append("mood", moodInput);

  const response = await fetch("http://127.0.0.1:8000/analyze/", {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
});
