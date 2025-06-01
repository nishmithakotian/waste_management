const axios = require("axios");
require("dotenv").config(); 

const checkWaste = async (req, res) => {
  try {

    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required." });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a waste classification assistant. Based on the image provided, identify the primary object (e.g., 'Plastic Bottle'). Classify the given waste item image into one of the following categories: "Dry", "Wet", "Electronics", or "Medical". If the item is not related to waste or cannot be classified under these categories, set "classification": "NA" and write "NA" for all fields in general_solution. Return the result in the following JSON structure:

{
  "prediction": {
    "ITEM_NAME": {
      "classification": "Dry Waste | Wet Waste | Electronics Waste | Medical Waste | NA",
      "general_solution": {
        "disposal": "string or NA",
        "benefits": "string or NA",
        "tips": "string or NA",
        "impact": "string or NA",
        "alternatives": "string or NA",
        "additional_resources": "string or NA"
      }
    }
  }
}

Only return the JSON object.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const rawContent = response.data.choices[0].message.content || "";
    const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
      return res.status(500).json({ error: "Model response is not valid JSON." });
    }

    const parsed = JSON.parse(jsonMatch[1]);
    res.json(parsed);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to call LLM API" });
  }
};

const wasteType =  async (req,res)=> {

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "No image URL provided" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a smart waste classification assistant. 

Given the following image, your tasks are:
1. Identify all visible waste types (e.g., plastic, organic matter, electronics, etc.).
2. Estimate and mention the approximate percentage of each type visible. Write the description like a user posting the image on a waste reporting/recycling platform.
3. Decide the dominant type (majority %) and classify it into one of: "Dry Waste", "Wet Waste", "Electronics Waste", "Medical Waste", or "NA".
4. If the image is not related to waste or recyclables, respond with type: "NA" and description: "NA".

Respond in the following JSON format:
{
  "type": "<Dominant Waste Type>",
  "description": "<Brief summary with % breakdown>"
}
                `.trim()
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  
    const rawContent = response.data.choices[0].message.content || "";
    const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Model response is not valid JSON." });
    }
    const parsed = JSON.parse(jsonMatch[1]);
    res.json(parsed);
    
  } catch (err) {
    res.status(500).json({ error: "Failed to process image", details: err.toString() });
  }

}

module.exports = { 
  checkWaste,
  wasteType
 };