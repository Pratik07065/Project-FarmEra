import React, { useEffect, useMemo, useState } from "react";
import { Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import NavScrollExample from "../navbar";
import Footer from "../common/footer";

/* ═══════════════════════════════════════════════════════════════
   DISEASE DATABASE (Embedded directly to prevent import errors)
═══════════════════════════════════════════════════════════════ */
const DISEASE_DB = {
  "Pepper__bell___Bacterial_spot": {
    name: "Bacterial Spot", crop: "Bell Pepper",
    symptoms: ["Small, water-soaked spots on leaves", "Spots turn dark brown/black with light centers", "Leaves turn yellow and drop prematurely"],
    treatment: ["Apply copper-based bactericides immediately", "Remove and destroy severely infected plant debris"],
    prevention: ["Plant pathogen-free seeds", "Practice 2-3 year crop rotation", "Avoid overhead watering"]
  },
  "Pepper__bell___healthy": {
    name: "Healthy Plant", crop: "Bell Pepper",
    symptoms: ["Vibrant green leaves", "Strong, upright stems", "No visible spots or pest damage"],
    treatment: ["No active treatment required."],
    prevention: ["Maintain consistent soil moisture", "Apply balanced fertilizers"]
  },
  "Potato___Early_blight": {
    name: "Early Blight", crop: "Potato",
    symptoms: ["Small, dark spots on older leaves", "Spots enlarge to form concentric rings (target board pattern)", "Lower leaves yellow and dry up"],
    treatment: ["Apply fungicides like Mancozeb or Chlorothalonil early", "Remove severely infected lower leaves"],
    prevention: ["Practice 2-3 year crop rotation", "Ensure proper spacing for air circulation"]
  },
  "Potato___Late_blight": {
    name: "Late Blight", crop: "Potato",
    symptoms: ["Irregular, water-soaked spots on leaves", "White fuzzy fungal growth on leaf undersides", "Dark brown lesions on tubers"],
    treatment: ["Immediately destroy infected plants (do not compost)", "Apply preventative copper fungicides", "Harvest tubers only after vines are dead"],
    prevention: ["Plant certified disease-free seed potatoes", "Avoid planting tomatoes near potatoes"]
  },
  "Potato___healthy": {
    name: "Healthy Plant", crop: "Potato",
    symptoms: ["Vibrant green foliage", "Vigorous growth", "No signs of rot or insect damage"],
    treatment: ["No active treatment required."],
    prevention: ["Ensure proper hilling around the base", "Maintain regular watering schedule"]
  },
  "Tomato_Bacterial_spot": {
    name: "Bacterial Spot", crop: "Tomato",
    symptoms: ["Small, dark, water-soaked spots on leaves", "Spots have a yellow halo", "Scab-like spots on green fruit"],
    treatment: ["Spray with copper fungicides", "Prune affected leaves immediately", "Sanitize pruning tools"],
    prevention: ["Use drip irrigation", "Plant resistant tomato varieties"]
  },
  "Tomato_Early_blight": {
    name: "Early Blight", crop: "Tomato",
    symptoms: ["Bullseye patterned spots on lower leaves", "Yellowing tissue surrounding spots", "Dark, sunken lesions on stems"],
    treatment: ["Apply copper or chlorothalonil fungicides", "Prune lowest branches to prevent soil contact"],
    prevention: ["Space plants for airflow", "Stake or cage tomatoes to keep foliage off ground"]
  },
  "Tomato_Late_blight": {
    name: "Late Blight", crop: "Tomato",
    symptoms: ["Large, pale green to brown spots on leaves", "White fuzzy growth in high humidity", "Firm, dark brown spots on fruit"],
    treatment: ["Apply copper-based fungicides immediately", "Remove and bag infected plants"],
    prevention: ["Plant resistant varieties", "Ensure excellent airflow and keep foliage dry"]
  },
  "Tomato_Leaf_Mold": {
    name: "Leaf Mold", crop: "Tomato",
    symptoms: ["Pale green or yellow spots on upper leaf", "Velvety, olive-green mold on the underside", "Infected leaves wither"],
    treatment: ["Improve ventilation immediately", "Apply chlorothalonil fungicides if severe"],
    prevention: ["Maintain low humidity", "Prune plants to open the canopy"]
  },
  "Tomato_Septoria_leaf_spot": {
    name: "Septoria Leaf Spot", crop: "Tomato",
    symptoms: ["Circular spots with dark borders and gray centers", "Tiny black specks in the center of spots", "Starts on lower leaves"],
    treatment: ["Apply fungicides every 7-10 days", "Remove heavily infected leaves"],
    prevention: ["Apply heavy mulch to prevent soil splashing", "Water at the soil level"]
  },
  "Tomato_Spider_mites_Two_spotted_spider_mite": {
    name: "Two-Spotted Spider Mites", crop: "Tomato",
    symptoms: ["Tiny yellow speckles (stippling) on leaves", "Fine webbing on undersides of leaves", "Leaves turn bronze and dry up"],
    treatment: ["Spray foliage with insecticidal soap or neem oil", "Use strong jet of water to wash mites off"],
    prevention: ["Keep plants well-watered", "Wash dust off foliage periodically"]
  },
  "Tomato__Target_Spot": {
    name: "Target Spot", crop: "Tomato",
    symptoms: ["Brown spots with concentric rings on leaves", "Dark, sunken lesions on fruit with distinct rings"],
    treatment: ["Apply broad-spectrum fungicides", "Prune plants to improve airflow"],
    prevention: ["Provide adequate spacing", "Avoid prolonged periods of leaf wetness"]
  },
  "Tomato__Tomato_YellowLeaf__Curl_Virus": {
    name: "Yellow Leaf Curl Virus", crop: "Tomato",
    symptoms: ["Severe stunting", "Leaves curl upward and become cup-shaped", "Flowers drop"],
    treatment: ["No cure exists. Pull up and destroy infected plants", "Spray for whiteflies (the vector)"],
    prevention: ["Plant resistant varieties", "Control whitefly populations using sticky traps"]
  },
  "Tomato__Tomato_mosaic_virus": {
    name: "Mosaic Virus", crop: "Tomato",
    symptoms: ["Light and dark green mottled areas (mosaic pattern)", "Leaves look fern-like or distorted", "Stunted growth"],
    treatment: ["No cure exists. Destroy infected plants immediately", "Do not smoke near plants"],
    prevention: ["Wash hands with soap before handling plants", "Disinfect pruning tools"]
  },
  "Tomato_healthy": {
    name: "Healthy Plant", crop: "Tomato",
    symptoms: ["Deep green, lush leaves", "Strong, sturdy stems", "Vibrant flowering without decay"],
    treatment: ["No active treatment required."],
    prevention: ["Deep, consistent watering", "Regular application of fertilizer"]
  }
};

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .dp-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0faf0 0%, #e8f5e2 50%, #f5faf0 100%);
    font-family: 'Nunito', sans-serif;
    position: relative;
    padding-bottom: 3rem;
  }

  /* ── Floating leaves background ── */
  .dp-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .dp-leaf { position: absolute; opacity: 0.10; animation: floatLeaf linear infinite; }
  .dp-leaf svg { width: 100%; height: 100%; fill: #2d7a2d; }
  @keyframes floatLeaf {
    0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.10; }
    90%  { opacity: 0.10; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  .dp-main { position: relative; z-index: 1; }

  /* ── Hero ── */
  .dp-hero { text-align: center; padding: 2.5rem 1rem 2rem; animation: fadeDown 0.7s ease both; }
  .dp-hero-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    border-radius: 20px; margin-bottom: 14px;
    box-shadow: 0 8px 24px rgba(58,125,68,0.28);
    animation: popIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.3s both;
  }
  .dp-title { font-size: 2.2rem; font-weight: 900; color: #1b4332; margin-bottom: 6px; letter-spacing: -0.5px; }
  .dp-sub { color: #52796f; font-weight: 600; margin: 0; font-size: 1rem; }

  /* ── Cards ── */
  .dp-card {
    background: #fff; border-radius: 24px; padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 16px 48px rgba(58,125,68,0.10);
    position: relative; overflow: hidden;
    animation: fadeUp 0.5s ease both;
    height: 100%;
  }
  .dp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg,#3a7d44,#52b788,#95d5b2,#52b788,#3a7d44);
    background-size: 200%; animation: dpShimmer 3s linear infinite;
  }
  @keyframes dpShimmer { 0%{background-position:0%} 100%{background-position:200%} }

  /* ── Dropzone ── */
  .dp-dropzone {
    border: 2px dashed #95d5b2; border-radius: 16px;
    background: #f8fff9; padding: 2.5rem 1.5rem; text-align: center;
    cursor: pointer; transition: all 0.3s ease; position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .dp-dropzone:hover, .dp-dropzone.active { border-color: #3a7d44; background: #e8f5e2; }
  .dp-drop-icon { font-size: 2.5rem; color: #52b788; margin-bottom: 10px; }
  .dp-drop-text { font-size: 1.1rem; font-weight: 800; color: #2d6a4f; margin-bottom: 4px; }
  .dp-drop-sub { font-size: 0.85rem; color: #74c69d; font-weight: 600; }
  .dp-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  /* ── Image Preview & Scanner ── */
  .dp-preview-wrap {
    position: relative; border-radius: 14px; overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 1.5rem; background: #000;
  }
  .dp-preview-img { width: 100%; height: 300px; object-fit: contain; display: block; opacity: 0.9; }
  .dp-scanner-overlay { position: absolute; inset: 0; pointer-events: none; background: rgba(82, 183, 136, 0.15); }
  .dp-scanner-line {
    position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: #52b788; box-shadow: 0 0 15px 4px rgba(82, 183, 136, 0.8);
    animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  }
  @keyframes scan { 0% { top: 0%; } 100% { top: 98%; } }

  /* ── Buttons ── */
  .dp-btn {
    width: 100%; padding: 14px; border: none; border-radius: 14px;
    background: linear-gradient(135deg,#3a7d44,#52b788); font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800; color: #fff; cursor: pointer;
    transition: all .2s; box-shadow: 0 4px 18px rgba(58,125,68,.30);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .dp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(58,125,68,.40); }
  .dp-btn-outline { background: #f8fff9; color: #3a7d44; border: 2px solid #95d5b2; box-shadow: none; }
  .dp-btn-outline:hover { background: #e8f5e2; border-color: #52b788; }

  /* ── Result Styling ── */
  .dp-res-header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1.5px dashed #d8f3dc; }
  .dp-disease-name { font-size: 1.8rem; font-weight: 900; color: #1b4332; margin: 5px 0; }
  .dp-crop-badge { display: inline-block; padding: 4px 12px; background: #e8f5e2; color: #2d6a4f; border-radius: 20px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
  
  /* Confidence Bar */
  .dp-conf-wrap { display: flex; align-items: center; gap: 10px; background: #f0faf4; padding: 10px 15px; border-radius: 12px; }
  .dp-conf-bar-bg { flex: 1; height: 8px; background: #d8f3dc; border-radius: 4px; overflow: hidden; }
  .dp-conf-bar-fill { height: 100%; background: linear-gradient(90deg, #52b788, #2d6a4f); border-radius: 4px; transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .dp-conf-text { font-weight: 900; color: #1b4332; min-width: 45px; text-align: right; }

  /* Accordion/Info sections */
  .dp-info-sec { margin-top: 1.5rem; }
  .dp-info-title { font-size: 0.95rem; font-weight: 800; color: #2d6a4f; display: flex; align-items: center; gap: 6px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .dp-list { padding-left: 20px; color: #52796f; font-weight: 600; font-size: 0.95rem; margin-bottom: 0; }
  .dp-list li { margin-bottom: 6px; }

  /* ── Keyframes ── */
  @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn    { from{opacity:0;transform:scale(.5) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }
`;

/* ── Leaf SVG Background Component ── */
const LEAF_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z"/></svg>`;
const FloatingLeaves = () => {
  const leaves = Array.from({ length: 10 }, (_, i) => ({
    id: i, left: `${8 + i * 9}%`, size: `${16 + (i % 4) * 6}px`,
    duration: `${12 + (i % 5) * 4}s`, delay: `${i * 1.8}s`,
  }));
  return (
    <div className="dp-bg">
      {leaves.map(l => (
        <div key={l.id} className="dp-leaf" style={{ left: l.left, width: l.size, height: l.size, animationDuration: l.duration, animationDelay: l.delay }} dangerouslySetInnerHTML={{ __html: LEAF_SVG }} />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function DiseasePrediction() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Stores the raw backend response
  const [result, setResult] = useState(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  // Inject Styles
  useEffect(() => {
    if (!document.getElementById("dp-styles")) {
      const styleTag = document.createElement("style");
      styleTag.id = "dp-styles"; styleTag.textContent = STYLES;
      document.head.appendChild(styleTag);
    }
    return () => document.getElementById("dp-styles")?.remove();
  }, []);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setError(""); 
    setResult(null);

    if (!file) {
      setError("Please upload a leaf image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const [response] = await Promise.all([
        fetch("http://127.0.0.1:5000/disease/predict", { method: "POST", body: formData }),
        new Promise(res => setTimeout(res, 1500)) // Force scanner animation to run briefly
      ]);

      const rawBody = await response.text();
      let data = null;
      try { data = rawBody ? JSON.parse(rawBody) : {}; } 
      catch (e) { data = null; }

      if (!response.ok) {
        if (data?.error) throw new Error(data.error);
        if (rawBody.trim().startsWith("<")) throw new Error("Backend API route is not available.");
        throw new Error("Prediction failed. Please check backend logs.");
      }
      if (!data || !("disease" in data)) throw new Error("Invalid response format from backend.");

      setResult(data);

    } catch (err) {
      setError(err.message || "Unable to connect to backend disease prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null); 
    setResult(null); 
    setError("");
  };

  /* BULLETPROOF FALLBACK LOGIC: 
    If the backend sends rich_info, use it.
    If not, look it up in DISEASE_DB. 
    If it's an unknown class, format the ugly string nicely as a fallback.
  */
  const getRichInfo = () => {
    if (!result) return null;
    if (result.rich_info && result.rich_info.symptoms) return result.rich_info;
    if (DISEASE_DB[result.disease]) return DISEASE_DB[result.disease];

    // Extreme fallback if an unknown disease is detected
    const cleanName = result.disease.replace(/___/g, ' - ').replace(/_/g, ' ');
    return {
      name: cleanName,
      crop: "Plant",
      symptoms: ["Specific symptoms not available in database."],
      treatment: [result.solution || "Please consult a local agricultural expert."],
      prevention: ["Maintain standard garden care and hygiene."]
    };
  };

  const info = getRichInfo();

  return (
    <div className="dp-page">
      <NavScrollExample />
      <FloatingLeaves />
      
      <div className="dp-main">
        {/* Hero */}
        <div className="dp-hero">
          <div className="dp-hero-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h1 className="dp-title">Plant Disease AI</h1>
          <p className="dp-sub">Upload a leaf image for instant diagnosis and actionable treatment plans.</p>
        </div>

        <Container>
          <Row className="justify-content-center g-4">
            
            {/* Upload Section */}
            <Col lg={result ? 5 : 6}>
              <div className="dp-card">
                
                {!previewUrl ? (
                  <form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div 
                      className={`dp-dropzone ${dragActive ? "active" : ""}`}
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                      style={{ flex: 1 }}
                    >
                      <input className="dp-file-input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      <div className="dp-drop-icon">📸</div>
                      <div className="dp-drop-text">Drag & drop leaf image</div>
                      <div className="dp-drop-sub">or click to browse files</div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="dp-preview-wrap">
                      <img src={previewUrl} alt="Leaf preview" className="dp-preview-img" />
                      {loading && (
                        <div className="dp-scanner-overlay">
                          <div className="dp-scanner-line" />
                        </div>
                      )}
                    </div>
                    
                    {!loading && !result && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" className="dp-btn dp-btn-outline" onClick={() => setFile(null)}>
                          Change Image
                        </button>
                        <button type="button" className="dp-btn" onClick={handleSubmit}>
                          ✨ Analyze Image
                        </button>
                      </div>
                    )}
                    
                    {loading && (
                      <button className="dp-btn" disabled>
                        <Spinner animation="border" size="sm" />
                        AI is analyzing structure...
                      </button>
                    )}

                    {result && (
                      <button type="button" className="dp-btn dp-btn-outline mt-3" onClick={handleReset}>
                        🔄 Scan Another Plant
                      </button>
                    )}
                  </div>
                )}

                {error && (
                  <Alert variant="danger" className="mt-4 mb-0" style={{ borderRadius: '12px', fontWeight: '600' }}>
                    ⚠️ {error}
                  </Alert>
                )}
              </div>
            </Col>

            {/* Results Dashboard */}
            {result && info && (
              <Col lg={7}>
                <div className="dp-card">
                  <div className="dp-res-header">
                    {info.crop && <span className="dp-crop-badge">{info.crop} Pathogen</span>}
                    <h2 className="dp-disease-name">{info.name}</h2>
                    
                    <div className="dp-conf-wrap mt-3">
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#52796f' }}>AI Confidence</span>
                      <div className="dp-conf-bar-bg">
                        <div className="dp-conf-bar-fill" style={{ width: `${result.confidence || 0}%` }} />
                      </div>
                      <span className="dp-conf-text">{result.confidence}%</span>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="dp-info-sec">
                    <div className="dp-info-title">🔍 Visual Symptoms</div>
                    <ul className="dp-list">
                      {info.symptoms?.map((sym, i) => <li key={i}>{sym}</li>)}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div className="dp-info-sec">
                    <div className="dp-info-title">💊 Treatment Plan</div>
                    <ul className="dp-list">
                      {info.treatment?.map((trt, i) => <li key={i}>{trt}</li>)}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div className="dp-info-sec">
                    <div className="dp-info-title">🛡️ Preventive Measures</div>
                    <ul className="dp-list">
                      {info.prevention?.map((prv, i) => <li key={i}>{prv}</li>)}
                    </ul>
                  </div>

                </div>
              </Col>
            )}
            
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}