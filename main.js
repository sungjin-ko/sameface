
const imageUpload = document.getElementById('image-upload');
const resultDiv = document.getElementById('result');

// 임시 아이돌 데이터
const idols = [
  { name: "성현우", group: "Limitless" },
  { name: "장우영", group: "VAV" },
  { name: "권애지", group: "Hashtag" },
  { name: "이아인", group: "MOMOLAND" },
  { name: "고아라", group: "Favorite" },
  { name: "조자영", group: "Dal Shabet" },
  { name: "강아형", group: "P.O.P" },
  { name: "김희정", group: "Pink Fantasy" },
  { name: "허유림", group: "Everglow" },
  { name: "송주희", group: "Hello Venus" },
  { name: "앨런 마", group: "CRAVITY" },
  { name: "엠버 조세핀 리우", group: "f(x)" },
  { name: "이서영", group: "GWSN" },
  { name: "엔써니 루오", group: "VARSITY" },
  { name: "박예림", group: "Pink Fantasy" },
  { name: "김선영", group: "Tahiti" },
  { name: "황나윤", group: "RedSquare" },
  { name: "전민재", group: "MIXX" },
  { name: "최예원", group: "Oh My Girl" },
  { name: "곽영민", group: "NU'EST" },
  { name: "하나다 아사히", group: "Treasure" },
  { name: "애슐리 최", group: "Ladies' Code" },
  { name: "양안", group: "NATURE" },
  { name: "박동혁", group: "ENOi" },
  { name: "노윤호", group: "VAV" },
  { name: "이민혁", group: "Block B" },
  { name: "김병주", group: "Topp Dogg" },
  { name: "이영수", group: "14U" },
  { name: "이수정", group: "Lovelyz" },
  { name: "김바다", group: "Hinapia" },
  { name: "김수아", group: "NeonPunch" },
  { name: "강동호", group: "NU'EST" },
  { name: "변백현", group: "EXO" },
  { name: "꾼삐묵 부와꾼", group: "GOT7" },
  { name: "방찬", group: "Stray Kids" },
  { name: "차선우", group: "B1A4" },
  { name: "최충협", group: "VAV" },
  { name: "진성호", group: "1TEAM" },
  { name: "최성훈", group: "DUSTIN" },
  { name: "최윤아", group: "ELRIS" },
  { name: "진현주", group: "Cignature" },
  { name: "배제욱", group: "B.I.G" },
  { name: "최범규", group: "TXT" },
  { name: "유지원", group: "ANS" },
  { name: "남승민", group: "MCND" },
  { name: "김수빈", group: "Hot Blood Youth" },
  { name: "배유빈", group: "Oh My Girl" },
  { name: "김상연", group: "MONT" },
  { name: "이창현", group: "UP10TION" },
  { name: "정가희", group: "Pungdeng-E" },
  { name: "매튜김", group: "KARD" },
  { name: "김보아", group: "SPICA" },
  { name: "김지원", group: "iKON" },
  { name: "김보형", group: "SPICA" },
  { name: "김복은", group: "SIGNAL" },
  { name: "박봄", group: "2NE1" },
  { name: "윤보미", group: "Apink" },
  { name: "최보민", group: "Golden Child" },
  { name: "김보민", group: "RedSquare" },
  { name: "김지연", group: "Cosmic Girls" },
  { name: "최의정", group: "Dreamnote" },
  { name: "윤보라", group: "SISTAR" },
  { name: "김보라", group: "Cherry Bullet" },
  { name: "전보람", group: "T-ara" },
  { name: "진준우", group: "VARSITY" },
  { name: "이병곤", group: "CIX" },
  { name: "최병찬", group: "VICTON" },
  { name: "방민수", group: "Teen Top" },
  { name: "차오루", group: "Fiestar" },
  { name: "저효상", group: "CROSS GENE" },
  { name: "손성준", group: "MCND" },
  { name: "차훈", group: "N.Flying" },
  { name: "김채영", group: "RedSquare" },
  { name: "최유빈", group: "NATURE" },
  { name: "김채현", group: "Bonus Baby" },
  { name: "채진석", group: "MYNAME" },
  { name: "윤채경", group: "APRIL" },
  { name: "이채린", group: "FANATICS" },
  { name: "박채린", group: "Cherry Bullet" },
  { name: "이채령", group: "ITZY" },
  { name: "맹채솔", group: "Cignature" },
  { name: "김채원", group: "APRIL" },
  { name: "김채원", group: "IZ*ONE" },
  { name: "송채연", group: "CRAXY" },
  { name: "정채연", group: "DIA" },
  { name: "김채연", group: "Busters" },
  { name: "이채연", group: "IZ*ONE" },
  { name: "황찬성", group: "2PM" },
  { name: "박찬열", group: "EXO" },
  { name: "김찬용", group: "100%" },
  { name: "김찬영", group: "D-CRUNCH" },
  { name: "김종대", group: "EXO" },
  { name: "청샤오", group: "Cosmic Girls" },
  { name: "중천러", group: "NCT" },
  { name: "장청음", group: "Ho1iday" },
  { name: "지아이", group: "FANATICS" },
  { name: "최치훈", group: "TOO" },
  { name: "허민진", group: "Crayon Pop" },
  { name: "최예림", group: "LOONA" },
  { name: "박초롱", group: "Apink" }
];

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'result-image';
      resultDiv.innerHTML = '';
      const imgWrap = document.createElement('div');
      imgWrap.className = 'result-image-wrap';
      imgWrap.appendChild(img);
      resultDiv.appendChild(imgWrap);

      // 아이돌 목록에서 무작위로 한 명을 선택
      const randomIdol = idols[Math.floor(Math.random() * idols.length)];

      const resultText = document.createElement('p');
      resultText.textContent = `당신은 ${randomIdol.group}의 ${randomIdol.name}을(를) 닮았네요!`;
      resultDiv.appendChild(resultText);
    };
    reader.readAsDataURL(file);
  }
});
