fetch("http://localhost:3000/api/news")
  .then(res => res.json())
  .then(data => {
    console.log(data); // ดูข้อมูลก่อน

    const container = document.getElementById("news");
    container.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.content}</p>
        <hr>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => console.error(err));
