
const imageUpload = document.getElementById('image-upload');
const resultDiv = document.getElementById('result');
const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";
const faceModelsReady = (window.faceapi && window.faceapi.nets)
  ? Promise.all([
      window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])
  : Promise.reject(new Error("face-api.js not loaded"));
const MATCH_THRESHOLD = 0.55;

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";
const IDOL_QUERY = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?idol ?idolLabelKo ?idolLabelEn (SAMPLE(?groupLabel) AS ?groupLabel) ?image WHERE {
  ?idol wdt:P31 wd:Q5;
        wdt:P106 wd:Q521987;
        wdt:P18 ?image.
  OPTIONAL { ?idol wdt:P463 ?group. }
  OPTIONAL { ?idol rdfs:label ?idolLabelKo FILTER (lang(?idolLabelKo)="ko") }
  OPTIONAL { ?idol rdfs:label ?idolLabelEn FILTER (lang(?idolLabelEn)="en") }
  OPTIONAL { ?group rdfs:label ?groupLabel FILTER (lang(?groupLabel)="en") }
}
GROUP BY ?idol ?idolLabelKo ?idolLabelEn ?image
LIMIT 200
`;
const idolDescriptorCache = new Map();
let idolCache = null;
let idolFetchPromise = null;

async function loadImage(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  return img;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function cropToFaceSquare(dataUrl) {
  const img = await loadImage(dataUrl);
  let box = null;

  try {
    await faceModelsReady;
    const detection = await window.faceapi.detectSingleFace(
      img,
      new window.faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
    );
    if (detection) {
      box = detection.box;
    }
  } catch {
    // Fallback to center crop if model fails
  }

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const minSide = Math.min(imgW, imgH);

  let size = minSide;
  let sx = (imgW - size) / 2;
  let sy = (imgH - size) / 2;

  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    size = Math.min(Math.max(box.width, box.height) * 1.6, imgW, imgH);
    sx = clamp(cx - size / 2, 0, imgW - size);
    sy = clamp(cy - size / 2, 0, imgH - size);
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(size);
  canvas.height = Math.round(size);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

async function getFaceDescriptor(img) {
  await faceModelsReady;
  const detection = await window.faceapi.detectSingleFace(
    img,
    new window.faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
  ).withFaceLandmarks().withFaceDescriptor();
  return detection ? detection.descriptor : null;
}

async function fetchIdols() {
  if (idolCache) {
    return idolCache;
  }
  if (idolFetchPromise) {
    return idolFetchPromise;
  }

  idolFetchPromise = (async () => {
    const url = `${WIKIDATA_SPARQL_URL}?format=json&query=${encodeURIComponent(IDOL_QUERY)}`;
    let errorContext = "";
    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/sparql-results+json" }
      });
      if (!response.ok) {
        errorContext = `HTTP ${response.status}`;
        throw new Error("Failed to fetch idol data");
      }
      const data = await response.json();
      const unique = new Map();
      for (const row of data.results.bindings) {
        const name = row.idolLabelKo?.value || row.idolLabelEn?.value || "";
        if (!name || !row.image?.value) {
          continue;
        }
        const key = `${name}|${row.image.value}`;
        if (!unique.has(key)) {
          unique.set(key, {
            name,
            group: row.groupLabel?.value || "Solo",
            image: row.image.value
          });
        }
      }

      const list = Array.from(unique.values());
      if (list.length < 100) {
        errorContext = `Found only ${list.length}`;
        throw new Error("Not enough idols returned from query");
      }

      idolCache = list.slice(0, 100);
      return idolCache;
    } catch (error) {
      throw new Error(`Wikidata fetch failed (${errorContext || "unknown"}): ${error.message}`);
    }
  })();

  return idolFetchPromise;
}

async function buildIdolDescriptors(idols, statusEl) {
  const concurrency = 4;
  let index = 0;
  let processed = 0;

  async function worker() {
    while (index < idols.length) {
      const current = idols[index];
      index += 1;
      if (!idolDescriptorCache.has(current.image)) {
        try {
          const img = await window.faceapi.fetchImage(current.image);
          const descriptor = await getFaceDescriptor(img);
          if (descriptor) {
            idolDescriptorCache.set(current.image, descriptor);
          }
        } catch {
          // Skip images that fail to load or detect
        }
      }
      processed += 1;
      if (statusEl && processed % 10 === 0) {
        statusEl.textContent = `아이돌 얼굴 분석 중... ${processed}/${idols.length}`;
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return idolDescriptorCache;
}

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      resultDiv.innerHTML = '';
      const status = document.createElement('p');
      status.textContent = '사진을 분석 중...';
      resultDiv.appendChild(status);

      const userImg = await loadImage(e.target.result);
      const userDescriptor = await getFaceDescriptor(userImg);
      if (!userDescriptor) {
        status.textContent = '얼굴을 찾지 못했어요. 다른 사진을 올려주세요.';
        return;
      }

      let idols;
      try {
        status.textContent = '아이돌 데이터 불러오는 중...';
        idols = await fetchIdols();
      } catch (error) {
        status.textContent = '아이돌 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';
        const debug = document.createElement('small');
        debug.className = 'error-detail';
        debug.textContent = error.message || 'unknown error';
        resultDiv.appendChild(debug);
        return;
      }

      status.textContent = `아이돌 얼굴 분석 중... 0/${idols.length}`;
      const descriptors = await buildIdolDescriptors(idols, status);

      let bestMatch = null;
      let bestDistance = Infinity;
      for (const idol of idols) {
        const idolDesc = descriptors.get(idol.image);
        if (!idolDesc) {
          continue;
        }
        const distance = window.faceapi.euclideanDistance(userDescriptor, idolDesc);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = idol;
        }
      }

      if (!bestMatch) {
        status.textContent = '아이돌 얼굴을 인식하지 못했어요. 잠시 후 다시 시도해주세요.';
        return;
      }

      if (bestDistance > MATCH_THRESHOLD) {
        status.textContent = '닮은꼴을 찾기 어려워요. 다른 사진으로 시도해주세요.';
        return;
      }

      const croppedUrl = await cropToFaceSquare(e.target.result);
      const userImage = document.createElement('img');
      userImage.src = croppedUrl;
      userImage.className = 'result-image';
      const userWrap = document.createElement('div');
      userWrap.className = 'result-card';
      const userTitle = document.createElement('p');
      userTitle.className = 'result-title';
      userTitle.textContent = '업로드한 사진';
      const userFrame = document.createElement('div');
      userFrame.className = 'result-image-wrap';
      userFrame.appendChild(userImage);
      userWrap.appendChild(userTitle);
      userWrap.appendChild(userFrame);

      const idolImage = document.createElement('img');
      idolImage.src = bestMatch.image;
      idolImage.alt = `${bestMatch.name} 사진`;
      idolImage.className = 'idol-image';
      const idolWrap = document.createElement('div');
      idolWrap.className = 'result-card';
      const idolTitle = document.createElement('p');
      idolTitle.className = 'result-title';
      idolTitle.textContent = '닮은 아이돌';
      const idolName = document.createElement('p');
      idolName.className = 'idol-name';
      idolName.textContent = `${bestMatch.group}의 ${bestMatch.name}`;
      idolWrap.appendChild(idolTitle);
      idolWrap.appendChild(idolImage);
      idolWrap.appendChild(idolName);

      resultDiv.innerHTML = '';
      const block = document.createElement('div');
      block.className = 'idol-result';
      block.appendChild(userWrap);
      block.appendChild(idolWrap);
      resultDiv.appendChild(block);
    };
    reader.readAsDataURL(file);
  }
});
