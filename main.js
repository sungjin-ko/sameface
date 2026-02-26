
const imageUpload = document.getElementById('image-upload');
const resultDiv = document.getElementById('result');

// 임시 아이돌 데이터
const idols = [
  { name: "아이유", group: "솔로" },
  { name: "카리나", group: "에스파" },
  { name: "장원영", group: "아이브" },
  { name: "해린", group: "뉴진스" },
  { name: "슬기", group: "레드벨벳" }
];

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.width = 200;
      resultDiv.innerHTML = '';
      resultDiv.appendChild(img);

      // 아이돌 목록에서 무작위로 한 명을 선택
      const randomIdol = idols[Math.floor(Math.random() * idols.length)];

      const resultText = document.createElement('p');
      resultText.textContent = `당신은 ${randomIdol.group}의 ${randomIdol.name}을(를) 닮았네요!`;
      resultDiv.appendChild(resultText);
    };
    reader.readAsDataURL(file);
  }
});
