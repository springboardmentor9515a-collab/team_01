const axios = require('axios');

// Get user's location from IP address
const getLocationFromIP = async (ip) => {
  try {
    // Clean IP address (remove ::ffff: prefix if present)
    const cleanIP = ip.replace(/^::ffff:/, '');
    
    // For localhost/private IPs, use a public IP for testing
    let targetIP = cleanIP;
    if (cleanIP === '127.0.0.1' || cleanIP === '::1' || cleanIP.startsWith('192.168.') || cleanIP.startsWith('10.')) {
      targetIP = ''; // Empty string gets current public IP
    }
    
    const url = targetIP ? `http://ip-api.com/json/${targetIP}` : 'http://ip-api.com/json';
    console.log('Requesting location for IP:', targetIP || 'current public IP');
    
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    
    console.log('IP API Response:', data);
    
    if (data.status === 'success') {
      return {
        latitude: data.lat,
        longitude: data.lon,
        address: `${data.city}, ${data.regionName}, ${data.country}`,
        ip: data.query
      };
    }
    throw new Error(`IP API returned: ${data.message || 'Unknown error'}`);
  } catch (error) {
    console.error('Primary IP service failed, trying fallback...');
    
    // Get targetIP again for fallback
    const cleanIP = ip.replace(/^::ffff:/, '');
    let targetIP = cleanIP;
    if (cleanIP === '127.0.0.1' || cleanIP === '::1' || cleanIP.startsWith('192.168.') || cleanIP.startsWith('10.')) {
      targetIP = '';
    }
    
    // Fallback to ipinfo.io
    try {
      const fallbackUrl = targetIP ? `https://ipinfo.io/${targetIP}/json` : 'https://ipinfo.io/json';
      const fallbackResponse = await axios.get(fallbackUrl, { timeout: 10000 });
      const fallbackData = fallbackResponse.data;
      
      if (fallbackData.loc) {
        const [lat, lon] = fallbackData.loc.split(',');
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          address: `${fallbackData.city}, ${fallbackData.region}, ${fallbackData.country}`,
          ip: fallbackData.ip
        };
      }
    } catch (fallbackError) {
      console.error('Fallback IP service also failed:', fallbackError.message);
    }
    
    throw new Error('All IP geolocation services failed');
  }
};

module.exports = {
  getLocationFromIP
};