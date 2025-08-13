const axios = require('axios');

const processDescription = async (rawDescription) => {
  if (!rawDescription || rawDescription === '-') return '-';
  
  try {
    if (process.env.DEEPSEEK_API_KEY) {
      return await callDeepseekAPI(rawDescription);
    } else if (process.env.OPENAI_API_KEY) {
      return await callOpenAI(rawDescription);
    }
    return rawDescription;
  } catch (error) {
    return rawDescription;
  }
};

const callDeepseekAPI = async (description) => {
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model: 'deepseek-chat',
    messages: [{
      role: 'user',
      content: `You are a product description cleaner. From the following seller description, remove irrelevant details such as shipping info or unrelated promotions. Keep only the core product details, rewrite concisely in 1–3 sentences:\n${description}`
    }],
    max_tokens: 150
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.choices[0].message.content.trim();
};

const callOpenAI = async (description) => {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `You are a product description cleaner. From the following seller description, remove irrelevant details such as shipping info or unrelated promotions. Keep only the core product details, rewrite concisely in 1–3 sentences:\n${description}`
    }],
    max_tokens: 150
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.choices[0].message.content.trim();
};

const extractSeries = async (productName) => {
  if (!productName || productName === '-') return '-';
  
  try {
    if (process.env.DEEPSEEK_API_KEY) {
      return await callDeepseekForSeries(productName);
    } else if (process.env.OPENAI_API_KEY) {
      return await callOpenAIForSeries(productName);
    }
    return extractSeriesLocally(productName);
  } catch (error) {
    return extractSeriesLocally(productName);
  }
};

const callDeepseekForSeries = async (name) => {
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model: 'deepseek-chat',
    messages: [{
      role: 'user',
      content: `Extract the product series/model from this Nike product name. Return only the series name (e.g., "Air Max 90", "Air Force 1", "React Element"). Product: ${name}`
    }],
    max_tokens: 50
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.choices[0].message.content.trim();
};

const callOpenAIForSeries = async (name) => {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: `Extract the product series/model from this Nike product name. Return only the series name (e.g., "Air Max 90", "Air Force 1", "React Element"). Product: ${name}`
    }],
    max_tokens: 50
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.choices[0].message.content.trim();
};

const extractSeriesLocally = (name) => {
  const series = [
    'Air Max 90', 'Air Max 95', 'Air Max 97', 'Air Max 270',
    'Air Force 1', 'Air Jordan', 'Dunk', 'Blazer',
    'React Element', 'Zoom', 'Free Run', 'Revolution'
  ];
  
  for (const s of series) {
    if (name.toLowerCase().includes(s.toLowerCase())) {
      return s;
    }
  }
  return '-';
};

module.exports = { processDescription, extractSeries };