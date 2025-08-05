const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalysisRequest {
  imageBase64: string;
}

interface NutritionalInfo {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  vitamins: {
    vitaminA: string;
    vitaminC: string;
    vitaminD: string;
    vitaminB12: string;
    calcium: string;
    iron: string;
  };
  confidence: number;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { imageBase64 }: AnalysisRequest = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sua chave da OpenAI deve ser configurada como variável de ambiente no Supabase
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `Analise esta imagem de alimento e forneça informações nutricionais detalhadas. 

Responda APENAS com um JSON válido no seguinte formato exato:
{
  "foodName": "Nome do prato/alimento identificado",
  "calories": número_estimado_de_calorias_totais,
  "macros": {
    "protein": gramas_de_proteina,
    "carbs": gramas_de_carboidratos,
    "fat": gramas_de_gordura,
    "sugar": gramas_de_acucar
  },
  "vitamins": {
    "vitaminA": "quantidade_estimada_com_unidade",
    "vitaminC": "quantidade_estimada_com_unidade",
    "vitaminD": "quantidade_estimada_com_unidade",
    "vitaminB12": "quantidade_estimada_com_unidade",
    "calcium": "quantidade_estimada_com_unidade",
    "iron": "quantidade_estimada_com_unidade"
  },
  "confidence": porcentagem_de_confianca_da_analise
}

Seja preciso nas estimativas baseando-se no tamanho aparente da porção na imagem. Use valores realistas para uma porção típica do alimento identificado.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high"
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API Error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;

    if (!analysisText) {
      return new Response(
        JSON.stringify({ error: "No analysis received from OpenAI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Parse the JSON response from OpenAI
      const nutritionalInfo: NutritionalInfo = JSON.parse(analysisText);
      
      return new Response(
        JSON.stringify(nutritionalInfo),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis results" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});