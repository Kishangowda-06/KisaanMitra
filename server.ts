import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// Fallback agricultural knowledge base
interface DiagnosisResult {
  plantIdentification: string;
  probableIssue: string;
  confidence: number;
  observedSymptoms: string[];
  possibleCauses: string[];
  recommendedSteps: string[];
  preventiveMeasures: string[];
  whenToSeekExpert: string;
  organicRemedies: string[];
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  disclaimer: string;
}

function getFallbackDiagnosis(description: string = '', cropName: string = ''): DiagnosisResult {
  const query = `${description} ${cropName}`.toLowerCase();

  if (query.includes('yellow') && (query.includes('leaf') || query.includes('leaves') || query.includes('spot'))) {
    return {
      plantIdentification: cropName || 'Solanaceae Crop (Tomato / Chilli / Potato)',
      probableIssue: 'Early Blight (Alternaria solani) & Potential Nitrogen/Magnesium Deficiency',
      confidence: 88,
      observedSymptoms: [
        'Concentric dark rings (target-board pattern) on older lower leaves',
        'Yellow halo surrounding necrotic spots',
        'Premature leaf drop and leaf chlorosis',
        'Slight leaf curl and lower canopy thinning'
      ],
      possibleCauses: [
        'High humidity (>80%) accompanied by warm temperatures (24-29°C)',
        'Water splash on lower leaves during furrow irrigation or heavy rainfall',
        'Inadequate spacing reducing air circulation among plants',
        'Soil nitrogen depletion in fast-vegetative stage'
      ],
      recommendedSteps: [
        'Prune and safely dispose of infected lower leaves at least 25-30 cm from ground level',
        'Water at base of the stem (drip irrigation preferred) to keep foliage dry',
        'Apply organic copper-based fungicide or Trichoderma viride biological culture (5g/L water)',
        'Apply well-decomposed cow dung compost / vermicompost to replenish micronutrients',
        'Avoid working in the field while plants are wet to prevent pathogen dispersal'
      ],
      preventiveMeasures: [
        'Rotate crops with non-solanaceous crops (maize, pulses, millet) for 2 seasons',
        'Maintain proper row spacing (60 x 45 cm for tomatoes) for adequate sunlight and airflow',
        'Mulch soil with dry straw to prevent fungal spores from splashing up',
        'Use certified disease-free seeds or resistant hybrid cultivars'
      ],
      whenToSeekExpert: 'If yellowing spreads to upper third of canopy within 72 hours, or if dark lesions appear on main stem and fruit calyx, immediately contact your local Krishi Vigyan Kendra (KVK) or extension officer.',
      organicRemedies: [
        'Neem oil spray (5ml/L of water with 1ml mild liquid soap) applied in late evening',
        'Panchagavya foliar spray (30ml/L of water) every 10-14 days',
        'Sour buttermilk spray (50ml fermented buttermilk in 1L water) against early fungal spore germination'
      ],
      severity: 'Moderate',
      disclaimer: 'AI recommendations are for informational guidance. For severe crop damage, rapid wilting, or uncertain cases, consult a certified agronomist or local Agricultural Extension Service (KVK).'
    };
  }

  if (query.includes('wilt') || query.includes('droop') || query.includes('dry')) {
    return {
      plantIdentification: cropName || 'Horticultural / Solanaceous Plant',
      probableIssue: 'Bacterial Wilt (Ralstonia solanacearum) or Root Rot (Fusarium spp.)',
      confidence: 84,
      observedSymptoms: [
        'Rapid daytime wilting followed by partial overnight recovery initially',
        'Leaves remain green while drooping rather than gradual yellowing',
        'Browning or vascular discoloration inside lower stem tissue',
        'Stunted growth and secondary adventitious root development on stem'
      ],
      possibleCauses: [
        'Waterlogging and poorly drained heavy clay soils',
        'Soil-borne pathogen entering through mechanical root wounds during weeding',
        'High soil temperature and humid conditions',
        'Continuous monoculture of susceptible solanaceous crops'
      ],
      recommendedSteps: [
        'Inspect soil moisture; avoid excessive irrigation and improve drainage trenches',
        'Uproot and burn severely wilted plants to prevent spreading via irrigation channels',
        'Drench root zone with Pseudomonas fluorescens (10g/L) or Trichoderma harzianum',
        'Do not cultivate or disturb roots of adjacent healthy plants'
      ],
      preventiveMeasures: [
        'Raise planting beds by 15-20 cm to enhance soil aeration and drainage',
        'Solarize nursery and field beds during peak summer months with transparent polyethylene sheets',
        'Apply 250 kg neem cake per acre during land preparation',
        'Practice 3-year crop rotation with paddy or sorghum'
      ],
      whenToSeekExpert: 'Bacterial wilt can spread rapidly through shared irrigation water. Contact your block agriculture development officer for soil testing and wilt-resistant rootstock recommendations.',
      organicRemedies: [
        'Application of Pseudomonas fluorescens biopesticide drenching',
        'Neem cake incorporation in soil around root zones',
        'Bio-fertilizer consortium (Azotobacter + PSB)'
      ],
      severity: 'High',
      disclaimer: 'AI recommendations are for informational guidance. For severe crop damage, rapid wilting, or uncertain cases, consult a certified agronomist or local Agricultural Extension Service (KVK).'
    };
  }

  if (query.includes('insect') || query.includes('pest') || query.includes('caterpillar') || query.includes('hole') || query.includes('bug') || query.includes('whitefly')) {
    return {
      plantIdentification: cropName || 'Vegetable / Grain Plant',
      probableIssue: 'Sucking Pest Complex (Whiteflies / Aphids) or Fruit Borer Infestation',
      confidence: 89,
      observedSymptoms: [
        'Curling of young tender leaves upward or downward',
        'Sticky honeydew secretion with black sooty mold growth',
        'Small puncture marks or visible tiny green/white nymphs under leaf surface',
        'Premature blossom drop and erratic fruit development'
      ],
      possibleCauses: [
        'Dry hot spells followed by brief humidity bursts favoring pest reproduction',
        'Absence of beneficial natural predators (ladybird beetles, hoverfly larvae)',
        'Excessive synthetic nitrogen fertilizer causing soft, lush succulent foliage',
        'Weed hosts harboring alternate pest generations nearby'
      ],
      recommendedSteps: [
        'Install yellow sticky traps (6-8 per acre) at crop canopy height for whiteflies and aphids',
        'Spray cold-pressed Neem Seed Kernel Extract (NSKE 5%) or 10,000 ppm Neem Oil (3ml/L)',
        'Spray strong water jet on underside of leaves in early morning to dislodge nymphs',
        'Balance fertilizer inputs; reduce excessive nitrogen and supplement potash (SOP/MOP)'
      ],
      preventiveMeasures: [
        'Plant border trap crops like African Marigold or Maize around the vegetable plot',
        'Preserve predatory insects like Chrysoperla carnea (green lacewing) and coccinellids',
        'Keep field borders free from Parthenium and weed reservoirs',
        'Inspect leaf undersides weekly using a simple magnifying hand lens'
      ],
      whenToSeekExpert: 'If economic threshold level (ETL) exceeds 5-8 whiteflies per leaf, consult the district agriculture extension officer to choose an approved selective IPM insecticide.',
      organicRemedies: [
        'Agniastra / Dashaparni herbal decoction spray (200ml per 15L backpack pump)',
        'Beauveria bassiana entomopathogenic fungal spray (5g/L) during cloudy or evening hours',
        'Castor oil smeared yellow plates placed strategically in the plot'
      ],
      severity: 'Moderate',
      disclaimer: 'AI recommendations are for informational guidance. For severe crop damage, rapid wilting, or uncertain cases, consult a certified agronomist or local Agricultural Extension Service (KVK).'
    };
  }

  // Default comprehensive diagnosis
  return {
    plantIdentification: cropName || 'General Agricultural Crop / Horticulture',
    probableIssue: 'Foliar Stress & Micro-Nutrient Imbalance (Zinc/Iron/Magnesium)',
    confidence: 82,
    observedSymptoms: [
      'Interveinal chlorosis (leaf veins remain green while leaf lamina turns pale)',
      'Slight leaf margin curling and stunted internode length',
      'Slow vegetative development compared to normal seasonal benchmark',
      'Mild leaf tip browning due to moisture stress'
    ],
    possibleCauses: [
      'High soil pH (alkaline soil) immobilizing available iron and zinc micronutrients',
      'Erratic irrigation cycles alternating between drought stress and saturation',
      'Suboptimal organic matter in soil profile reducing microbial cation exchange',
      'Cloudy weather or sudden temperature drop altering transpiration rates'
    ],
    recommendedSteps: [
      'Perform a foliar spray of chelated micronutrient mixture (Grade II, 2.5g/L) with sticker',
      'Apply Jeevamrutha or vermiwash (50ml/L) as a bio-stimulant to boost root uptake',
      'Regulate watering schedule to maintain field moisture capacity around 60-70%',
      'Loosen top 3-4 cm of soil gently around basins to aerate compacted root systems'
    ],
    preventiveMeasures: [
      'Conduct regular soil testing every 2-3 years via Soil Health Card scheme',
      'Incorporate green manure crops (Dhaincha / Sunhemp) before seasonal sowing',
      'Maintain continuous organic soil mulch to conserve soil moisture and microbes',
      'Avoid flood irrigation where water pools in depressions'
    ],
    whenToSeekExpert: 'If leaf yellowing turns necrotic or fails to improve within 10 days post foliar nutrition, bring a plant sample to your nearest Krishi Vigyan Kendra or Agriculture University clinic.',
    organicRemedies: [
      'Fermented Jeevamrutha soil application (200 liters per acre)',
      'Foliar spray of seaweed extract (Ascophyllum nodosum, 2ml/L)',
      'Compost tea drenching around plant rhizosphere'
    ],
    severity: 'Low',
    disclaimer: 'AI recommendations are for informational guidance. For severe crop damage, rapid wilting, or uncertain cases, consult a certified agronomist or local Agricultural Extension Service (KVK).'
  };
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Kisan Mitra AI',
    version: '1.0.0',
    hasGeminiKey: !!apiKey,
    demoMode: !apiKey,
    timestamp: new Date().toISOString()
  });
});

// API: Crop Diagnosis (Vision + Description)
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, description, cropName, language = 'English' } = req.body;

    if (!description && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either a plant photograph or a description of the problem.' });
    }

    // If Gemini client is active, run real AI vision/multimodal analysis
    if (aiClient) {
      try {
        const contents: any[] = [];
        
        let promptText = `You are "Kisan Mitra AI", a friendly, highly knowledgeable senior agricultural scientist and agronomist. 
Analyze the provided crop/plant photo and/or description.
User Crop: ${cropName || 'Not specified by farmer'}
Farmer Description: ${description || 'Photo provided'}
Language preferred: ${language}

Provide a structured, safe, empathetic, practical agricultural diagnosis.
Guidelines:
- Never claim guaranteed 100% diagnosis; always state probable diagnosis and observations vs inferences.
- Prefer safe, sustainable, organic, and integrated pest management (IPM) practices.
- Avoid recommending hazardous chemical cocktails or unsafe pesticide dosages without soil/regulatory context.
- Advise when to contact local Krishi Vigyan Kendra (KVK) / agricultural extension office.
- Output MUST be valid JSON strictly matching the schema.`;

        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
          contents.push({
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          });
        }

        contents.push({ text: promptText });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: contents },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                plantIdentification: { type: Type.STRING, description: 'Likely plant/crop species identified' },
                probableIssue: { type: Type.STRING, description: 'Probable disease, pest, or physiological stress' },
                confidence: { type: Type.NUMBER, description: 'Confidence percentage (e.g. 85)' },
                observedSymptoms: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of observed physical symptoms on leaves, fruit, stem, or soil'
                },
                possibleCauses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Farmer-friendly explanation of why this happened'
                },
                recommendedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Immediate practical, safe, actionable steps'
                },
                preventiveMeasures: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Long-term preventive farm practices'
                },
                whenToSeekExpert: { type: Type.STRING, description: 'Guidelines on when to consult local agronomist/KVK' },
                organicRemedies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Safe organic or biological control options'
                },
                severity: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Severe'] },
                disclaimer: { type: Type.STRING, description: 'Clear disclaimer about informational guidance' }
              },
              required: [
                'plantIdentification',
                'probableIssue',
                'confidence',
                'observedSymptoms',
                'possibleCauses',
                'recommendedSteps',
                'preventiveMeasures',
                'whenToSeekExpert',
                'organicRemedies',
                'severity',
                'disclaimer'
              ]
            }
          }
        });

        const textOutput = response.text?.trim() || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, diagnosis: parsed, source: 'gemini-3.8-flash' });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to agricultural knowledge base:', geminiError?.message || geminiError);
        // Fall back gracefully
      }
    }

    // Fallback response
    const fallback = getFallbackDiagnosis(description, cropName);
    return res.json({ success: true, diagnosis: fallback, source: 'knowledge-engine-demo' });
  } catch (err: any) {
    console.error('Error analyzing plant:', err);
    res.status(500).json({ error: 'Failed to process crop analysis. Please try again.' });
  }
});

// API: Agricultural Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userRole = 'farmer' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid message stream' });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    if (aiClient) {
      try {
        const systemPrompt = `You are Kisan Mitra AI, a warm, experienced, and helpful agricultural advisor designed for farmers and consumers in India and global farming communities.
You assist with:
- Crop health, organic manures, soil care, natural farming (ZBNF), water conservation (drip/sprinkler).
- Weather precautions, seasonal sowing advice (Kharif, Rabi, Zaid).
- Direct farm-to-consumer marketplace best practices, packaging, organic certification.
- Government agricultural programs (PM-KISAN, Kisan Credit Card, Soil Health Card, e-NAM).

Tone: Respectful, practical, encouraging, clear, using simple terms.
Always caution against harmful synthetic chemical usage and advise consulting the local agricultural extension officer (Krishi Vigyan Kendra) for large-scale outbreaks.
Keep answers structured with bullet points.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            { text: `System: ${systemPrompt}` },
            ...messages.slice(-6).map((m: any) => ({
              text: `${m.role === 'user' ? 'User' : 'Kisan Mitra AI'}: ${m.content}`
            }))
          ]
        });

        return res.json({ success: true, reply: response.text, source: 'gemini-3.8-flash' });
      } catch (err: any) {
        console.warn('Gemini chat failed, using smart agricultural reply:', err?.message || err);
      }
    }

    // Smart agricultural reply fallback
    let reply = `Namaste! Kisan Mitra AI is here to help your farm prosper.

Regarding your question about **"${lastMessage.slice(0, 60)}"**:

🌱 **Practical Advice & Next Steps:**
1. **Soil & Moisture Check:** Ensure good soil drainage. Avoid water stagnation around stem collars.
2. **Organic Nutrition:** Apply fermented Jeevamrutha or well-rotted vermicompost (2-3 tonnes/acre) to enrich soil beneficial microbes.
3. **Pest / Disease Monitoring:** Inspect leaf undersides early morning. If minor sucking pests appear, spray cold-pressed Neem Oil (5ml/L) with mild surfactant in the evening.
4. **Market Advice:** For maximum harvest value, grade your produce (Grade A/B/C) and list directly on the Kisan Mitra Marketplace to save 15-30% middleman margins.

*Note: For specific regional soil advice or severe blights, please visit your nearest Krishi Vigyan Kendra (KVK).*`;

    return res.json({ success: true, reply, source: 'knowledge-engine-demo' });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// API: Supabase status & order synchronization proxy
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://errpumennbqcszbkpaai.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_whjcU2mE-zp9R3VZqt-HGg_xJCvxrQZ';

app.get('/api/supabase/status', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id&limit=1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    res.json({
      status: 'connected',
      supabaseUrl: SUPABASE_URL,
      statusCode: response.status,
      message: response.ok ? 'Supabase tables responding' : 'Supabase connected, ready for table creation'
    });
  } catch (err: any) {
    res.json({
      status: 'error',
      message: err?.message || 'Failed to reach Supabase backend'
    });
  }
});

app.post('/api/supabase/order', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.order_id) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    // Forward to Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify([order]),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return res.json({ success: true, source: 'supabase-server', data });
    } else {
      const errorText = await response.text();
      console.warn('Supabase server forward response status:', response.status, errorText);
      return res.json({ success: false, status: response.status, message: errorText });
    }
  } catch (err: any) {
    console.error('Server error forwarding order to Supabase:', err);
    res.status(500).json({ error: err?.message || 'Server error' });
  }
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌾 Kisan Mitra AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
